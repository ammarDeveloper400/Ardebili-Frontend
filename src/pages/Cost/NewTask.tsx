import React, { useEffect, useState, useRef, createRef } from "react";
import {Link, useNavigate, useLocation} from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from "../../hooks/useAuth";
import { doPost } from "../../utils/apiCalls";
import { validateEmail, getStatusEnums, getUrgencyEnums } from "../../utils/functions";
import Lucide from "../../base-components/Lucide";
import { createIcons, icons } from "lucide";
import { urls } from "./../../utils/Api_urls";

import logoUrl from "../../assets/images/logo_main.png";
import logoWhite from "../../assets/images/logo_white.png";
import illustrationUrl from "../../assets/images/illustration.svg";
import { FormInput, FormCheck, FormSelect, FormLabel, FormTextarea, FormTextareaBullet } from "../../base-components/Form";
import Button from "../../base-components/Button";
import clsx from "clsx";
import { replaceNode } from "tom-select/src/vanilla";
import DataTable from "react-data-table-component";
import { Dialog, Menu } from "../../base-components/Headless";
// import Table from "../../base-components/Table";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import { stringToHTML } from "../../utils/helper";
import TomSelect from "../../base-components/TomSelect";
import Litepicker from "../../base-components/Litepicker";

import Table from "../../base-components/Table";
import LoadingIcon from "../../base-components/LoadingIcon";

interface Response {
  name?: string;
  category?: string;
  images?: string[];
  status?: string;
}

