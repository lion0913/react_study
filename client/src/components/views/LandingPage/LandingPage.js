import React,{useEffect} from 'react'
import axios from "axios";

function LandingPage(props) {
    // 랜딩페이지에 들어오자마자 실행함 -> get request를 서버에 보냄
    useEffect(() => {
        axios.get("/api/hello")
            .then(response => {console.log(response)})
    }, [])

    const onClickHandler = () => {
        axios.get('/api/users/logout')
            .then (response => {
                if(response.data.success) {
                    props.history.push("/login")
                } else {
                    alert("로그아웃에 실패하였습니다.")
                }
            })
    }

    return (
        <div style={{
            display : 'flex', justifyContent : 'center', alignItems : 'center', width : '100%', height : '100v'
        }}>
            <h2>LandingPage 렌딩페지이잉</h2>
            <button onClick={onClickHandler}>
                로그아웃
            </button>
        </div>
    )
}

export default LandingPage