const mongoose = require('mongoose');
const validator = require("validator")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid")
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error("Password should not contain 'password'")
            }
        }
    },
    role: {
        type: String,
        default: "user"
    }
});

userSchema.methods.toJSON = function () {
    const userObject = this.toObject()

    delete userObject.password
    return userObject
}

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
module.exports = mongoose.model("User", userSchema);