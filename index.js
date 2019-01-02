 const express = require('express')
 const mongoose = require("mongoose")
 const app = express()
 const cors=require("cors")
 const user=require("./routers/auth")
 mongoose.connect("mongodb://localhost:27017/Auth", {
         useNewUrlParser: true
     })
     .then(console.log("connected to mongodb"))
     .catch(err => console.error("no connect try again..." + err))
app.use(cors())
 app.use(express.json())
 app.use(express.urlencoded({
     extended: true
 }))
app.use("/",user)
  if (process.env.NODE_ENV === "production") {
     app.use(express.static("client/build"))
     const path = require("path")
     app.get("*", (req, res) => {
         res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
     })
 }
PORT = process.env.PORT || 6000
 app.listen(PORT, () => console.log(`listening on port : ${PORT}`))
