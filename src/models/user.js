const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

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
        }
})
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
const User = mongoose.model('User',userSchema)

module.exports = User