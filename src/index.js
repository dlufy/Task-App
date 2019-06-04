const express = require('express')
require('../src/db/mongoose')
const UserRouter = require('../src/router/user')
const TaskRouter = require('../src/router/task')
const User = require('./models/user')
const app = express()

const port = process.env.PORT || 3011

// app.use((req, res, next)=>{
//     console.log(req.method)
//     // if(req.method === 'GET')
//     //     return res.send('GET requests are disabled')
//     next()
// })
//to put server for maintaince
app.use((req, res, next) => {
    if(req.name === undefined){
    req.name = req.name || 'ajay'
    req.email = req.email || 'himanshu123001@gmail.com'
    req.password = req.password || "test1234"
    }
    next()
 })

const multer = require('multer')
const upload = multer({
    dest :'images',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, callback) {
        if(!file.originalname.match(/\.(doc|docx)$/)){
        callback(new Error('please upload a Word File'))
        }
        callback(undefined, true)
        //callback(undefined, false)
    }
})


app.post('/upload',upload.single('upload'), (req, res) =>{
    res.send()
}, (error,req, res, next) =>{
    res.status(400).send({error:error.message})
})

app.use(express.json())
app.use(UserRouter)
app.use(TaskRouter)

app.listen(port,()=>{
    console.log('server is running at port: ',port)
})
