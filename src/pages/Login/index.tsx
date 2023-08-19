import React, { useEffect, useState } from "react";
import {Link, useNavigate} from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from "../../hooks/useAuth";
import { doPost } from "../../utils/apiCalls";
import { validateEmail } from "../../utils/functions";

import logoUrl from "../../assets/images/logo_main.png";
import logoWhite from "../../assets/images/logo_white.png";
import illustrationUrl from "../../assets/images/illustration.svg";
import { FormInput, FormCheck } from "../../base-components/Form";
import Button from "../../base-components/Button";
import clsx from "clsx";
import LoadingIcon from "../../base-components/LoadingIcon";
import "./../../assets/css/login.css";

function Main() {
  const {getLoggedObject, setLoggedObject, isLoggedIn, checkLogin} = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // console.log(isLoggedIn)
  const handleLogin = async () => {
    setLoading(true);
    const logged = await checkLogin();
    if(logged){
        navigate('/', {replace: true});
    }else{
        setLoading(false);
    }
  }

  useEffect(()=>{
      if(isLoggedIn){
          handleLogin();
      }
  },[isLoggedIn])
  
  const do_login_acion = async () => {
   
    if(loading) return;
    if(email==""){
      toast.error('Please enter your Email Address.');
      return;
    }
    if(!validateEmail(email)){
        toast.error('Please provide a valid email address');
        return false;
    }
    if(password==""){
      toast.error('Please enter your Password.');
      return;
    }
    const payload = {
      email:email,
      password:password
    }
    setLoading(true);
    const {isError, data} = await doPost(payload, 'do_login');
    setLoading(false);
    if(isError) {
        toast.error('Something went wrong with server.');
        setLoading(false);
    }else{
        if (data.action == "success") {
          setLoading(false);
          toast.success("Logged In successfully!");
          setLoggedObject(data.data);
          navigate('/');
        }
        else {
            setLoading(false);
            toast.error(data.error);
        }
    }
  }


  return (
    <>
      <div
        className={clsx([
          "-m-3 sm:-mx-8 p-3 sm:px-8 relative h-screen lg:overflow-hidden bg-primary xl:bg-white dark:bg-darkmode-800 xl:dark:bg-darkmode-600",
          "before:hidden before:xl:block before:content-[''] before:w-[57%] before:-mt-[28%] before:-mb-[16%] before:-ml-[13%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[-4.5deg] before:bg-primary/20 before:rounded-[100%] before:dark:bg-darkmode-400",
          "after:hidden after:xl:block after:content-[''] after:w-[57%] after:-mt-[20%] after:-mb-[13%] after:-ml-[13%] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[-4.5deg] after:bg-primary after:rounded-[100%] after:dark:bg-darkmode-700",
        ])}
      >
        {/* <DarkModeSwitcher /> */}
        <div className="container relative z-10 sm:px-10">
          <div className="block grid-cols-2 gap-4 xl:grid">
            {/* BEGIN: Login Info */}
            <div className="flex-col hidden min-h-screen xl:flex">
              <a href="" className="flex items-center pt-5 -intro-x mt-8">
                <img
                  alt=""
                  className="w-[300px]"
                  src={logoWhite}
                />
              </a>
              <div className="my-auto">
                <img
                  alt=""
                  className="w-1/2 -mt-16 -intro-x"
                  src={illustrationUrl}
                />
                <div className="w-1/2 mt-10 text-xl font-regular leading-tight text-white -intro-x text-center">
                  A few more clicks to <br />
                  sign in to your account.
                </div>
                
              </div>
            </div>
            {/* END: Login Info */}
            {/* BEGIN: Login Form */}
            <div className="flex h-screen py-5 my-10 xl:h-auto xl:py-0 xl:my-0">
              <div className="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto">
                <h2 className="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">
                  Sign In
                </h2>
                <div className="mt-2 text-center intro-x text-slate-400 xl:hidden">
                  A few more clicks to sign in to your account.
                </div>
                <div className="mt-8 intro-x">
                  <FormInput
                    type="email"
                    className="block px-4 py-3 intro-x login__input min-w-full xl:min-w-[350px]"
                    placeholder="Email"
                    required={true}
                    defaultValue={email}
                    // onChange={setEmail}
                    onChange={(e)=>setEmail(e.target.value)}
                  />
                  <FormInput
                    type="password"
                    className="block px-4 py-3 mt-4 intro-x login__input min-w-full xl:min-w-[350px]"
                    placeholder="Password"
                    required={true}
                    defaultValue={password}
                    onChange={(e)=>setPassword(e.target.value)}
                  />
                </div>
                <div className="flex mt-4 text-xs intro-x text-slate-600 dark:text-slate-500 sm:text-sm">
                  <div className="flex items-center mr-auto">
                    
                  </div>
                  {/* <a href="">Forgot Password?</a> */}
                </div>
                <div className="mt-5 text-center intro-x xl:mt-8 xl:text-left">
                  <Button
                    variant="primary"
                    className="w-full px-4 py-3 align-top xl:w-32 xl:mr-3"
                    onClick={do_login_acion}
                  >
                    {loading?<LoadingIcon icon="rings" className="w-8 h-5 whiteocolor" />:'Login'}
                  </Button>
                  {/* <Button
                    variant="outline-secondary"
                    className="w-full px-4 py-3 mt-3 align-top xl:w-32 xl:mt-0"
                    onClick={do_action}
                  >
                    Register
                  </Button> */}
                </div>
                <div className="mt-10 text-center intro-x xl:mt-24 text-slate-600 dark:text-slate-500 xl:text-left">
                  By signin up, you agree to our{" "}
                  <a className="text-primary dark:text-slate-200" href="">
                    Terms and Conditions
                  </a>{" "}
                  &{" "}
                  <a className="text-primary dark:text-slate-200" href="">
                    Privacy Policy
                  </a>
                </div>
              </div>
            </div>
            {/* END: Login Form */}
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;
