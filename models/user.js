const mongoose = require('mongoose');
const validator = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const sendPasswordResetEmail = require("../controllers/email.js");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        mobile: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: validator.isEmail,
                message: 'Invalid email address',
            },
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 6,
            validate: {
                validator: function (value) {
                    return !value.toLowerCase().includes('password');
                },
                message: 'Password should not contain the word "password"',
            },
        },
        role: {
            type: String,
            default: 'user',
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },
        cart: {
            type: Array,
            default: [],
        },
        refreshToken: {
            type: String
        },
        address: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Address',
            },
        ],
        wishlist: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
        ],
    },
    {
        timestamps: true,
    }
);

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})

userSchema.methods.isPasswordMatch = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.resetPassword = function () {
    const { id, email } = this
    const payload = { id, email }
    const RESET_TOKEN_SECRET = process.env.RESET_PASSWORD_SECRET + this.password
    const resetToken = jwt.sign(payload, RESET_TOKEN_SECRET, { expiresIn: '15m' })

    sendPasswordResetEmail(email, id, resetToken)
}

module.exports = mongoose.model("User", userSchema);