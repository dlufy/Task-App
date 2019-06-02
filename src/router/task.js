const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')

const router = new express.Router()

//to create a new task
router.post('/tasks', auth, async (req, res)=>{

    const task = new Task({
        ...req.body,
        creater: req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    }
   catch(error){
    res.status(500).send({error})
   }
})

//to read all tasks
//GET /tasks?completed:true
//GET /tasks?skip= ({{pageNumber}}-1)*{{limit}}&limit={{limit}}
//GET /tasks?sortBy = createAt:desc / createAt_desc

// asc 1
//desc -1
router.get('/tasks',auth, async (req, res)=>{
    const match = {}
    const sort = {}

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy){
        const part = req.query.sortBy.split(':')
        sort[part[0]] = part[1] === 'asc' ? 1:-1
    }
    
    try{
        //const tasks = await Task.find({ creater : req.user._id })
        await req.user.populate({
            path : 'tasks',
            match,
            options:{
                limit : parseInt(req.query.limit),
                skip : parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)

    }catch(error){
        res.status(500).send(error)
    }
})

//to get a task by id
router.get('/tasks/:id', auth,async (req, res)=>{
    try{

        const task = await Task.findOne({_id:req.params.id, creater : req.user._id })
        console.log('my task',task)
        if(task)
            return res.send(task)

        res.status(404).send({error:'Task not found!!!'})
    }catch(error){
        res.status(500).send({error:error})
    }
})

//to update a task by id
router.patch('/tasks/:id', auth, async (req, res)=>{
    const allowUpdates = ['description','completed']
    const  updates= Object.keys(req.body)
    
    const flag = updates.every((update)=> allowUpdates.includes(update))
    
    if(!flag){
        return res.status(400).send({error:'update is not allowed with these fields'})
    }
    try{

        const task = await Task.findOne({_id : req.params.id, creater : req.user._id})
        
        if(!task)
            return res.status(404).send()
        
        updates.forEach((update) => task[update] = req.body[update] )
        await task.save()
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true })
        res.send(task)

    }catch(error){
        res.status(500).send(error)
    }
})

//to delete a task by id
router.delete('/tasks/:id', auth, async (req, res)=>{
    try{
        const task = await Task.findOneAndDelete({_id:req.params.id,creater : req.user._id })
        if(task)
            return res.send(task)
        res.status(404).send({error:'task not found!!'})
    }catch(error){
        res.status(500).send(error)
    }
})
module.exports = router