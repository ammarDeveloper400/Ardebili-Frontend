import React, { useEffect, useState, useRef } from "react";
import {Link, useNavigate} from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from "../../hooks/useAuth";
import { doPost } from "../../utils/apiCalls";
import { validateEmail } from "../../utils/functions";
import Lucide from "../../base-components/Lucide";

import logoUrl from "../../assets/images/logo_main.png";
import logoWhite from "../../assets/images/logo_white.png";
import illustrationUrl from "../../assets/images/illustration.svg";
import { FormInput, FormCheck, FormSelect, FormLabel } from "../../base-components/Form";
import Button from "../../base-components/Button";
import clsx from "clsx";
import { replaceNode, nodeIndex } from "tom-select/src/vanilla";
import DataTable from "react-data-table-component";
import { Dialog, Menu } from "../../base-components/Headless";
import Table from "../../base-components/Table";
import LoadingIcon from "../../base-components/LoadingIcon";

function Main() {
    const {getLoggedObject, setLoggedObject, isLoggedIn, checkLogin} = useAuth();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [current, setCurrent] = useState<any | null>(null)
    const [newpass, setNewPass] = useState<any | null>(null)
    const [cnewpass, setCNewPass] = useState<any | null>(null)
    const [profileData, setProfileData] = useState<any | null>(null)

    useEffect(() => {
        if (getLoggedObject()?.token) {
            setProfileData(getLoggedObject())
        }
    }, [])


    const change_password = async () => {
        if(loading) return;
        if(current==null){
            toast.error('Please enter your current password.');
            return;
        }
        if(newpass==null){
            toast.error('Please enter your new password.');
            return;
        }
        if(cnewpass==null){
            toast.error('Please enter confirm new password.');
            return;
        }
        if(newpass!=cnewpass){
            toast.error('New password & confirm new password is not same.');
            return;
        }
        const payload = {
            token:getLoggedObject()?.token,
            current:current,
            newpass: newpass,
            cnewpass: cnewpass
          }
          setLoading(true);
          const {isError, data} = await doPost(payload, 'update_password');
          if(isError) {
              toast.error('Something went wrong with server.');
              setLoading(false);
          }else{
              if (data.action == "success") {
                setLoading(false);
                setCurrent(null)
                setNewPass(null)
                setCNewPass(null)
                toast.success("Your Password has been updated successfully!")
              }
              else {
                  setLoading(false);
                  toast.error(data.error);
              }
          }
    }

    return (
        <>
            <div className="flex items-center mt-8 intro-y">
                <h2 className="mr-auto text-lg font-medium">My Profile</h2>
            </div>
            <div className="grid grid-cols-12 gap-6 mt-5">
                {/* BEGIN: Profile Menu */}
                <div className="flex flex-col-reverse col-span-12 lg:col-span-4 2xl:col-span-3 lg:block">
                    <div className="mt-5 intro-y box lg:mt-0">
                        <div className="p-5 border-t border-slate-200/60 dark:border-darkmode-400">
                            <span className="flex items-center font-medium text-primary">
                                Personal Information
                            </span>
                            <span className="flex items-center mt-5">
                                <Lucide icon="User" className="w-4 h-4 mr-2"/>
                                {
                                    //@ts-ignore
                                    profileData && profileData.first_name + " " + profileData.last_name
                                }
                            </span>
                            <span className="flex items-center mt-5">
                                <Lucide icon="Mail" className="w-4 h-4 mr-2"/>
                                {
                                    //@ts-ignore
                                    profileData && profileData.email
                                }
                            </span>
                        </div>
                    </div>
                </div>
                {/* END: Profile Menu */}


                <div className="col-span-12 lg:col-span-8 2xl:col-span-9">
                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-12 intro-y box 2xl:col-span-6">
                            <div
                                className="flex items-center px-5 py-5 border-b sm:py-3 border-slate-200/60 dark:border-darkmode-400">
                                <h2 className="mr-auto text-base font-medium">Change Password</h2>
                            </div>
                            <div className="p-5">
                                <div>
                                    <FormLabel htmlFor="current">Current Password <span className="redclass">*</span></FormLabel>
                                    <FormInput name={"oldpass"} id="current" type="password"
                                        placeholder="Current Password"
                                        defaultValue={current}
                                        onChange={(e)=>setCurrent(e.target.value)}            
                                    />
                                </div>
                                <div className="mt-3">
                                    <FormLabel htmlFor="new">New Password <span className="redclass">*</span></FormLabel>
                                    <FormInput name={"newpass"} id="new" type="password"
                                                placeholder="New Password"
                                                defaultValue={newpass}
                                                onChange={(e)=>setNewPass(e.target.value)} 
                                    />
                                </div>
                                <div className="mt-3">
                                    <FormLabel htmlFor="confirm">Confirm New Password <span className="redclass">*</span></FormLabel>
                                    <FormInput name={"confirmpass"} id="confirm" type="password"
                                        placeholder="Confirm New Password"
                                        defaultValue={cnewpass}
                                        onChange={(e)=>setCNewPass(e.target.value)} 
                                    />
                                </div>
                                <Button variant="primary" type={"submit"} className="mt-5"
                                onClick={()=>change_password()}
                                >
                                    {loading?<LoadingIcon icon="rings" className="w-8 h-5 whiteocolor" />:'Change Password'}
                                </Button>

                            </div>
                        </div>
                        {/* END: Daily Sales */}


                    </div>
                </div>
            </div>
        </>
    );
}

export default Main;
