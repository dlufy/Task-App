const express = require('express')
const User = require('../models/user')

const router = new express.Router()

//to create a new user
router.post('/users',async (req, res)=>{
    const user = new User(req.body)
    try{
        await user.save()
        res.status(201).send(user)
    }
   catch(error){
    res.status(500).send({error})
   }
})

//for user login

router.post('/users/login',async (req, res)=>{
    try{
        const user = await User.findByCredentionals(req.body.email,req.body.password)
        res.send(user)
    }catch(error){
        res.status(500).send(error)
    }
})
//to get all user
router.get('/users',async (req, res)=>{
    try{
        const users = await User.find({})
        res.send(users)
    }catch(error){
        res.status(500).send(error)
    }
})
//to get a user by id
router.get('/users/:id',async (req, res)=>{
    try{
        const user = await User.findById(req.params.id)
        if(user)
            return res.send(user)
        res.status(404).send({error:'User not found'})
    }catch(error){
        res.status(500).send(error)
    }
})

//to update a user by id
router.patch('/users/:id',async (req, res)=>{
    const allowUpdates = ['name','email','password','age']
    const  updates= Object.keys(req.body)
    const flag = updates.every((update)=> allowUpdates.includes(update))
    if(!flag){
        return res.status(400).send({error:'update is not allowed with these fields'})
    }
    try{
        const user = await User.findById(req.params.id)
        updates.forEach((update)=> user[update] = req.body[update])
        await user.save()
        if(user)
            return res.send(user)
        res.status(404).send({error:'no user found'})
    }catch(error){
        res.status(500).send({error:'error happend'})
    }
})

//to delete a user by id
router.delete('/users/:id',async (req, res)=>{
    try{
        const user = await User.findByIdAndRemove(req.params.id)
        if(user)
            return res.send(user)
        res.status(404).send({error:'user not found!!'})
    }catch(error){
        res.status(500).send(error)
    }
})
module.exports = router