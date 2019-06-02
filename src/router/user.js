const express = require('express')
const User = require('../models/user')
const auth  = require('../middleware/auth')
const router = new express.Router()

//to create a new user
router.post('/users',async (req, res)=>{
    const user = new User(req.body)
    try{
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    }
   catch(error){
    res.status(500).send({error})
   }
})

//for user login
router.post('/users/login',async (req, res)=>{
    try{
        const user = await User.findByCredentionals(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    }catch(error){
        res.status(500).send(error)
    }
})


//for logout
router.post('/users/logout',auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) =>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    }catch(error){
        res.status(500).send(error)
    }
})

//to logoutall users
router.post('/users/logoutAll', auth, async (req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send(e)
    }
})

//to get user profile
router.get('/users/me', auth, async (req, res)=>{
    try{
        res.send(req.user)
    }catch(error){
        res.status(500).send(error)
    }
})

//to update a user by id
router.patch('/users/me', auth, async (req, res)=>{
    const allowUpdates = ['name','email','password','age']
    const  updates= Object.keys(req.body)
    const flag = updates.every((update)=> allowUpdates.includes(update))
    if(!flag){
        return res.status(400).send({error:'update is not allowed with these fields'})
    }
    try{
        const user = req.user
        updates.forEach((update)=> user[update] = req.body[update])
        await user.save()
        return res.send(user)
    }catch(error){
        res.status(500).send({error:'error happend'})
    }
})

//to delete the user
router.delete('/users/me', auth, async (req, res)=>{
    try{
        await req.user.remove()
        res.send(req.user)
    }catch(error){
        res.status(500).send(error)
    }
})
module.exports = router