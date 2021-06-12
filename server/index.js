
const express = require('express') //express 모듈을 사용하겠다는 뜻
const app = express() //새로운 express 앱을 만들겠다.
const port = 5000
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")

const config = require("./config/key")
const {User} = require("./models/User")
const {auth} = require("./middleware/auth");

//application/x-www-form-urlencoded 형식의 데이터를 분석해서 기져올 수 있게 함
app.use(bodyParser.urlencoded({extended : true}))
//application/json 타입의 데이터를 분석
app.use(bodyParser.json())
app.use(cookieParser())

const mongoose = require('mongoose')

//mongodb 연결하는 부분 (key.js에서 상용/개발 여부 판단 후 환경변수 값 가져옴)
mongoose.connect(config.mongoURI,{
    useNewUrlParser : true, useUnifiedTopology : true, useCreateIndex : true, useFindAndModify : false
}).then(() => console.log("mongoDB connected!")) //연결 성공시
    .catch(err => console.log(err))//연결 실패시 에러로그 출력

// localhost:3000에서 해당 내용 출력
app.get('/', (req, res) => {
    res.send('Hello World! 안녕하세영~요오오옹') //root 디렉토리에서 다음 데이터를 출력하겠다.
})

// client에 보냄
app.get('/api/hello', (req,res) => {
    res.send("안녕하세요 ~")
})

//회원가입 라우터 제작
app.post('/api/users/register', (req,res) => {
    //회원가입 시 필요한 정보들을 client에서 가져오면 그것들을 데이터베이스에 저장
    const user = new User(req.body)

    user.save((err, userInfo) => {
        if(err) return res.json({success : false, err})
        return res.status(200).json({
            success : true
        })
    })
})

//로그인 라우터 제작
app.post('/api/users/login', (req,res) => {

    //1. 요청 이메일값이 데이터베이스에 존재하는지 확인
    User.findOne({email : req.body.email}, (err, user) => {
        if(!user){
            return res.json({
                loginSuccess : false,
                message : "이메일에 해당하는 유저가 없습니다."
            })
        }

        //2. 이메일이 있다면 비밀번호가 일치하는지 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch) {
                return res.json({ loginSuccess : false, message : "비밀번호가 틀렸습니다."})
            }

            //3. 이메일, 비번까지 일치한다면 토큰 생성(jsonwebtoken 라이브러리 이용)
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err)

                //생성된 token을 쿠키에 저장한다. (cookieparser 라이브러리 이용)
                res.cookie("x_auth", user.token)
                    .status(200)
                    .json({loginSuccess : true, userId : user._id})
            })
        })
    })
})

app.get('/api/users/auth', auth , (req,res) => {
    //auth라는 미들웨어를 통과해옴 = authentication이 true라는 뜻
    res.status(200).json({
        _id : req.user._id,
        isAdmin : req.user.role === 0 ? false : true,
        isAuth : true,
        email : req.user.email,
        name : req.user.name,
        lastName : req.user.lastname,
        role : req.user.role,
        image : req.user.image
    })

})

//logout : 토큰을 찾아서 없애주고 업데이트.
app.get('/api/users/logout', auth, (req, res)=> {
    User.findOneAndUpdate({_id : req.user._id}, {token : ""}, (err,user) => {
        if(err) return res.json({success : false, err});
        return res.status(200).send({
            success : true
        })
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
