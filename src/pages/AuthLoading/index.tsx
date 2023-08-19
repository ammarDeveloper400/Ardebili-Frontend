import ReactDOM from "react-dom/client";
import React, { useEffect, useState } from "react";
import LoadingImage from "./../../assets/images/loading.gif";
import useAuth from "./../../hooks/useAuth";
import { doPost } from "./../../utils/apiCalls";
import { validateEmail } from "../../utils/functions";
import {Link, useNavigate} from 'react-router-dom';

function AuthLoading() {
    const [token, setToken] = React.useState(null);
    const {getLoggedObject, setLoggedObject, isLoggedIn, checkLogin} = useAuth();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    useEffect(()=>{
        if(isLoggedIn){
            window.location.reload();
            return;
        } else {
            navigate('/login');
        }
    },[isLoggedIn])
   
    return (
        <>
            <div className="outer_loading_class">
                <div className="flex justify-center align-middle h-full items-center flex-col">
                    <img
                    alt="Ardibili"
                    src={LoadingImage}
                    className="w-[100px] h-[100px]"
                    /> Loading....
                </div>
            </div>
        </>
    )
}

export default AuthLoading;