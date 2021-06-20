import React, {useEffect} from 'react';
import {useDispatch} from "react-redux";
import {auth} from '../_actions/user_action';


export default function (SpecificComponent, option, adminRoute = null) {
    //option : [null(아무나 출입가능), true(로그인한 유저만), false(로그인한 유저는 출입X)]
    //adminRoute : 관리자만 출입가능한 컴포넌트를 위한 설정

    //백엔드에 request를 보내서 상태를 받아온다(보내는 부분)
    function AuthenticationCheck(props) {
        const dispatch = useDispatch();

        useEffect(() => {
            dispatch(auth()).then(response => {
                console.log(response)

                if(!response.payload.isAuth) {
                    if(option) {
                        props.history.push('/login')
                    }
                } else {
                    if(adminRoute && !response.payload.isAdmin) {
                        props.history.push('/')
                    } else{
                        if(!option) {
                            props.history.push('/')
                        }
                    }

                }
            })

        },[])

        return (
            <SpecificComponent />
        )
    }

    return AuthenticationCheck
}