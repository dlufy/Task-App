const express = require('express')
const router = new express.Router()
const Task = require('../models/task')

//to create a new task
router.post('/tasks',async (req, res)=>{

    const task = new Task(req.body)
    try{
        await task.save()
        res.status(201).send(task)
    }
   catch(error){
    res.status(500).send({error})
   }
})

//to read all tasks
router.get('/tasks',async (req, res)=>{
    try{
        const tasks = await Task.find({})
        res.send(tasks)
    }catch(error){
        res.status(500).send(error)
    }
})

//to get a task by id
router.get('/tasks/:id',async (req, res)=>{
    try{
        const task = await Task.findById(req.params.id)
        if(task)
            return res.send(task)
        res.status(404).send({error:'Task not found!!!'})
    }catch(error){
        res.status(500).send(error)
    }
})

//to update a task by id
router.patch('/tasks/:id',async (req, res)=>{
    const allowUpdates = ['description','completed']
    const  updates= Object.keys(req.body)
    const flag = updates.every((update)=> allowUpdates.includes(update))
    if(!flag){
        return res.status(400).send({error:'update is not allowed with these fields'})
    }
    try{
        const task = await Task.findById(req.params.id)
        updates.forEach((update) => task[update] = req.body[update] )
        await task.save()
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true })
        if(task)
            return res.send(task)
        res.status(404).send({error:'no task found'})
    }catch(error){
        res.status(500).send(error)
    }
})

//to delete a task by id
router.delete('/tasks/:id',async (req, res)=>{
    try{
        const task = await Task.findByIdAndRemove(req.params.id)
        if(task)
            return res.send(task)
        res.status(404).send({error:'task not found!!'})
    }catch(error){
        res.status(500).send(error)
    }
})
module.exports = router