import { useEffect, useState } from "react";
import {doPost} from "../utils/apiCalls";

export default function useAuth() {
    let prev = localStorage.getItem("ArdibiliAuth") || null;
    const [loggedObject, setLoggedObjectFinal] = useState<any | null>(prev);

    const checkLogin = async () => {
        const payLoad = {token:getLoggedObject()?.token.token};
        const {isError, data} = await doPost(payLoad, 'check_login');
        if(!isError) {
            let dd = data;
            dd.token=payLoad;
            setLoggedObject(dd);
        } 
        return !isError;
    }

    const setLoggedObject = (obj:any) => {
        if(obj === null){
            setLoggedObjectFinal(null);
        } else {
            setLoggedObjectFinal(JSON.stringify(obj));
            localStorage.setItem("ArdibiliAuth", JSON.stringify(obj));
            prev = loggedObject;
        }
    }
    const getLoggedObject = () => {
        return JSON.parse(loggedObject);
    }
    const isLoggedIn = getLoggedObject() !== null;
    useEffect(()=>{
        
        localStorage.setItem("ArdibiliAuth", loggedObject);
        prev = loggedObject;
    },[ loggedObject]);

    return {getLoggedObject, setLoggedObject, isLoggedIn, checkLogin};
}