function NewTask() {

    const params = useLocation();
    var po_number = 0;
    var came_from_ = 0;
    var task_edit_from = 0;

    if (params.state?.asa_number) {
       po_number = params.state?.asa_number;
    }
    const client_number = po_number;

    var proposal_number = 0;
    if (params.state?.proposal) {
        proposal_number = 1;
    }
    const proposal__ = proposal_number;

    var version_num = 1;
    if (params.state?.revise==0) {
        version_num = 0;
     }

     const version____ = version_num;

    if (params.state?.specific_task) {
        came_from_ = params.state?.specific_task;
    }
    const came_from_client_date = came_from_;

    if (params.state?.edit_mode) {
        task_edit_from = 1;
    }
    const edit_task = task_edit_from;

    
    const {getLoggedObject, setLoggedObject, isLoggedIn, checkLogin} = useAuth();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [addNewDept, setAddNewDept] = useState(false)
    const [del, setDel] = useState(false)
    const [allusers, setAllusers] = useState(null)
    const [selectedDept, setSelectedDept] = useState(null)
    const [searchtext, setSearchText] = useState(null)
    const [asa, setAsa] = useState(null)
    const [filtered, setFiltered] = useState(null)
    const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
    const [adddepertmentmodal, setAddDepartmentModal] = useState(false)
    const deleteButtonRef = useRef(null);
    const sendButtonRef = useRef(null)
    const [departmentname, setDepartmentName] = useState<any | null>(null)

    const [editid, setEditID] = useState(null)
    const [delid, setDelID] = useState(null)
    // NEW REQUEST FORM ASA
    const full_name = getLoggedObject()?.first_name+" "+getLoggedObject()?.last_name;
    const user_default_id = getLoggedObject()?.id;
    
    const [contactemails, setContactEmails] = useState<any | null>(null)
    const [ponumber, setPoNumber] = useState<any | null>(null)
    const [nameinfo, setNameInfo] = useState<any | null>(null)
    const [pdfdescription, setPdfDescription] = useState<any | null>(null)
    const [internalnotes, setInternalNotes] = useState<any | null>(null)
    const [pricingmode, setPricingMode] = useState<any | null>("")
    const [markup, setMarkup] = useState<any | null>(false)
    const [templatesid, setTemplatesID] = useState<any | null>("")
    const [templatelist, setTemplateList] = useState<any | null>([])

    const [billtasks, setBillTasks] = useState<any | null>([])
    const path = window.location.pathname;
    const lastSlashIndex = path.lastIndexOf('/');
    const slugFromUrl = lastSlashIndex !== -1 ? path.substring(lastSlashIndex + 1) : '';

    const [ratetype, setRateType] = useState<any | null>(["",'SF (square foot)','Hourly','Weekly','Monthly','Annually'])
    const [ratedata, setRateData] = useState<any | null>("")
    const [unitprice, setUnitPrice] = useState<any | null>(null)
    const [addnew, setAddnew] = useState<any | null>(false)
    const [address, setAddress] = useState<any | null>(null)

    const [abcservice, setABCServices] = useState<any | null>([])
    const [standardService, setStandardService] = useState<any | null>("")
    const [showdropdown, setShowDropDown] = useState<any | null>(false)
    const [tax, setTax] = useState<any | null>(null)
    const [labelname, setLabelName] = useState<any | null>(null)
    
    useEffect(() => {
        if(client_number != 0){
            setShowDropDown(true)
        }
        if(slugFromUrl == ''){} else {
            get_standard_services(slugFromUrl);
        }
        if(edit_task == 1){
            do_get_server_asa_task(came_from_client_date)
        }
        getAllDisciplines()
    }, []);

    const do_get_server_asa_task = async (id:any) => {
        const payload = {
            token:getLoggedObject()?.token,
            id:id
        }
        setLoading(true);
        const {isError, data} = await doPost(payload, 'get_sepecific_cost_id');
        setLoading(false);
        if(isError) {
            toast.error('Something went wrong with server.');
            setLoading(false);
        }else{
            if (data?.action == "success") {
                // console.log(data?.data);
                const data_show = data?.data;
                setDepartmentName(data_show?.task_name)
                setRateData(data_show.rate_type==null?"":data_show.rate_type)
                setContactEmails(data_show.task_time)
                setPoNumber(data_show.price)
                let unitePriceTotal = (data_show.task_time)
                if(data.data_show?.tax != 0){
                
                    const taxRate = (data_show?.tax/100); // Assuming tax rate of 10%
                    const totalPrice = unitePriceTotal;
                    const taxcount = totalPrice * taxRate;
                    console.log(taxcount)
                    unitePriceTotal = (parseFloat(totalPrice) + taxcount);
                }
                setUnitPrice(unitePriceTotal)
                setMarkup(data_show.markup==1?true:false)
                setPricingMode(data_show.markup_type==0?"":data_show.markup_type)
                setNameInfo(data_show.markup_rate==0?null:data_show.markup_rate)
                setAddress(data_show.markup_cost==0?null:data_show.markup_cost)
                setPdfDescription(data_show.task_description)
                setInternalNotes(data_show.internal_notes)
                setTax(data_show?.tax==null?null:data_show?.tax)
                setLabelName(data_show?.label==null?null:data_show?.label)
                setStandardService(data_show?.service)
                setRateData(data_show?.rate)
                setLoading(false);
            }
            else {
                setLoading(false);
                toast.error(data.error);
            }
        }
    }

    const getAllDisciplines = async () => {
        const payload = {
          token:getLoggedObject()?.token,
        }
        setLoading(true);
        const {isError, data} = await doPost(payload, 'get_all_costs');
        setLoading(false);
        if(isError) {
            toast.error('Something went wrong with server.');
            setLoading(false);
        }else{
            if (data.action == "success") {
              setLoading(false);
              setABCServices(data?.data);
            }
            else {
                setLoading(false);
                toast.error(data.error);
            }
        }
    }

    const get_standard_services = async (slugFromUrl:any) => {
      const payload = {
        token:getLoggedObject()?.token,
        id: slugFromUrl
      }
        //console.log(payload);
      setLoading(true);
      const {isError, data} = await doPost(payload, 'get_specific_cost');
      if(isError) {
          toast.error('Something went wrong with server.');
          setLoading(false);
      }else{
          if (data.action == "success") {
            setLoading(false);
            const data_show = data?.data;

            setDepartmentName(data_show?.name)
            setRateData(data_show?.rate_type==null?"":data_show?.rate_type)
            setContactEmails(data_show?.est_hrs)
            setPoNumber(data_show?.price)
            setUnitPrice(data_show?.unit_price)
            // const unitePriceTotal = (data_show.est_hrs * data_show.price)
            //     setUnitPrice(unitePriceTotal)
            setMarkup(data_show?.markup==1?true:false)
            setPricingMode(data_show?.markup_type==0?"":data_show?.markup_type)
            setNameInfo(data_show?.markup_price)
            setAddress(data_show?.markup_cost)
            setPdfDescription(data_show?.desription)
            setLabelName(data_show?.label!=null?data_show?.label:null)
            setInternalNotes(data_show?.internal_notes)
            setTax(data_show?.tax==null?null:data_show?.tax)
            setEditID(data_show?.id)
          }
          else {
              setLoading(false);
              toast.error(data.error);
          }
      }
    }

    const do_update_tasks_checkbox = async (id:any) => {
        if(billtasks.includes(id as never)){
          var people = billtasks;
          var toRemove = id;
          var index = people.indexOf(toRemove as never);
          if (index > -1) { 
            people.splice(index, 1);
          }
          setBillTasks([...people]);
        } else {
          var people = billtasks;
          people.push(id as never);
          setBillTasks([...people]);
        }
    }

    const save_service = async (vid:any = 0, cid:any = 0) =>{
       
        if(loading) return;

        if(!showdropdown){
            if(departmentname==null){
                toast.error('Please enter cost name.');
                return;
            }
        } else {
            if(standardService == ""){
                toast.error('Please select cost name.');
                return;
            }
        }
        if(ratedata==""){
            toast.error('Please enter Rate Type.');
            return;
        }
        if(contactemails==""){
            toast.error('Please enter Estimate Hours.');
            return;
        }
        if(ponumber==null){
            toast.error('Please enter Price.');
            return;
        }
        if(unitprice==null){
            toast.error('Please enter unit price.');
            return;
        }
        if(markup){
            if(pricingmode==""){
                toast.error('Please select Mark up Type.');
                return;
            }
            // if(nameinfo==null){
            //     toast.error('Please enter mark up.');
            //     return;
            // }
            // if(address==null){
            //     toast.error('Please enter markup.');
            //     return;
            // }
        }

        // if(labelname==null){
        //     toast.error('Please enter Label.');
        //     return;
        // }
        
        const payload = {
          token:getLoggedObject()?.token,
          edit_name: departmentname,
          name:!showdropdown?departmentname:standardService,
          showdropdown: !showdropdown?0:1,
          ratetype: ratedata,
          hrs:contactemails,
          price: ponumber,
          unit_price: unitprice,
          markup:markup?1:0,
          pricingmode:pricingmode==""?0:pricingmode,
          markupprice: nameinfo==null?0:nameinfo,
          markupcost: address==null?0:address,
          desription: pdfdescription,
          interal_notes: internalnotes,
          id: cid,
          client_number: client_number,
          proposal:proposal__,
          tax: tax,
          label:labelname,
          update_id: edit_task==1?came_from_client_date:0,
          edit_task: edit_task

        }
        setLoading(true);
        const {isError, data} = await doPost(payload, client_number==0?'add_new_cost':'add_asa_cost');
        if(isError) {
            toast.error('Something went wrong with server.');
            setLoading(false);
        }else{
            if (data.action == "success") {
              setLoading(false);
              if(cid == 0){
                toast.success("Information added successfully!")
              } else {
                toast.success("Information updated successfully!")
              }
              if(vid==1){
                  window.location.reload();
              } else {
                if(proposal__ == 1){
                    navigate("/new/quote/"+client_number, {state: {proposal: params.state?.proposal, version:version____}})
                } else {
                if(client_number == 0){
                    navigate('/costs')
                  } else {
                    navigate('/send/client/'+client_number)
                      
                  }
                }
              }
            }
            else {
                setLoading(false);
                toast.error(data.error);
            }
        }
    }

    const update_state_service = async (id:any) => {
        const payload = {
            token:getLoggedObject()?.token,
            id:id
        }
        setLoading(true);
        const {isError, data} = await doPost(payload, 'get_specific_cost');
        setLoading(false);
        if(isError) {
            toast.error('Something went wrong with server.');
            setLoading(false);
        }else{
            if (data.action == "success") {
                const data_show = data?.data;
                setRateData(data_show.rate_type==null?"":data_show.rate_type)
                setContactEmails(data_show.est_hrs)
                setPoNumber(data_show.price)
                setUnitPrice(data_show.unit_price)
                setMarkup(data_show.markup==1?true:false)
                setPricingMode(data_show.markup_type==0?"":data_show.markup_type)
                setNameInfo(data_show.markup_price)
                setAddress(data_show.markup_cost)
                setPdfDescription(data_show.desription)
                setInternalNotes(data_show.internal_notes)
                setTax(data_show?.tax==null?null:data_show?.tax)
                setLabelName(data_show?.label==null?null:data_show?.label)
                setLoading(false);
            }
            else {
                setLoading(false);
                toast.error(data.error);
            }
        }
    }

    useEffect(() => {
        calculate_unit_price("1", "2")
    }, [pricingmode]);

    const calculate_unit_price =  async (val:any, fo:any) => {
            // const time_for = fo=="hr"?val:contactemails==null?0:contactemails;
            const time_for = 1;
            const amount = fo=="pr"?val:ponumber==null?0:ponumber;
            const markup__ = fo=="markup"?val:address==null?0:address;

            const total_unite = ((time_for) * (amount));
            // if(pricingmode==1){
            //     // PERCENTAGE
            //     const result = (total_unite * markup) / 100;
            //     console.log(result)
            //     var new_markup:any = result;
            // } else {
            //     var new_markup:any = markup==""?0:markup;
            // }

            if(pricingmode==1){
                const result = (total_unite * markup__) / 100;
                var new_markup:any = result;
            } else if(pricingmode == 2){
                var new_markup:any = markup__==""?0:markup__;
            } else {
                var new_markup:any = 0;
            }
            
            const plus_all = ((total_unite) + parseFloat(new_markup))
            const final_o = Number.isNaN(plus_all)?0:plus_all;

            setUnitPrice(final_o)
    }

    
    return (
      <>
         <style>
            {
            `.max-w-full {
                    background-color: #ffffff;
                }`
            }
        </style>
        <div className="flex flex-col items-center mt-8 intro-y sm:flex-row  pl-2">
          <h2 className="mr-auto text-lg font-medium">{slugFromUrl==''?"New":"Updated"} Cost Information</h2>
        </div>

        <div className="pb-3">
            <div className="my-5">
                <div className="grid grid-cols-12 gap-3 overflow-y-auto pt-0 mycustominput  p-2">
            <div className={"col-span-12 text-left"}>
                <label className={"pb-2 text-sm  flex justify-between align-center"}>
                    <div>Cost Name <span className="redclass">*</span></div>

                    {
                        (client_number != 0 && edit_task == 0) &&
                        <div className="">
                            <div className="flex align-center">
                                <FormCheck.Input
                                    id={"task_neww"}
                                    type="checkbox"
                                    value={1}
                                    name="markup"
                                    //@ts-ignore
                                    checked={!showdropdown}
                                    onChange={(e)=>
                                        setShowDropDown(!showdropdown)
                                    }
                                />
                                <FormCheck.Label htmlFor={"task_neww"}>
                                    New Cost
                                </FormCheck.Label>
                            </div>
                        </div>
                    }
                
                </label>
                {/* <FormInput 
                    type="text"
                    name="departmentname"
                    value={departmentname}
                    onChange={(e) => setDepartmentName(e.target.value)}
                    aria-label="default input inline 1"
                /> */}

                {
                    !showdropdown &&
                    <FormInput 
                        type="text"
                        name="departmentname"
                        value={departmentname}
                        onChange={(e) => setDepartmentName(e.target.value)}
                        aria-label="default input inline 1"
                    />
               }
               {
                    (showdropdown  && edit_task != 0) &&
                    <FormInput 
                        type="text"
                        name="departmentname"
                        value={departmentname}
                        onChange={(e) => setDepartmentName(e.target.value)}
                        aria-label="default input inline 1"
                    />
               }
                {
                        (showdropdown  && edit_task == 0) &&
                        <div>
                            <TomSelect value={standardService} 
                                name={"standard_services"}
                                // disabled={edit_task === 1}
                                onChange={(v) => {
                                    update_state_service(v)
                                    setStandardService(v)
                                }}
                                options={{
                                                placeholder: "Search Costs",
                                                }} className="w-full">

                                {abcservice.map((v:any, i:any) => (
                                    <option value={v.id}>{v.name}</option>
                                ))}
                            </TomSelect>
                        </div>
                } 
            </div>

            <div className={"col-span-3 text-left"}>
                <label className={"pb-2 text-sm"}>Rate Type  <span className="redclass">*</span></label>
                <TomSelect value={ratedata} 
                name={"rate_data"}
                onChange={(v) => {
                    setRateData(v)
                }}
                options={{
                                placeholder: "Search Rate Type",
                                }} className="w-full">
                {ratetype.map((v:any, i:any) => (
                    <option key={v} value={v}>{v}</option>
                ))}
                    
                </TomSelect>
            </div>

            <div className={"col-span-3 text-left"}>
                <label className={"pb-2 text-sm"}>
                    {ratedata=="SF (square foot)"?"SF (square foot)":'Estimated Time'} <span className="redclass">*</span>
                </label>
                <FormInput type="text"
                            name={"contactemails"}
                            value={contactemails}
                            onChange={(e)=>
                                {
                                    setContactEmails(e.target.value)
                                    calculate_unit_price(e.target.value, 'hr')
                                }
                            }
                            onKeyPress={(e) => {
                                const keyCode = e.keyCode || e.which;
                                const keyValue = String.fromCharCode(keyCode);
                                const regex = /^[0-9\b]+$/;
                                if (!regex.test(keyValue)) {
                                    e.preventDefault();
                                }
                            }}
                            aria-label="default input inline 1"/>
            </div>

            

            <div className={"col-span-3 text-left"}>
                <label className={"pb-2 text-sm"}>Bill Rate <span className="redclass">*</span></label>
                <FormInput type="text"
                            name={"ponumber"}
                            value={ponumber}
                            onChange={(e)=>
                                {
                                    setPoNumber(e.target.value)
                                    calculate_unit_price(e.target.value, 'pr')
                                }
                            }
                            onKeyPress={(e) => {
                                const keyCode = e.keyCode || e.which;
                                const keyValue = String.fromCharCode(keyCode);
                                const regex = /^[0-9\b.]+$/;
                                if (!regex.test(keyValue)) {
                                    e.preventDefault();
                                }
                            }}
                            aria-label="default input inline 1"/>
            </div>

            <div className={"col-span-3 text-left"}>
                <label className={"pb-2 text-sm"}>Unit Price</label>
                <FormInput type="text"
                            name={"unitprice"}
                            defaultValue={unitprice}
                            readOnly
                            onChange={(e)=>setUnitPrice(e.target.value)}
                            onKeyPress={(e) => {
                                const keyCode = e.keyCode || e.which;
                                const keyValue = String.fromCharCode(keyCode);
                                const regex = /^[0-9\b]+$/;
                                if (!regex.test(keyValue)) {
                                    e.preventDefault();
                                }
                            }}
                            aria-label="default input inline 1"/>
            </div>

             <div className={"col-span-4 text-left mt-2"}>
                <div className="flex">
                    <FormCheck.Input
                        id={"markup"}
                        type="checkbox"
                        value={1}
                        name="markup"
                        //@ts-ignore
                        checked={markup}
                        onChange={(e)=>
                            {
                                setMarkup(!markup)
                                if(!markup == false){
                                    setPricingMode("")
                                    setAddress(null)
                                    calculate_unit_price('bb', 'aa')
                                }
                                // calculate_unit_price('bb', 'aa')
                            }
                            // setMarkup(!markup)
                        }
                    />
                    <FormCheck.Label htmlFor={"markup"}>
                        Calculate Markup
                    </FormCheck.Label>
                </div>
            </div>

            {
                markup &&
                <div className="col-span-12 flex gap-5">
                <div className={"col-span-6 text-left"}>
                    <label className={"pb-2 text-sm"}>Mark up Type <span className="redclass">*</span></label>
                    <TomSelect 
                    value={pricingmode} 
                    name={"pricing_mode"}
                    onChange={(v) => {
                        setPricingMode(v)
                        calculate_unit_price('a', 'b')
                    }}
                    options={{
                                    placeholder: "Mark up Type",
                                    }} className="w-full" >
                                    <option value=""></option>
                        <option value="1">%</option>
                        <option value="2">$</option>
                    </TomSelect>
                </div>
                    {/* <div className={"col-span-4 text-left"}>
                        <label className={"pb-2 text-sm"}>Markup</label>
                        <FormInput type="text"
                                    name={"nameinfo"}
                                    defaultValue={nameinfo}
                                    onChange={(e)=>setNameInfo(e.target.value)}
                                    onKeyPress={(e) => {
                                        const keyCode = e.keyCode || e.which;
                                        const keyValue = String.fromCharCode(keyCode);
                                        const regex = /^[0-9\b]+$/;
                                        if (!regex.test(keyValue)) {
                                            e.preventDefault();
                                        }
                                    }}
                                    aria-label="default input inline 1"/>
                    </div> */}
                    <div className={"col-span-4 text-left"}>
                        <label className={"pb-2 text-sm"}>Markup <span className="redclass">*</span></label>
                        <FormInput type="text"
                                    name={"address"}
                                    value={address}
                                    // onChange={(e)=>setAddress(e.target.value)}
                                    onChange={(e)=>
                                        {
                                            setAddress(e.target.value)
                                            calculate_unit_price(e.target.value, 'markup')
                                        }
                                    }
                                    onKeyPress={(e) => {
                                        const keyCode = e.keyCode || e.which;
                                        const keyValue = String.fromCharCode(keyCode);
                                        const regex = /^[0-9\b.]+$/;
                                        if (!regex.test(keyValue)) {
                                            e.preventDefault();
                                        }
                                    }}
                                    disabled={pricingmode==""}
                                    aria-label="default input inline 1"/>
                    </div>

                </div>
            }
        {/* <div className={"col-span-12 text-left"}>
                <div className={"col-span-4 text-left"}>
                    <label className={"pb-2 text-sm"}>Tax (%) <span className="redclass">*</span></label>
                    <FormInput type="text"
                                name={"tax"}
                                defaultValue={tax}
                                onChange={(e)=>setTax(e.target.value)}
                                onKeyPress={(e) => {
                                    const keyCode = e.keyCode || e.which;
                                    const keyValue = String.fromCharCode(keyCode);
                                    const regex = /^[0-9\b]+$/;
                                    if (!regex.test(keyValue)) {
                                        e.preventDefault();
                                    }
                                }}
                                aria-label="default input inline 1"/>
                </div>
        </div> */}

            <div className={"col-span-12 text-left"}>
                <label className={"pb-2 text-sm flex justify-between align-center"}>
                    <div>Label </div>
                </label>
                <FormInput 
                    type="text"
                    name="label"
                    value={labelname || null}
                    onChange={(e) => setLabelName(e.target.value)}
                    aria-label="default input inline 1"
                />
               
            </div>

            <div className={"col-span-12 text-left"}>
                <label className={"pb-2 text-sm"}>Code</label>
                <FormTextarea 
                            name={"pdfdescription"}
                            defaultValue={pdfdescription}
                            onChange={(e)=>setPdfDescription(e.target.value)}
                            aria-label="default input inline 1"/>
            </div>

             <div className={"col-span-12 text-left"}>
                <label className={"pb-2 text-sm"}>Internal notes</label>
                <FormTextarea 
                            name={"pdfdescription"}
                            defaultValue={internalnotes}
                            onChange={(e)=>setInternalNotes(e.target.value)}
                            aria-label="default input inline 1"/>
            </div>

            <div className={"col-span-12 text-right"}>
                <div className="flex w-[100%] justify-end gap-5">
                {
                    editid==null &&
               
                    <Button type="button" className="w-20 text-primary  w-[180px]" ref={sendButtonRef} onClick={()=> {
                        editid==null?save_service(1):save_service(1)
                    }}>
                        {loading?<LoadingIcon icon="rings" className="w-8 h-5 whiteocolor" />:'Save & Add'}
                    </Button>
                 }
                    <Button type="button" onClick={()=> {
                            if(proposal_number==1){
                                navigate("/new/quote/"+client_number, {state: {proposal: params.state?.proposal, version:version____}})
                            } else {
                                if(client_number == 0){
                                    navigate("/costs")
                                } else {
                                    navigate("/send/client/"+client_number)
                                }
                            }
                        }}
                        className="w-20 mr-1 float-left   w-[120px]"
                        >
                        Cancel
                    </Button>
                    <Button variant="primary" type="button" className="w-20  w-[120px]" ref={sendButtonRef} onClick={()=> editid==null?save_service(0):save_service(0,editid)}>
                        {loading?<LoadingIcon icon="rings" className="w-8 h-5 whiteocolor" />:editid==null?"Save":"Update"}
                    </Button>
                </div>
            </div>
         
        </div>
        </div>
        </div>
      </>
    );
  }
  
  export default NewTask;
  