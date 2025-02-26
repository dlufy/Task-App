const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const SECRET = process.env.JWT_SECRET
const Task = require('../models/task')
const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    age:{
        type:Number,
        default:18,
        validate(value){
            if(value<0){
                throw new Error('age must be positive integer!!')
            }
        }
    },  
     email:{
            type:String,
            required:true,
            unique:true,
            trim:true,
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error('Invalid Email address!!!!')
                }
            }
        },
        password:{
            type:String,
            required:true,
            validate(value){
                if(value.length<8){
                    throw new Error('short password password length must be >= 8')
                }
            }
        },
        tokens:[{
                token:{
                    type:String,
                    required:true
                }
            }],
            avatar:{
                type : Buffer
            }
},
    {
    timestamps: true
})

userSchema.virtual('tasks',{
    ref:'Task',
    localField :'_id',
    foreignField : 'creater'
})

userSchema.methods.generateAuthToken = async function () {
     const user = this
    const token = jwt.sign({ _id:user._id.toString() }, SECRET)
   
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}
userSchema.statics.findByCredentionals = async (email, password) => {

    const user = await User.findOne({ email })
    if(!user){
        throw new Error('Unable to login!!!')
    }
    
    const isMatch = await bcrypt.compare(password, user.password)
    if(isMatch)
        return user
    throw new Error('Unable to login')
}


//Hash plaintext password before saving
userSchema.pre('save', async function(next){
    const user = this
    
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

//Delete User Tasks when user is deleted
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ creater : user._id })
})


const User = mongoose.model('User',userSchema)

module.exports = User