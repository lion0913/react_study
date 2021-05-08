
const express = require('express') //express 모듈을 사용하겠다는 뜻
const app = express() //새로운 express 앱을 만들겠다.
const port = 3000
const bodyParser = require("body-parser")

const config = require("./config/key")
const {User} = require("./models/User")

//application/x-www-form-urlencoded 형식의 데이터를 분석해서 기져올 수 있게 함
app.use(bodyParser.urlencoded({extended : true}))
//application/json 타입의 데이터를 분석
app.use(bodyParser.json())

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

// 회원가입 라우터 제작
app.post('/register', (req,res) => {
    //회원가입 시 필요한 정보들을 client에서 가져오면 그것들을 데이터베이스에 저장
    const user = new User(req.body)

    //mongodb save fnction
    user.save((err, userInfo) => {
        if(err) return res.json({success : false, err})
        return res.status(200).json({
            success : true
        })
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
