import React,{useEffect} from 'react'
import axios from "axios";

function LandingPage() {
    // 랜딩페이지에 들어오자마자 실행함 -> get request를 서버에 보냄
    useEffect(() => {
        axios.get("/api/hello")
            .then(response => console.log(response))
    }, [])

    return (
        <div style={{
            display : 'flex', justifyContent : 'center', alignItems : 'center', width : '100%', height : '100vh'
        }}>
            <h2>LandingPage 렌딩페지이잉</h2>
        </div>
    )
}

export default LandingPage