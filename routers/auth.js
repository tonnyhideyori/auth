const express = require("express")
const bycrpt = require('bcrypt')
const {
    User,
    validate
} = require('../models/user')

const router = express.Router()

router.post("/api/signup", async (req, res) => {
    const {
        error
    } = validate(req.body)
    if (error) {
        res.status(404).send(error.details[0].message)
        return
    }
    let user = await User.findOne({
        name: req.body.name
    })
    if (user) {
        res.status(400).send("the user already exists change the number")
        return
    }
    user = new User({
        name: req.body.name,
        password: req.body.password
    })
    const salt = await bycrpt.genSalt(10)
    user.password = await bycrpt.hash(user.password, salt)
    user = await user.save()
    const token = user.generateAuthtoken()
    res.header("token", token).send({
        token: token,
        user: {
            name: user.name,
            id: user._id
        }
    })
})
router.post("/api/login", async (req, res) => {
    const {
        error
    } = validate(req.body)
    if (error) {
        res.status(404).send(error.details[0].message) 
        return
    }
    let user= await User.findOne({name:req.body.name})
    if(!user){
        res.status(400).send("invalide password or name")
        return
    }
    const validPassword=await bycrpt.compare(req.body.password,user.password)
    if(!validPassword){
        res.status(400).send("invalide password or name")
     return
    }
    const token=user.generateAuthtoken()
    res.header("authtoken",token).send({token,user:{id:user._id,name:user.name}})
})

module.exports = router