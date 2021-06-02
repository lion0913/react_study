const {User} = require('../models/User');


let auth = (req, res, next)=> {

    //인증처리하는곳

    //1. 클라이언트 쿠키로부터 토큰을 받아옴(cookie-parser)
    let token = req.cookies.x_auth;

    //2. 토큰을 복호화해서 user를 찾아냄
    User.findByToken(token, (err, user) => {
        if (err) throw err;
        //유저가 없어서 인증에 실패했다고 리턴
        if (!user) return res.json({isAuth: false, error: true})

        //index.js에서 해당 유저의 정보를 사용할 수 있도록 집어넣어주는 과정
        req.token = token;
        req.user = user;

        next(); //middleware에서 다음으로 갈 수 있게 함.
    })
}

module.exports = {auth};