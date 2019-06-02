const express = require('express')
require('../src/db/mongoose')
const UserRouter = require('../src/router/user')
const TaskRouter = require('../src/router/task')

const app = express()

const port = process.env.PORT || 3011

// app.use((req, res, next)=>{
//     if(req.method === 'GET')
//         return res.send('GET requests are disabled')
//     next()
// })

// app.use((req, res, next) => {
//     res.status(503).send('Server is under maintenance')
// })
app.use(express.json())
app.use(UserRouter)
app.use(TaskRouter)


app.listen(port,()=>{
    console.log('server is running at port: ',port)
})

// const Task = require('../src/models/task')
// const User = require('../src/models/user')
// const fun = async () =>{
//     // const task = await Task.findById('5cf28d7ca4206c1bace2459e')
//     // await task.populate('creater').execPopulate()
//     // console.log(task.creater)
//     const user = await User.findById('5cf28c8a0905db3420656e51')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks )
// }

// fun()