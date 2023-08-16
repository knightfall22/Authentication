const bodyParser = require('body-parser');
const express = require('express');
const { default: mongoose } = require('mongoose');

const MONGO_DB_URI = process.env.MONGO_DB_URI;
const app = express();
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');

const authRouter = require('./routes/auth');

if (process.env.NODE_ENV !== 'test') {
    require('./services/passport')(passport);
}

    app.use(cors());
    app.use(bodyParser.json());
    
    app.use(
        session({
            secret: 'process.env.SECRET_KEY',
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: 5 * 60 * 60 * 1000 // 5 hours in milliseconds
            }
        })
    );


    app.use(passport.initialize());
    app.use(passport.session());


    
    app.use('/api/auth', authRouter)
    

    app.use((err, req, res, next) => {

        const status = err.status || 500
        const message = err.message
        const data = err.data
        
        res.status(status).json({message,data})
    })
    
mongoose.connect(MONGO_DB_URI)
    .then((result) => {
        console.log("Connected to Mongo");
        console.log(`Connected at ${process.env.PORT || 3000}`)

        if (process.env.NODE_ENV !== 'test') {
            app.listen(process.env.PORT || 3000)
        }
        
    })
    .catch(err => console.error(err))

module.exports = app;