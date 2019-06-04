const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URL||"mongodb+srv://taskapp:ajay@5161@cluster0-b0zlr.mongodb.net/test?retryWrites=true&w=majority",{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
})