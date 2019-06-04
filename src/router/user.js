const express = require('express')
const User = require('../models/user')
const auth  = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const { fun, sendCanelMail } = require('../email/account')

const router = new express.Router()

const upload = multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req, file, callback){
    if(!file.originalname.match(/\.(jpg|png|jpeg)$/)){
        return callback(new Error('please upload an image with jpg, png, jpeg format only'))
        }
    callback(undefined, true)
    }
})
//to create a new user
router.post('/users',async (req, res)=>{
    const user = new User(req.body)
    try{
        await user.save()
        //fun(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    }
   catch(error){
    res.status(500).send({error:req.body})
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
        sendCanelMail(req.user.email, req.user.name)
        res.send(req.user)
    }catch(error){
        res.status(500).send(error)
    }
})

// to upload your avatar
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) =>{
    
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250 }).png().toBuffer()
    
    req.user.avatar = buffer
    await req.user.save()
    res.send()
},(error,req, res, next) => {
    res.status(400).send({error: error.message})
})

//To DELETE avatar
router.delete('/users/me/avatar', auth, async(req, res) => {
    try{
        req.user.avatar = undefined
        await req.user.save()
        res.send()
    }catch(error){
        res.status(500).send()
    }
})

//To GET avatar
router.get('/users/:id/avatar', async (req, res) => {
    try{
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type','image/png')
        res.send(user.avatar)
    }catch(error){
        res.status(404).send()
    }
})
module.exports = router