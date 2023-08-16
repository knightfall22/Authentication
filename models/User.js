const { default: mongoose } = require("mongoose");
const findOrCreate = require ('mongoose-findorcreate')

const Schema = mongoose.Schema

const UserSchema = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: { 
        type: String,
    },

    reset: {
        resetToken: {
            type: String,
        },

        resetTokenExpires: {
            type: Date,
        },

        resetCount: {
            type: Number,
            default: 0
        },

        resetCountExpires: {
            type: Date,
        }
    },
    
    googleId: String,
    displayName: String,
})

UserSchema.plugin(findOrCreate)
module.exports = mongoose.model("User", UserSchema)