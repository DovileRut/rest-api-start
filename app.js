import express from "express"
import mongoose from "mongoose"
import apiRoutes from "./routes/apiRoutes.js"


const app = express()
app.use(express.json())
app.use(express.static("public"))

const dbURI = 'mongodb+srv://node1-user:test123@cluster0.8h695hc.mongodb.net/restapi'
mongoose.connect(dbURI)
    .then(result => app.listen(3001))
    .catch(err => console.log(err))

app.set("view engine", "ejs")

//routes
app.get("/", (req, res) => res.render("home"))
app.get("/pridetiProgramuotoja", (req, res) => {res.render("pridetiProgramuotoja")})


app.use("/api", apiRoutes)
