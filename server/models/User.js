const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')

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

//index.js에서 save 하기 전에 해당 함수를 수행
userSchema.pre('save', function(next){
    var user = this

    // 비밀번호를 수정하는 경우에만 암호화 ,아닐 경우 그 다음으로 넘어
    if(user.isModified('password')) {
        //비밀번호를 암호화시킨다
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err)
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})

//comparePassword 메소드 선언
userSchema.methods.comparePassword = function(plainPassword, cb) {
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err)
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb) {
    var user = this

    //jsonwebtoken라이브러리를 이용한 토큰 생성 (기존 아이디+프라이빗 키를 이용해 생성)
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    user.token = token
    user.save(function(err,user) {
        if(err) return cb(err)
        cb(null, user)
    })
}

userSchema.statics.findByToken = function(token, cb) {
    var user = this

    //토큰을 가져와서 복호화해준다
    jwt.verify(token, 'secretToken', function (err, decoded) {
        //유저아이디를 이용해서 유저를 찾은 다음 클라이언트에서 가져온 토큰과 db에 보관된 토큰이 일치하는지 확인
        user.findOne({"_id" : decoded, "token" : token}, function(err, user){
            if(err) return cb(err)
            cb(null, user)
        })

    })
}

//Schema를 model로 감싸주는 과정
const User = mongoose.model('User', userSchema)

//이 Model을 다른곳에서도 쓸수있게 내보내주는 과정
module.exports = {User}