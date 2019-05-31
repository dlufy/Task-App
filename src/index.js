const express = require('express')
require('../src/db/mongoose')
const app = express()
const UserRouter = require('../src/router/user')
const TaskRouter = require('../src/router/task')

app.use(express.json())
app.use(UserRouter)
app.use(TaskRouter)

const port = process.env.PORT || 3011


app.listen(port,()=>{
    console.log('server is running at port: ',port)
})