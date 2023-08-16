const Jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { promisify } = require('util')
const randomBytesAsync = promisify(require('crypto').randomBytes)


const User = require('../models/User')

const errorHandler = (msg, status) => {
    const error = new Error(msg)
    error.status = status
    throw error
  }
  
  const catchErrorHandler = (error, next) => {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
  
    return next(error)
  }

const postSignIn = async (req, res, next) => {
    const {email, password} = req.body
    
    try {
        const user = await User.findOne({email})
        
        if (!user) {
            errorHandler('User not found', 404)
        }

        const validPassword = await new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, success) => {
                if (err) reject(err)
                resolve(success)
            })
        })

        if (validPassword) {
            const token = Jwt.sign({userId: user._id.toString()}, process.env.SECRET_KEY, {
                expiresIn: '1h'
            })
            res.status(200).send({
                message: 'User logged in successfully',
                user: user._id,
                token
            })
        } else {
            errorHandler('Invalid password', 400)
        }
    } catch (error) {
        catchErrorHandler(error, next)
    }
}

const postSignUp = async (req, res, next) => { 
    const {name, email, password, confirmPassword} = req.body

    
    try {

        if (password !== confirmPassword) {
            errorHandler('Passwords do not match', 400)
        }
        
        const exists = await User.findOne({email})
        
        if (exists) {
            errorHandler('User already exists', 409)
        }

        const hashedPassword = await new Promise((resolve, reject) => {
            bcrypt.hash(password, 12, function(err, hash) {
            if (err) reject(err)
            resolve(hash)
            });
        })
        
        const user = new User({name, email, password: hashedPassword})
        const result = await user.save()

        res.status(201).send({
            message: 'User created successfully',
            user: result._id
        })
    } catch (err) {
        catchErrorHandler(err, next)
    }
}

const getProfile = async (req, res, next) => { 
    
    try {
        const user = await User.findById(req.userId)

        if (!user) {
            errorHandler('User not found', 404)
        }

        res.status(200).send({
            message: 'User profile fetched successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            }
        })

    } catch (error) {
        catchErrorHandler(error, next)
    }
}

const postResetPassword = async (req, res, next) => {
    const {email} = req.body

    try {
        const user = await User.findOne({email})

        if (!user) {
            errorHandler('User not found', 404)
        }

        const resetToken = await randomBytesAsync(20).then(buf => buf.toString('hex'))
        user.reset.resetToken = resetToken
        user.reset.resetTokenExpires = Date.now() + 7600000 // 2 hours
        
        if (user.reset.resetCountExpires) {
            if (new Date() >= user.reset.resetCountExpires) {
                user.reset.resetCount = 0
                user.reset.resetCountExpires = undefined
            }
        }
        if (user.reset.resetCount >= 10) {
            errorHandler('Too many attempts try again in 6 hours', 429)
            
        }
        
        user.reset.resetCountExpires = Date.now() + 21600000 // 6 hours
        user.reset.resetCount++
        await user.save()

        
        return res.status(200).send({
            passwordResetToken: resetToken
        })
        // const emailTest = await transport.sendMail({
        //     to: "omotesho066@gmail.com",
        //     from: process.env.API_EMAIL,
        //     subject: 'Password Reset',
        //     html: `
        //         <p>You requested a password reset</p>
        //         <p>Click this <a href="http://localhost:3000/reset/${resetToken}"> link</a> to set a new password </p>
        //     `
        // })

    } catch (error) {
        catchErrorHandler(error, next)
    }
}

const postNewPassword = async (req, res, next) => { 
    const token = req.body.token;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    try {

        if (password !== confirmPassword) {
            errorHandler('Passwords do not match', 400)
        }
        const user = await User.findOne(
            {
               'reset.resetToken': token,
                'reset.resetTokenExpires': {
                    $gt: Date.now()
                }
            }
        )

        if (!user) {
            errorHandler('Invalid token or user', 400)
        }


        const hashedPassword = await new Promise((resolve, reject) => {
            bcrypt.hash(password, 12, function(err, hash) {
            if (err) reject(err)
            resolve(hash)
            });
        })

        user.password = hashedPassword
        user.reset.resetToken = undefined
        user.reset.resetTokenExpires = undefined
        user.reset.resetCount = undefined
        user.reset.resetCountExpires = undefined
        await user.save()

        return res.status(200).send({
            message: 'Password changed successfully'
        })
    }
    catch (error) {
        catchErrorHandler(error, next)
    }
}


module.exports = {postSignIn, postSignUp, getProfile, postResetPassword, postNewPassword}