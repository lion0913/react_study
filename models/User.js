const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name : {
        type : String,
        maxlength : 50
    },
    email : {
        type : String,
        trim : true, //space 제거
        unique : 1//unique한 값을 가지도록 함
    },
    password : {
        type : String,
        minlength : 5
    },
    lastname : {
        type : String,
        maxlength: 50
    },
    role : {
        type : Number,
        default : 0
    },
    image : String,
    token : {
        type : String
    },
    tokenExp : {
        type : Number
    }
})

//Schema를 model로 감싸주는 과정
const User = mongoose.model('User', userSchema)

//이 Model을 다른곳에서도 쓸수있게 내보내주는 과정
module.exports = {User}