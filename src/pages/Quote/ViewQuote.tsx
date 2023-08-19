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
import fakerData from "../../utils/faker";
import LoadingIcon from "../../base-components/LoadingIcon";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


interface Response {
  name?: string;
  category?: string;
  images?: string[];
  status?: string;
}

const generateRandomNumber = () => {
    const min = 10000; // Minimum 6-digit number
    const max = 99999; // Maximum 6-digit number
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber
}

function SendClient() {
    
    const params = useLocation();
    var type_quote = 0;
    if (params.state?.proposal) {
       type_quote = params.state?.proposal;
    }
    const quote_type = type_quote;

    const {getLoggedObject, setLoggedObject, isLoggedIn, checkLogin} = useAuth();
    const [proposalnumber, setProposalNumber] = useState<any | null>(null)
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [addNewDept, setAddNewDept] = useState(false)
    const [del, setDel] = useState(false)
    const [allusers, setAllusers] = useState(null)
    const [selectedDept, setSelectedDept] = useState(null)
    const [searchtext, setSearchText] = useState(null)
    const [asa, setAsa] = useState<any | null>([])
    const [filtered, setFiltered] = useState(null)
    const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
    const [deletecostConfirmationModal, setDeleteCostConfirmationModal] = useState(false);
    
    const [adddepertmentmodal, setAddDepartmentModal] = useState(false)
    const deleteButtonRef = useRef(null);
    const sendButtonRef = useRef(null)
    const [departmentname, setDepartmentName] = useState(null)

    const [firstname, setFirstname] = useState(null)
    const [lastname, setLastname] = useState(null)
    
    const [password, setPassword] = useState(null)
    const [userdata, setUserData] = useState(null)
    const [editid, setEditID] = useState(null)
    const [delid, setDelID] = useState(null)
    // NEW REQUEST FORM ASA
    const full_name = getLoggedObject()?.first_name+" "+getLoggedObject()?.last_name;
    const user_default_id = getLoggedObject()?.id;
    // const [requestdate, setRequestDate] = useState<any | null>(null)
    // Get the current date and time


    const [requestdate, setRequestDate] = useState<any | null>(new Date().toISOString().slice(0,-8));
    
    // const [requestdate, setRequestDate] = useState<any | null>(new Date().toLocaleString([], {timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone}).slice(0, -8));

    const [fullname, setFullName] = useState(user_default_id)
    const [disablefullname, setDisableFullName] = useState(true)
    const [email, setEmail] = useState( getLoggedObject()?.email)
    const [disableemail, setDisableEmail] = useState(true)
    const [projectnumber, setProjectNumber] = useState<any | null>(null)
    const [projectname, setProjectName] = useState<any | null>(null)
    const [clientprojectnumber, setClientprojectnumber] = useState<any | null>(null)
    const [client, setClient] = useState<any | null>(null)
    const [clientcontact, setClientContact] = useState<any | null>(null)
    const [contactemails, setContactEmails] = useState<any | null>(null)
    const [ponumber, setPoNumber] = useState<any | null>(null)
    const [nameinfo, setNameInfo] = useState<any | null>(null)

    const [address, setAddress] = useState<any | null>(null)
    const [cityinfo, setCityInfo] = useState<any | null>(null)
    const [stateinfo, setStateInfo] = useState<any | null>(null)
    const [zipcode, setZipCode] = useState<any | null>(null)
    const [pdfdescription, setPdfDescription] = useState<any | null>(null)
    const current_date_to_manage  = new Date().toISOString().split('T')[0];
    const [startdate, setStartDate] = useState<any | null>(new Date().toISOString().split('T')[0])

    const currentDate = new Date();
    const futureDate = new Date(currentDate.getTime() + 90 * 24 * 60 * 60 * 1000);
    const [futrudate, setFutruDate] = useState<any | null>(futureDate.toISOString().split('T')[0])

    const valid_date_to_manage = new Date().toISOString().split('T')[0];
    const date_Valid = new Date(valid_date_to_manage);
    date_Valid.setDate(date_Valid.getDate() + 7);
    const minimum_valid_date = date_Valid.toISOString().split('T')[0];
    const [internalbudget, setInternalBudget] = useState<any | null>(null)
    const [internalnotes, setInternalNotes] = useState<any | null>(null)
    const [pricingmode, setPricingMode] = useState<any | null>(1)
    const [markup, setMarkup] = useState<any | null>(false)
    const [templatesid, setTemplatesID] = useState<any | null>("")
    const [templatelist, setTemplateList] = useState<any | null>([])


    const [servicedescription, setServiceDescription] = useState<any | null>(null)
    const [standardService, setStandardService] = useState<any | null>([])
    const [standardServicelist, setStandardServicelist] = useState([])
    const [urgencywork, setUrgencyWork] = useState<any | null>(0)
    const [disciplinelist, setDisciplinelist] = useState<any | null>([])
    const [items, setItems] = useState([])
    const [archived, setArchived] = useState<any[]>([])
    const [archivebutton, setArchiveButton] = useState<any | null>(false)
    // const [branches, setBranches] = useState<any | null>([])
    const [branches, setBranches] = useState<any[]>([]);
    const [disciplinehour, setDisciplineHour] = useState([])
    const [disciplintasks, setDisciplineTasks] = useState([])
    const [completiondate, setCompletionDate] = useState<any | null>(null)
    const [compdiscipline, setCompdiscipline] = useState<any | null>(null)
    const [notifyengineers, setNotifyengineers] = useState<any | null>([])
    const [additionalpm, setAdditionalpm] = useState<any | null>(false)
    const [userlist, setUserList] = useState<any | null>([])
    const [selectedRequest, setSelectedRequest] = useState<any | null>(null)
    const [infoModal, setInfoModal] = useState<any | null>(false)
    const [createNewModal, setCreateNewModal] = useState<any | null>(false)

    const [alltasks, setAllTasks] = useState<any | null>([])
    const [billtasks, setBillTasks] = useState<any | null>([])
    const [allcosts, setAllCosts] = useState<any | null>([])
    const [billcosts, setBillCosts] = useState<any | null>([])
    
    const path = window.location.pathname;
    const lastSlashIndex = path.lastIndexOf('/');
    const slugFromUrl = lastSlashIndex !== -1 ? path.substring(lastSlashIndex + 1) : '';
    
    useEffect(() => {
        get_standard_services(slugFromUrl);
        get_asa_tasks(slugFromUrl)
        get_asa_costs(slugFromUrl)
    }, []);

    const get_standard_services = async (slugFromUrl:any) => {
        
      const payload = {
        token:getLoggedObject()?.token,
        id: slugFromUrl
      }
      setLoading(true);
      const {isError, data} = await doPost(payload, 'get_all_quotes');
      if(isError) {
          toast.error('Something went wrong with server.');
          setLoading(false);
      }else{
          if (data.action == "success") {
            setLoading(false);
            setAsa(data?.asa_data);
          }
          else {
              setLoading(false);
              toast.error(data.error);
          }
      }
    }

   
    const get_asa_tasks = async (slugFromUrl:any) => {
        const payload = {
          token:getLoggedObject()?.token,
          id: slugFromUrl,
          proposal:1
        }
        setLoading(true);
        const {isError, data} = await doPost(payload, 'get_asa_client_tasks');
        
        // console.table(data)
        if(isError) {
            toast.error('Something went wrong with server.');
            setLoading(false);
        }else{
            if (data.action == "success") {
              setLoading(false);
              setAllTasks(data?.tasks);
            }
            else {
                setLoading(false);
                toast.error(data.error);
            }
        }
    }

    const get_asa_costs = async (slugFromUrl:any) => {
        const payload = {
          token:getLoggedObject()?.token,
          id: slugFromUrl,
          proposal:1
        }
        setLoading(true);
        const {isError, data} = await doPost(payload, 'get_asa_client_costs');
        if(isError) {
            toast.error('Something went wrong with server.');
            setLoading(false);
        }else{
            if (data.action == "success") {
              setLoading(false);
              setAllCosts(data?.tasks);
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

    const do_update_costs_checkbox = async (id:any) => {
        if(billcosts.includes(id as never)){
          var people = billcosts;
          var toRemove = id;
          var index = people.indexOf(toRemove as never);
          if (index > -1) { 
            people.splice(index, 1);
          }
          setBillCosts([...people]);
        } else {
          var people = billcosts;
          people.push(id as never);
          setBillCosts([...people]);
        }
    }

    
    
    const do_delete_popup = async (id:any) => {
        setDelID(id);
        setDeleteConfirmationModal(true);
    }

    const do_delete_cost_popup = async (id:any) => {
        setDelID(id);
        setDeleteCostConfirmationModal(true);
    }

    const delete_confirm_task = async () =>{
        const payload = {
          token:getLoggedObject()?.token,
          id:delid
        }
        setLoading(true);
        const {isError, data} = await doPost(payload, 'delete_specific_task_asa');
        setLoading(false);
        if(isError) {
            toast.error('Something went wrong with server.');
            setLoading(false);
        }else{
            if (data.action == "success") {
              setDeleteConfirmationModal(false)
              setLoading(false);
              setDelID(null)
              toast.info("Task deleted successfully!")
              get_asa_tasks(slugFromUrl);
            }
            else {
                setLoading(false);
                toast.error(data.error);
            }
        }
    }

    const delete_confirm_cost = async () =>{
        const payload = {
          token:getLoggedObject()?.token,
          id:delid
        }
        setLoading(true);
        const {isError, data} = await doPost(payload, 'delete_specific_cost_asa');
        setLoading(false);
        if(isError) {
            toast.error('Something went wrong with server.');
            setLoading(false);
        }else{
            if (data.action == "success") {
              setDeleteCostConfirmationModal(false)
              setLoading(false);
              setDelID(null)
              toast.info("Cost deleted successfully!")
              get_asa_costs(slugFromUrl);
            }
            else {
                setLoading(false);
                toast.error(data.error);
            }
        }
    }

    const save_client_data = async (type:any = 0) =>{
        if(loading) return;
        if(type===2){} else {
            if(setProjectNumber==null){
                toast.error('Please enter project number.');
                return;
            }
            if(projectname==""){
                toast.error('Please enter project name.');
                return;
            }
            if(client==""){
                toast.error('Please enter client.');
                return;
            }
            if(clientcontact==null){
                toast.error('Please enter client contact.');
                return;
            }
            // if(templatesid==""){
            //     toast.error('Please select a template.');
            //     return;
            // }
            if(contactemails==null){
                toast.error('Please select contact email.');
                return;
            }
            // if(ponumber==null){
            //     toast.error('Please enter PO number.');
            //     return;
            // }
            // if(nameinfo==null){
            //     toast.error('Please enter name.');
            //     return;
            // }
            // if(clientprojectnumber==null){
            //     toast.error('Please enter client project number.');
            //     return;
            // }
            if(address==null){
                toast.error('Please enter address.');
                return;
            }
            // if(cityinfo==null){
            //     toast.error('Please enter city.');
            //     return;
            // }
            // if(stateinfo==null){
            //     toast.error('Please enter state.');
            //     return;
            // }
            // if(zipcode==null){
            //     toast.error('Please enter zipcode.');
            //     return;
            // }
            if(pdfdescription==null){
                toast.error('Please enter description.');
                return;
            }

            if(startdate==null){
                toast.error('Please select a date.');
                return;
            }

            if(futrudate==null){
                toast.error('Please select valid to date.');
                return;
            }
            // if(internalbudget==null){
            //     toast.error('Please enter budget.');
            //     return;
            // }
            // if(internalnotes==null){
            //     toast.error('Please enter internal notes.');
            //     return;
            // }
            if(pricingmode==""){
                toast.error('Please select pricing mode.');
                return;
            }
            if(urgencywork==""){
                toast.error('Please select work unrgency.');
                return;
            }
            if(billtasks.length == 0){
                toast.error('Please select atleast one or more task(s).');
                return;
            }
            if(billcosts.length == 0){
                toast.error('Please select atleast one or more costs(s).');
                return;
            }
        }

        // return;
        const payload = {
          token:getLoggedObject()?.token,
          quote_number:proposalnumber,
          type:quote_type===1?1:2,
          projectnumber:projectnumber,
          projectname: projectname,
          client:client,
          clientcontact: clientcontact,
          templatesid: templatesid==null?0:templatesid,
          nameinfo:nameinfo,
          markup:markup?1:0,
          contactemails:contactemails,
          ponumber: ponumber,
          clientprojectnumber: clientprojectnumber,
          address: address,
          cityinfo: cityinfo,
          stateinfo: stateinfo,
          zipcode: zipcode,
          description: pdfdescription,
          startdate: startdate,
          futrudate: futrudate,
          internalbudget: internalbudget==null?0:internalbudget,
          internalnotes: internalnotes,
          pricingmode: pricingmode==null?1:pricingmode,
          urgencywork: urgencywork,
          sendtype:type,
          billtasks:billtasks,
          billcosts:billcosts,
          update_status: 3
        }
        // console.log(payload)
        // return;
        setLoading(true);
        const {isError, data} = await doPost(payload, 'quote_client_data');
        if(isError) {
            toast.error('Something went wrong with server.');
            setLoading(false);
        }else{
            if (data.action == "success") {
                setLoading(false);
                if(type==2){
                    // toast.success("Information drafted successfully!")
                } else if(type==3){
                    toast.success("ASA information saved & issued to client!")
                } else {
                    navigate('/quotes')
                }
            }
            else {
                setLoading(false);
                toast.error(data.error);
            }
        }
    }


    const onDragEnd = (result:any) => {
        if (!result.destination) return; // Dragged outside the droppable area
        const items = Array.from(alltasks);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        // console.log(items);
        setAllTasks(items);
    };

    const onDragEndCost = (result:any) => {
        if (!result.destination) return; // Dragged outside the droppable area
        const items = Array.from(allcosts);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        // console.log(items);
        setAllCosts(items);
    };

    
    

    const HandleTaskUpdate = async (val:any, cval:any, id:any) => {
        const updatedTasks = [...alltasks];
        updatedTasks[id] = { ...updatedTasks[id], [cval]: val }; // Update cval value
        setAllTasks(updatedTasks);

        const payload = {
          token:getLoggedObject()?.token,
          task:updatedTasks[id],
          pricingmode:pricingmode
        }
        // console.log(payload)
        // return;
        const {isError, data} = await doPost(payload, 'update_already_task_client');
        if(isError) {
            toast.error('Something went wrong with server.');
        }else{
            if (data.action == "success") {
                // get_asa_tasks(slugFromUrl)
            }
            else {
                toast.error(data.error);
            }
        }
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
            <h2 className="mr-auto font-bold text-2xl">
                {quote_type===1?"Quote Information":"Quote Information"}
            </h2>
        </div>

        <div className="pt-5 px-2 flex gap-10 align-center" style={{borderBottom:'1px solid #999'}}>
            <div className="">
                <div className="font-bold text-xl">{asa.type==1?asa.quote_number:asa.projectnumber} - {asa.projectname}</div>
            </div>
            <div className="flex gap-5">
                <div className="hover_info hover_activ">
                    Information
                </div>
                <div className="hover_info">
                    Notes
                </div>
                <div className="hover_info">
                    Documents
                </div>
                <div className="hover_info">
                    History
                </div>
                <div className="hover_info">
                    Costs
                </div>
                <div className="hover_info">
                    Time Sheet
                </div>
                <div className="hover_info">
                    Financial
                </div>
            </div>
        </div>
        
        
        <div className="pb-3">
            <div className="my-5">
                <div className="p-2 pt-0">

            
            

                <div className="full_row_quote flex">
                    <div className="bold_heading">Project Number:</div>
                    <div className="font-bold text-xl blurColor">
                        {asa.projectnumber}
                    </div>
                </div>

                <div className="row_two_column flex">
                    <div className="flex_1 flex">
                        <div className="bold_heading">Proposal Number:</div>
                        <div className="font-bold text-xl">{asa.quote_number+(asa && asa?.revision_number!=null?"."+asa?.revision_number:"")}</div>
                    </div>
                    <div className="flex_1 flex">
                        <div className="bold_heading">Project Name:</div>
                        <div className="">{asa.projectname}</div>
                    </div>
                    <div className="flex_1 flex">
                        <div className="bold_heading">Client:</div>
                        <div className="">{asa.client}</div>
                    </div>
                    <div className="flex_1 flex">
                        <div className="bold_heading">Contact Name:</div>
                        <div className="">{asa.clientcontact}</div>
                    </div>
                    

                    <div className="flex_1 flex">
                        <div className="bold_heading">Name:</div>
                        <div className="">{asa.name}</div>
                    </div>
                    <div className="flex_1 flex">
                        <div className="bold_heading">Additional Email:</div>
                        <div className="">{asa.contactemails}</div>
                    </div>

                    <div className="flex_1 flex">
                        <div className="bold_heading">Project Address:</div>
                        <div className="">{asa.address}</div>
                    </div>
                    <div className="flex_1 flex">
                        <div className="bold_heading">PO Number:</div>
                        <div className="">{asa.po_number}</div>
                    </div>

                    <div className="flex_1 flex">
                        <div className="bold_heading"></div>
                        <div className="">{asa.city} {asa.state!=null?","+asa.state:""} {asa.zipcode!=null?","+asa.zipcode:""}</div>
                    </div>
                    <div className="flex_1 flex">
                        <div className="bold_heading">Client Project Number:</div>
                        <div className="">{asa.clientprojectnumber}</div>
                    </div>

                </div>

                <div className="full_row_quote flex">
                        <div className="bold_heading">Client Address:</div>
                        <div className="">{asa.client_address}</div>
                    </div>

                <div className="full_row_quote flex" style={{alignItems: "flex-start"}}>
                    <div className="bold_heading">Description:</div>
                    <div className="">
                    {/* {asa && asa.description && asa.description.replace(/<br\s*\/?>/g, '\n')} */}
                    {asa.description}
                    </div>
                </div>

                <div className="row_two_column flex">
                    <div className="flex_1 flex">
                        <div className="bold_heading">Date Issued:</div>
                        <div className="">{asa.start_date}</div>
                    </div>
                    <div className="flex_1 flex">
                        <div className="bold_heading">Valid Till:</div>
                        <div className="">{asa.valid_date}</div>
                    </div>
                </div>

                <div className="full_row_quote flex">
                    <div className="bold_heading">Budget:</div>
                    <div className="">{asa.budget}</div>
                </div>

                <div className="full_row_quote flex">
                    <div className="bold_heading">Internal Notes:</div>
                    <div className="">{asa.internal_notes}</div>
                </div>

                <div className="full_row_quote flex">
                    <div className="bold_heading">Urgency Of Work:</div>
                    <div className="">
                        <span className={getUrgencyEnums(asa.asa_urgency_work).color}>
                            {getUrgencyEnums(asa.asa_urgency_work).title}
                        </span>
                    </div>
                </div>

           
            
        {/* TASKS DATA */}
        <div className="mt-12 col-span-12 ">
            <div className="task_heading mb-5">
                Tasks
            </div>


            <div className="table_bg_custom col-span-12">
            <DragDropContext onDragEnd={onDragEnd}>
            <div>
                <Droppable droppableId="table">
                {(provided:any) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                    <div className="overflow-x-auto sm:overflow-x-visible">
                        <div className="intro-y">
                            <div
                                    className={clsx([
                                    "transition duration-200 ease-in-out transform cursor-pointer inline-block sm:block border-b border-slate-200/60 dark:border-darkmode-400 font-medium",
                                        "bg-slate-100 text-slate-600 dark:text-slate-500 dark:bg-darkmode-400/70",
                                    ])}
                                >
                                    <div className="flex px-5 py-3">
                                   
                                    <div className="w-[44%]">
                                        Name
                                    </div>
                                    <div className="w-[12%]">
                                        Time
                                    </div>
                                    <div className="w-[12%]">
                                        Base Rate
                                    </div>
                                    <div className="w-[12%]">
                                        Cost
                                    </div>
                                    <div className="w-[12%]">
                                        Billable Rate
                                    </div>
                                    <div className="w-[12%]">
                                        Total
                                    </div>
                                    
                                    </div>
                            </div>
                        </div>
                    </div>
                    {alltasks.map((v:any, id:any) => (
                        <Draggable key={v.id} draggableId={v.id.toString()} index={id}>
                        {(provided:any) => (
                            <div
                            key={v.id}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            >
                            <div className="intro-y">
                            <div key={v.id} className="intro-y">
                        <div
                            className={clsx([
                            "transition duration-200 ease-in-out transform cursor-pointer inline-block sm:block border-b border-slate-200/60 dark:border-darkmode-400",
                            "hover:scale-[1.002] hover:relative hover:z-20 hover:shadow-md hover:border-0 hover:rounded",
                                "bg_white  text-slate-600 dark:text-slate-500 dark:bg-darkmode-400/70",
                            ])}
                        >
                        <div className="flex px-5 py-3 customdisabled">
                        
                            <div className="w-[44%]">
                                
                                <span className="blue_color">{v.task_name}</span>
                               
                                <div className="custom_pre">
                                    <pre>{v.task_description}</pre>
                                </div>
                            </div>
                        
                        <div className="w-[12%] custom_center">
                            {v.task_time}
                        </div>
                        
                        <div className="w-[12%] custom_center">
                            {v.price}
                        </div>
                        <div className="w-[12%]  custom_center">
                            {v.cost}
                        </div>
                        <div className="w-[12%] custom_center">
                            {v.price}
                        </div>
                        <div className="w-[12%] custom_center">
                            {v.total}
                        </div>
                        
                        </div>
                    </div>
                    </div>
                            </div>
                            </div>
                        )}
                        </Draggable>
                    ))}
                    {provided.placeholder}
                    </div>
                )}
                </Droppable>
            </div>
            </DragDropContext>

            
                
            </div>
        </div>
        


         {/* COSTS DATA */}
        <div className="mt-5 col-span-12">
            <div className="task_heading mb-5">
                Costs
            </div>

            <div className="table_bg_custom col-span-12">
            <DragDropContext onDragEnd={onDragEndCost}>
            <div>
                <Droppable droppableId="table">
                {(provided:any) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                    <div className="overflow-x-auto sm:overflow-x-visible">
                        <div className="intro-y">
                            <div
                                    className={clsx([
                                    "transition duration-200 ease-in-out transform cursor-pointer inline-block sm:block border-b border-slate-200/60 dark:border-darkmode-400 font-medium",
                                        "bg-slate-100 text-slate-600 dark:text-slate-500 dark:bg-darkmode-400/70",
                                    ])}
                                >
                                    <div className="flex px-5 py-3">
                                    
                                    <div className="w-[44%]">
                                        Name
                                    </div>
                                    <div className="w-[12%]">
                                        Quantity
                                    </div>
                                   
                                    <div className="w-[12%]">
                                        Cost
                                    </div>
                                    <div className="w-[20%]">
                                        Calculated Markup
                                    </div>
                                    <div className="w-[12%]">
                                        Total
                                    </div>
                                   
                                    </div>
                            </div>
                        </div>
                    </div>
                    {allcosts.map((v:any, id:any) => (
                        <Draggable key={v.id} draggableId={v.id.toString()} index={id}>
                        {(provided:any) => (
                            <div
                            key={v.id}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            >
                            <div className="intro-y">
                            <div key={v.id} className="intro-y">
                        <div
                            className={clsx([
                            "transition duration-200 ease-in-out transform cursor-pointer inline-block sm:block border-b border-slate-200/60 dark:border-darkmode-400",
                            "hover:scale-[1.002] hover:relative hover:z-20 hover:shadow-md hover:border-0 hover:rounded",
                                "bg_white  text-slate-600 dark:text-slate-500 dark:bg-darkmode-400/70",
                            ])}
                        >
                        <div className="flex px-5 py-3 customdisabled">
                        
                            <div className="w-[44%]">
                                
                                <span className="blue_color">{v.task_name}</span>
                               
                                <div className="custom_pre">
                                    <pre>{v.task_description}</pre>
                                </div>
                            </div>
                        
                        <div className="w-[12%]">
                            {v.task_time}
                        </div>
                        
                        <div className="w-[12%]">
                            {v.price}
                        </div>
                        <div className="w-[20%]">
                        {v.cost}
                        </div>
                        
                        <div className="w-[12%]">
                            {v.total}
                        </div>
                       
                        </div>
                    </div>
                    </div>
                            </div>
                            </div>
                        )}
                        </Draggable>
                    ))}
                    {provided.placeholder}
                    </div>
                )}
                </Droppable>
            </div>
            </DragDropContext>

            
                
            </div>
        </div>
        

       
       


        {/* <div className={"col-span-12 text-right mt-10"}>
            <div className="flex w-[100%] justify-end gap-3">
                
                <Button  type="button" className="w-20  w-[120px] text-primary" ref={sendButtonRef} onClick={()=> save_client_data(1)}>
                    {loading?<LoadingIcon icon="rings" className="w-8 h-5 whiteocolor" />:"Save & Print"}
                </Button>
                <Button  type="button" className="w-20  w-[120px]" ref={sendButtonRef} onClick={()=> save_client_data(2)}>
                    {loading?<LoadingIcon icon="rings" className="w-8 h-5 whiteocolor" />:"Save Draft"}
                </Button>
                <Button variant="primary" type="button" className="w-20  w-[120px]" ref={sendButtonRef} onClick={()=> save_client_data(3)}>
                    {loading?<LoadingIcon icon="rings" className="w-8 h-5 whiteocolor" />:"Issue & Print"}
                </Button>
                <Button type="button"  onClick={()=> {
                        navigate("/quotes")
                    }}
                    className="w-20 float-left   w-[120px] text-primary"
                    >
                    Cancel
                </Button>
                
            </div>
        </div> */}



        <Dialog
            open={deleteConfirmationModal}
            onClose={() => {
            setDeleteConfirmationModal(false);
            }}
            initialFocus={deleteButtonRef}
        >
            <Dialog.Panel>
                <div className="p-5 text-center">
                    <Lucide
                    icon="Info"
                    className="w-16 h-16 mx-auto mt-3 text-confirm"
                    />
                    <div className="mt-5 text-3xl">Are you sure?</div>
                    <div className="mt-2 text-slate-500">
                    Do you want to delete this task? 
                    </div>
                </div>
                <div className="px-5 pb-8 text-center">
                    <Button
                    // variant="outline-secondary"
                    type="button"
                    onClick={() => {
                        setDeleteConfirmationModal(false);
                    }}
                    className="w-24 mr-1"
                    >
                    Cancel
                    </Button>
                    <Button
                    variant="danger"
                    type="button"
                    className="w-24"
                    ref={deleteButtonRef}
                    onClick={()=>delete_confirm_task()}
                    >
                    Delete
                    </Button>
                </div>
            </Dialog.Panel>
        </Dialog>

        <Dialog
            open={deletecostConfirmationModal}
            onClose={() => {
            setDeleteCostConfirmationModal(false);
            }}
            initialFocus={deleteButtonRef}
        >
            <Dialog.Panel>
                <div className="p-5 text-center">
                    <Lucide
                    icon="Info"
                    className="w-16 h-16 mx-auto mt-3 text-confirm"
                    />
                    <div className="mt-5 text-3xl">Are you sure?</div>
                    <div className="mt-2 text-slate-500">
                    Do you want to delete this cost? 
                    </div>
                </div>
                <div className="px-5 pb-8 text-center">
                    <Button
                    // variant="outline-secondary"
                    type="button"
                    onClick={() => {
                        setDeleteCostConfirmationModal(false);
                    }}
                    className="w-24 mr-1"
                    >
                    Cancel
                    </Button>
                    <Button
                    variant="danger"
                    type="button"
                    className="w-24"
                    ref={deleteButtonRef}
                    onClick={()=>delete_confirm_cost()}
                    >
                    Delete
                    </Button>
                </div>
            </Dialog.Panel>
        </Dialog>


        </div>
        </div>
        </div>
      </>
    );
  }
  
  export default SendClient;
  