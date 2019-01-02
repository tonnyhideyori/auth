const mongoose = require("mongoose")
const Joi = require("joi")
const config = require("config")
const jwt = require("jsonwebtoken")
const key=require("../keys/dev")
//user model
let user = new mongoose.Schema({
    name: String,
    password: String
})

user.methods.generateAuthtoken = function () {
    const token = jwt.sign({
        _id: this._id
    }, config.get("jwtPrivateKey"))
    return token
}

const User = mongoose.model("User", user)

function validate(user) {
    const schema = {
        name: Joi.string().required(),
        password: Joi.string().min(5).required()
    }
    return Joi.validate(user, schema)
}

exports.User = User
exports.validate = validate