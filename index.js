
const express = require('express') //express 모듈을 사용하겠다는 뜻
const app = express() //새로운 express 앱을 만들겠다.
const port = 3000

const mongoose = require('mongoose')

//mongodb 연결하는 부분
mongoose.connect('mongodb+srv://gogo:lion1065@cluster0.y6nky.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
    useNewUrlParser : true, useUnifiedTopology : true, useCreateIndex : true, useFindAndModify : false
}).then(() => console.log("mongoDB connected!")) //연결 성공시
    .catch(err => console.log(err))//연결 실패시 에러로그 출력

// localhost:3000에서 해당 내용 출력
app.get('/', (req, res) => {
    res.send('Hello World! 안녕하세영~') //root 디렉토리에서 다음 데이터를 출력하겠다.
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
