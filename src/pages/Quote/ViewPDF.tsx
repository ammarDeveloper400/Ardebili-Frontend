import React, { useEffect, useState, useRef, createRef } from "react";
import {Link, useNavigate} from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from "../../hooks/useAuth";
import { doPost } from "../../utils/apiCalls";
import { validateEmail, getStatusEnums, getUrgencyEnums } from "../../utils/functions";
import Lucide from "../../base-components/Lucide";
import { createIcons, icons } from "lucide";
import { urls } from "./../../utils/Api_urls";
import Logo from "./../../assets/images/logo_main.png"

import logoUrl from "../../assets/images/logo_main.png";
import logoWhite from "../../assets/images/logo_white.png";
import illustrationUrl from "../../assets/images/illustration.svg";
import { FormInput, FormCheck, FormSelect, FormLabel, FormTextarea, FormTextareaBullet } from "../../base-components/Form";
import Button from "../../base-components/Button";
import { Dialog, Menu } from "../../base-components/Headless";
import Table from "../../base-components/Table";
import LoadingIcon from "../../base-components/LoadingIcon";


// @ts-ignore
export default function ViewPDF() {
    const {getLoggedObject, setLoggedObject, isLoggedIn, checkLogin} = useAuth();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [asa, setAsa] = useState<any | null>([]);
    const [clinetdata, setClientData] = useState<any | null>([]);
    const [tasks, setTasks] = useState<any | null>([]);
    const [totalamount, setTotalAmount] = useState<any | null>(0);
    const sendButtonRef = useRef(null)
    const printRef = useRef<HTMLDivElement>(null);


    const [reciied, setrReciied] = useState<any | null>([]);
    const [asaEmails, setASAEMAILS] = useState<any | null>([]);

    const [pdfdata, setPDFDATA] = useState<any | null>(null);

    const path = window.location.pathname;
    const lastSlashIndex = path.lastIndexOf('/');
    const slugFromUrl = lastSlashIndex !== -1 ? path.substring(lastSlashIndex + 1) : '';
    // const pdf_URL = urls.PHP_API+"resources/uploads/"+asa.pNumber+".pdf";
    // const download_URL = urls.API+"do_create_download_pdf/"+asa.pNumber;

    const fetchAndConvertToBase64 = async (url:any) => {
        try {
          const response = await fetch(url);
          const data = await response.blob();
          const reader = new FileReader();
          reader.readAsDataURL(data);
          return new Promise((resolve, reject) => {
            reader.onloadend = () => {
                //@ts-ignore
              const base64data = reader.result.split(',')[1];
              resolve(base64data);
            };
            reader.onerror = reject;
          });
        } catch (error) {
          console.error('Error fetching or converting PDF:', error);
          return null;
        }
      }
 
     
      

    let varname = "";
    let downname = "";
        if(asa.pdf_name != "" && asa.pdf_name != null){
            varname = asa.pdf_name+".pdf";
            downname = asa.pdf_name;
        } else {
            varname =  asa.pNumber+".pdf";
            downname = asa.pNumber;
        }
        const pdf_URL = urls.PHP_API+"resources/uploads/"+varname;
        const download_URL = urls.API+"do_create_download_pdf/"+downname;

        const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        get_standard_services();
        // console.log(asa.length)
        
    }, []);

    const get_standard_services = async () => {
        const payload = {
          token:getLoggedObject()?.token,
          asa_id: slugFromUrl
        }
          //   console.log(payload);
          //   return;
        setLoading(true);
        const {isError, data} = await doPost(payload, 'get_react_quote_pdf_data');
        if(isError) {
            toast.error('Something went wrong with server.');
            setLoading(false);
        }else{
            if (data.action == "success") {
              setLoading(false);
              setAsa(data?.asa);
            //   console.log(data?.asa)
              setrReciied(data?.client_data.recipients)
              setASAEMAILS(data?.client_data.client_emails);
              setClientData(data?.client_data);
            //   console.log(data?.client_data)
              setTasks(data?.tasks);
              setTotalAmount(data?.total_amount)

                    let varname = "";
                    let downname = "";
                    if(data?.asa.pdf_name != "" && data?.asa.pdf_name != null){
                        varname = data?.asa.pdf_name+".pdf";
                        downname = data?.asa.pdf_name;
                    } else {
                        varname =  data?.asa.pNumber+".pdf";
                        downname = data?.asa.pNumber;
                    }
                    const pdf_URL_INLINE = urls.PHP_API+"resources/uploads/"+varname;
                    fetchAndConvertToBase64(pdf_URL_INLINE).then((base64data) => {
                        setPDFDATA(base64data)
                    });
            }
            else {
                setLoading(false);
                toast.error(data.error);
            }
        }
      }

      const download_pdf = async () => {
        const url = urls.PHP_API+"resources/uploads/"+asa.pNumber+".pdf";
        fetch(url, {
            method: 'GET',
            mode:'cors',
            headers: {
              Accept: 'application/octet-stream',
              'Content-Type': 'application/octet-stream',
            }}
            )
            .then((response) => response.blob())
            .then((blob) => {
                // Create a temporary URL object
                const url = window.URL.createObjectURL(blob);
                // Create a temporary link element
                const link = document.createElement('a');
                // Set the link's href to the temporary URL
                link.href = url;
                // Set the link's download attribute to specify the filename
                link.download = 'file.pdf';
                // Programmatically click the link to trigger the download
                link.click();
                // Cleanup by revoking the object URL
                window.URL.revokeObjectURL(url);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
      }

      const print_data = async () => {
        if (printRef.current) {
            const printContents = printRef.current.innerHTML;
            const originalContents = document.body.innerHTML;
      
            document.body.innerHTML = printContents;
            window.print();
            document.body.innerHTML = originalContents;
          }
      }

      const handleStatusUpdate = async () =>{
        const payload = {
          token:getLoggedObject()?.token,
          code: 6,
          ids: asa.id,
          proposal:1
        }
        // console.log(payload);
        // return;
        setLoading(true);
        const {isError, data} = await doPost(payload, 'update_asa_status_data');
        setLoading(false);
        if(isError) {
            toast.error('Something went wrong with server.');
            setLoading(false);
        }else{
            if (data.action == "success") {
              setLoading(false);
              get_standard_services();
              toast.success("Quote issued to client successfully!")
            }
            else {
                setLoading(false);
                toast.error(data.error);
            }
        }
    }
      
      const removeHTMLTags = async (str:any) => {
      
        return asa.service_description.replace(/<[^>]*>/g, '');
      }

      const formatNumber = (inputNumber:any) => {
        let formetedNumber=(Number(inputNumber)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        let splitArray=formetedNumber.split('.');
        // if(splitArray.length>1){
        //   formetedNumber=splitArray[0];
        // }
        return(formetedNumber);
      };

      //@ts-ignore
      const handleContextMenu = (event) => {
        event.preventDefault();
      };

        return (
            //@ts-ignore
            <>
            <div className="p-5 custom-p5">
                <div className="text-slate-500">
                <div className="flex custom_pdf_flex flex-wrap" >
                <div className="custom-40">
                        <div className="mt-5  pl-2 mb-3">
                            <div className="font-bold text-xl" style={{color:"#202020"}}>
                                Contact
                            </div>
                        </div>
                        <div className="pdf_detail">
                            {asa.company_contact}
                        </div>
                        <div className="pdf_detail">
                            {clinetdata.first_email}
                            
                            {/* {asaEmails!= null && asaEmails.map((email:any, index:any) => (
                                <div key={index}>{email.trim()}</div>
                            ))} */}
                        </div>

                        {
                        asaEmails!= null &&
                        <div>
                            <div className="mt-5  pl-2 mb-3">
                                <div className="font-bold text-xl" style={{color:"#202020"}}>
                                    Additional Recipients
                                </div>
                            </div>

                            <div className="pdf_detail">
                                {asaEmails!= null && asaEmails.map((email:any, index:any) => (
                                    <div key={index}>{email.trim()}</div>
                                ))}
                                {/* {reciied!= null && reciied.map((email:any, index:any) => (
                                    <div key={index}>{email.trim()}</div>
                                ))} */}
                            </div>
                        </div>
                    }

                       
                </div>
                <div className="htmlContract px-0 custom-60" ref={printRef}>
                    {
                        pdfdata == null && 
                        <div>
                            <div className="page text-center" style={{marginLeft: '0px'}}>
                                Loading ...
                            </div>
                        </div>
                    }
                    {/* {pdfdata != null &&
                        <object data={'data:application/pdf;base64, '+pdfdata+"#toolbar=0"} type="application/pdf" width="100%" height="100%" title="ABC"></object>
                    } */}
                    {pdfdata != null &&
                        // <object data={'data:application/pdf;base64, '+pdfdata+"#toolbar=0"} type="application/pdf" width="100%" height="100%" title="ABC"></object>
                        // <embed src={'data:application/pdf;base64,'+pdfdata} width="100%" height="100%" />
                        <iframe src={'data:application/pdf;base64,'+pdfdata+"#toolbar=0"} width="100%" height="100%" onContextMenu={handleContextMenu}></iframe>


                    }
                </div>
                </div>
                </div>
            </div>


            <div className={"bg-[#fff] bottom-0 col-span-12 fixed p-4 right-0 text-right w-[82.5%] custom_bg_mobile"}>
            <div className="flex w-[100%] justify-end gap-3">
            <a href={download_URL} target="_blank">
                    <Button  type="button" className="w-20  w-[120px]" ref={sendButtonRef}>
                        {loading?<LoadingIcon icon="rings" className="w-8 h-5 whiteocolor" />:"Download"}
                    </Button>
                </a>
                {/* onClick={()=>print_data()} */}
        <a
        href={pdf_URL}
        target="_blank"
        rel="noreferrer"
        >
                <Button  type="button" className="w-20  w-[120px] text-primary" ref={sendButtonRef}>
                    {loading?<LoadingIcon icon="rings" className="w-8 h-5 whiteocolor" />:"Print"}
                </Button>
        </a>
        {/* <a
        href={download_URL}
        target="_blank"
        rel="noreferrer"
        >
     
                <Button variant="primary" type="button" className="w-20  w-[120px]" ref={sendButtonRef} >
                    {loading?<LoadingIcon icon="rings" className="w-8 h-5 whiteocolor" />:"Download"}
                </Button>
            </a> */}

{
                    asa.completed_discipline == 3 &&
             <Button variant="primary" type="button" className="w-20  w-[120px]" ref={sendButtonRef} onClick={()=>handleStatusUpdate()}>
                        {loading?<LoadingIcon icon="rings" className="w-8 h-5 whiteocolor" />:"Issue Quote"}
                </Button>
}


                    {
                        asa.completed_discipline == 6 ? 
                            <Button type="button"  onClick={()=> {
                                navigate("/quotes")
                            }}
                            className="w-20 float-left   w-[120px] text-primary"
                            >
                                Done
                            </Button>
                        :
                        <Button type="button"  onClick={()=> {
                                // navigate("/quotes")
                                navigate(-1)
                            }}
                            className="w-20 float-left   w-[120px] text-primary"
                            >
                            Cancel
                        </Button>
                    }
                
            </div>
        </div>
           
            </>
        )

}