const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('User',{
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
        }
})

module.exports = User