import React, { useEffect, useState, useRef, createRef } from "react";
import {Link, useNavigate} from 'react-router-dom';
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

import InfoModal from "./Modals/RequestInfo";
import Table from "../../base-components/Table";
import fakerData from "../../utils/faker";
import LoadingIcon from "../../base-components/LoadingIcon";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ClassicEditor } from "../../base-components/Ckeditor";


interface Response {
  name?: string;
  category?: string;
  images?: string[];
  status?: string;
}

function SendClient() {
    
    const {getLoggedObject, setLoggedObject, isLoggedIn, checkLogin} = useAuth();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [addNewDept, setAddNewDept] = useState(false)
    const [del, setDel] = useState(false)
    const [allusers, setAllusers] = useState(null)
    const [selectedDept, setSelectedDept] = useState(null)
    const [searchtext, setSearchText] = useState(null)
    const [asa, setAsa] = useState<any | null>(null)
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
    const [pdfdescription, setPdfDescription] = useState<any | null>('')
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
    const [pricingmode, setPricingMode] = useState<any | null>(0)
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

    const [templatepopup, setTemplatePopup] = useState<any | null>(false)
    
    const path = window.location.pathname;
    const lastSlashIndex = path.lastIndexOf('/');
    const slugFromUrl = lastSlashIndex !== -1 ? path.substring(lastSlashIndex + 1) : '';

    
    useEffect(() => {
        get_standard_services(slugFromUrl);
        get_asa_tasks(slugFromUrl)
        get_asa_costs(slugFromUrl)
        get_asa_client_data(slugFromUrl)
    }, []);

    const get_standard_services = async (slugFromUrl:any) => {
      const payload = {
        token:getLoggedObject()?.token,
        id: slugFromUrl
      }
        //console.log(payload);
      setLoading(true);
      const {isError, data} = await doPost(payload, 'get_all_standard_services');
      if(isError) {
          toast.error('Something went wrong with server.');
          setLoading(false);
      }else{
          if (data.action == "success") {
            setLoading(false);
            const data_show = data?.asa_data[0];
            setAsa(data_show);
            setRequestDate(data_show.asa_request_date)
            setProjectName(data_show.asa_project_name)
            setProjectNumber(data_show.asa_project_no)
            setClientprojectnumber(data_show.client_project_number)
            setClient(data_show.asa_company_name)
            setClientContact(data_show.company_contact)
            setContactEmails(data_show.asa_email)
            setPdfDescription(data_show.service_description==null?"":data_show.service_description)
            setServiceDescription(data_show.service_description)
            setUrgencyWork(data_show.urgency)
            setItems(data_show.items)
            setStandardService(data_show.standard_service_id)
            const newBranches = data_show.discipline_data;
            setBranches(data_show?.discipline_data)
            setCompletionDate(data_show?.request_due_date)
            setCompdiscipline(data_show?.completed_discipline)
            setNotifyengineers(data_show?.additional_pm_ar)
            setAddDepartmentModal(true);
            setTemplateList(data?.templates);
            setStandardServicelist(data?.data);
            setDisciplinelist(data?.discp);
            setUserList(data?.users_list)

            // setAllTasks(data?.tasks);
          }
          else {
              setLoading(false);
              toast.error(data.error);
          }
      }
    }

    const get_asa_client_data = async (slugFromUrl:any) => {
        const payload = {
          token:getLoggedObject()?.token,
          id: slugFromUrl
        }
        console.log(payload)
        setLoading(true);
        const {isError, data} = await doPost(payload, 'get_specific_asa_client_data');
        if(isError) {
            toast.error('Something went wrong with server.');
            setLoading(false);
        }else{
            if (data.action == "success") {
              setLoading(false);
              if(data.data == null){
                setPdfDescription(data?.data.description)
              } else {
                const data_show = data?.data;
                // console.log(data.data)
                setPdfDescription(data_show.description)
                setTemplatesID(data_show.template_id)
                setPoNumber(data_show.po_number)
                setNameInfo(data_show.name)
                setAddress(data_show.address)
                setCityInfo(data_show.city)
                setStateInfo(data_show.state)
                setZipCode(data_show.zipcode)
                
                setStartDate(data_show.start_date)
                setInternalBudget(data_show.budget==0?null:data_show.budget)
                setInternalNotes(data_show.internal_notes)
                setPricingMode(data_show.pricing_mode)
                setMarkup(data_show.markup_service==1?true:false)
                if(data_show.tasks_array != null){
                    setBillTasks(data_show.tasks_array)
                }
                
              }
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
          id: slugFromUrl
        }
        setLoading(true);
        const {isError, data} = await doPost(payload, 'get_asa_client_tasks');
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
          id: slugFromUrl
        }
        setLoading(true);
        const {isError, data} = await doPost(payload, 'get_asa_client_costs');
        if(isError) {
            toast.error('Something went wrong with server.');
            setLoading(false);
        }else{
            if (data.action == "success") {
              setLoading(false);
              console.log(data?.tasks)
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
                toast.error('Please enter Client');
                return;
            }
            if(clientcontact==null){
                toast.error('Please enter Contact Name.');
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
            if(cityinfo==null){
                toast.error('Please enter city.');
                return;
            }
            if(stateinfo==null){
                toast.error('Please enter state.');
                return;
            }
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
            // if(pricingmode==""){
            //     toast.error('Please select pricing mode.');
            //     return;
            // }
            if(urgencywork==0){
                toast.error('Please select work unrgency.');
                return;
            }
            if(billtasks.length == 0){
                toast.error('Please select atleast one or more task(s).');
                return;
            }
        }
        
        const payload = {
          token:getLoggedObject()?.token,
          asa_id:slugFromUrl,
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
          type:type,
          billtasks:billtasks,
          billcosts:billcosts
        }
        // console.log(payload)
        // return;
        setLoading(true);
        const {isError, data} = await doPost(payload, 'asa_send_client_actions');
        if(isError) {
            toast.error('Something went wrong with server.');
            setLoading(false);
        }else{
            if (data.action == "success") {
                setLoading(false);
                if(type==2){
                    // toast.success("Information drafted successfully!")
                } else if(type==3){
                    toast.success("ASA saved successfully!")
                    // navigate('/')
                    navigate('/view/pdf/'+slugFromUrl)
                } else {
                    navigate('/view/pdf/'+slugFromUrl)
                }
                
            }
            else {
                setLoading(false);
                toast.error(data.error);
            }
        }
    }


    const onDragEnd = async(result:any) => {
        if (!result.destination) return; // Dragged outside the droppable area
        const items = Array.from(alltasks);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        // console.log(items);
        setAllTasks(items);
        const payload = {
            token:getLoggedObject()?.token,
            task:items,
          }
        //   console.log(payload)
        //   return;
          const {isError, data} = await doPost(payload, 'update_position_of_data');
          if(isError) {
              toast.error('Something went wrong with server.');
          }else{
              if (data.action == "success") {
                  get_asa_tasks(slugFromUrl)
              }
              else {
                  toast.error(data.error);
              }
          }
    };

    const onDragEndCost = async (result:any) => {
        if (!result.destination) return; // Dragged outside the droppable area
        const items = Array.from(allcosts);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        console.log(items);
        setAllCosts(items);

        const payload = {
            token:getLoggedObject()?.token,
            task:items,
          }
        //   console.log(payload)
        //   return;
          const {isError, data} = await doPost(payload, 'update_position_of_costs');
          if(isError) {
              toast.error('Something went wrong with server.');
          }else{
              if (data.action == "success") {
                  get_asa_tasks(slugFromUrl)
              }
              else {
                  toast.error(data.error);
              }
          }
        
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
                get_asa_tasks(slugFromUrl)
            }
            else {
                toast.error(data.error);
            }
        }
    }

    const do_handle_plus = async (v: any) => {
        const total_price = v.price * v.task_time + parseFloat(v.markup_rate);
        const tax_count = (v.tax / 100) * total_price;
      
        const final_total = total_price + tax_count;
        console.log(final_total);
      
        return <span>{final_total}</span>; // Return a JSX element
      };
      

    const do_show_popup = async () => {
        setTemplatePopup(true)
    }

    const do_update_description = async () => {
        const templateWithIdFour = templatelist.filter((template: { id: number; }) => template.id === templatesid);
        {templateWithIdFour.map((v: any) => (
            // setPdfDescription(v.description.replace(/<[^>]*>/g, ''))
            setPdfDescription(v.description)
        ))}
        setTemplatePopup(false)
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
          <h2 className="mr-auto text-lg font-medium">Additional Service Estimate</h2>
        </div>

        <div className="mt-5  pl-2 ">
            <div className="font-bold text-2xl">
               {asa?.ASA_PRO_NUMBER}
            </div>
        </div>
        <div className="pb-3">
            <div className="my-5">
                <div className="grid grid-cols-12 gap-3 overflow-y-auto pt-0 mycustominput  p-2">
            <div className={"col-span-6 text-left"}>
                <label className={"pb-2 text-sm"}>Project Number  <span className="redclass">*</span></label>
                <FormInput 
                    type="text"
                    name="projectnumber"
                    value={projectnumber}
                    onChange={(e) => setProjectNumber(e.target.value)}
                    onKeyPress={(e) => {
                        const keyCode = e.keyCode || e.which;
                        const keyValue = String.fromCharCode(keyCode);
                        const regex = /^[0-9\b]+$/;
                        if (!regex.test(keyValue)) {
                            e.preventDefault();
                        }
                    }}
                    aria-label="default input inline 1"
                />
            </div>

            <div className={"col-span-6 text-left"}>
                <label className={"pb-2 text-sm"}>Project Name <span className="redclass">*</span></label>
                <FormInput type="text"
                            name={"projectname"}
                            defaultValue={projectname}
                            onChange={(e)=>setProjectName(e.target.value)}
                            aria-label="default input inline 1"/>
            </div>

            <div className={"col-span-6 text-left"}>
                <label className={"pb-2 text-sm"}>Client <span className="redclass">*</span></label>
                <FormInput type="text"
                            name={"client"}
                            defaultValue={client}
                            onChange={(e)=>setClient(e.target.value)}
                            aria-label="default input inline 1"/>
            </div>
            <div className={"col-span-6 text-left"}>
                <label className={"pb-2 text-sm"}>Contact Name <span className="redclass">*</span></label>
                <FormInput type="text"
                            name={"clientcontact"}
                            defaultValue={clientcontact}
                            onChange={(e)=>setClientContact(e.target.value)}
                            aria-label="default input inline 1"/>
            </div>
            
            <div className={"col-span-6 text-left"}>
                <label className={"pb-2 text-sm"}>Template </label>
                <TomSelect value={templatesid} 
                name={"templates_id"}
                onChange={(v) => {
                    // let selectedTemplate = templatelist.find((template) => template.id === v);
                    // console.log(selectedTemplate);
                    // if (selectedTemplate) {
                    //     setNameInfo(selectedTemplate?.name);
                    // }
                    setTemplatesID(v)
                    do_show_popup()
                }}
                options={{
                                placeholder: "Search Templates",
                                }} className="w-full">
                {templatelist.map((v:any, i:any) => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                ))}
                    
                </TomSelect>
            </div>

            <div className={"col-span-6 text-left"}>
                <label className={"pb-2 text-sm"}>Contact Email Address  <span className="redclass">*</span></label>
                <FormInput type="text"
                            name={"contactemails"}
                            defaultValue={contactemails}
                            onChange={(e)=>setContactEmails(e.target.value)}
                            aria-label="default input inline 1"/>
            </div>

            

            <div className={"col-span-6 text-left"}>
                <label className={"pb-2 text-sm"}>PO Number</label>
                <FormInput type="text"
                            name={"ponumber"}
                            defaultValue={ponumber}
                            onChange={(e)=>setPoNumber(e.target.value)}
                            aria-label="default input inline 1"/>
            </div>

            <div className={"col-span-6 text-left"}>
                <label className={"pb-2 text-sm"}>Project Category</label>
                <FormInput type="text"
                            name={"nameinfo"}
                            defaultValue={nameinfo}
                            onChange={(e)=>setNameInfo(e.target.value)}
                            aria-label="default input inline 1"/>
            </div>

            <div className={"col-span-6 text-left"}>
                <label className={"pb-2 text-sm"}>Client Project Number</label>
                <FormInput type="text"
                            name={"clientprojectnumber"}
                            defaultValue={clientprojectnumber}
                            onChange={(e)=>setClientprojectnumber(e.target.value)}
                            aria-label="default input inline 1"/>
            </div>

            <div className={"col-span-6 text-left"}>
                <label className={"pb-2 text-sm"}>Project Address <span className="redclass">*</span></label>
                <FormInput type="text"
                            name={"address"}
                            defaultValue={address}
                            onChange={(e)=>setAddress(e.target.value)}
                            aria-label="default input inline 1"/>
            </div>

            <div className={"col-span-4 text-left"}>
                <label className={"pb-2 text-sm"}>City <span className="redclass">*</span></label>
                <FormInput type="text"
                            name={"cityinfo"}
                            defaultValue={cityinfo}
                            onChange={(e)=>setCityInfo(e.target.value)}
                            aria-label="default input inline 1"/>
            </div>
            <div className={"col-span-4 text-left"}>
                <label className={"pb-2 text-sm"}>State <span className="redclass">*</span></label>
                <FormInput type="text"
                            name={"stateinfo"}
                            defaultValue={stateinfo}
                            onChange={(e)=>setStateInfo(e.target.value)}
                            aria-label="default input inline 1"/>
            </div>
            <div className={"col-span-4 text-left"}>
                <label className={"pb-2 text-sm"}>Zipcode</label>
                <FormInput type="text"
                            name={"zipcode"}
                            defaultValue={zipcode}
                            onChange={(e)=>setZipCode(e.target.value)}
                            aria-label="default input inline 1"/>
            </div>
            
            <div className={"col-span-12 text-left"}>
                <label className={"pb-2 text-sm"}>Description</label>
                        <ClassicEditor
                          value={pdfdescription}
                          onChange={ ( event ) => {
                            setPdfDescription(event)
                        } }
                          // onChange={setEditorData(event)}
                        />
                {/* <FormTextarea 
                            name={"pdfdescription"}
                            defaultValue={pdfdescription}
                            onChange={(e)=>setPdfDescription(e.target.value)}
                            aria-label="default input inline 1"/> */}
            </div>
            <div className={"col-span-6 text-left"}>
                <label className={"pb-2 text-sm"}>Date  <span className="redclass">*</span></label>
                <FormInput type="date"
                    name={"date_info"}
                    defaultValue={startdate}
                    min={current_date_to_manage}
                    onChange={(e) => {
                        const inputDate = new Date(e.target.value);
                        const future = new Date(inputDate);
                        future.setDate(future.getDate() + 90);
                        const futureDateString = future.toISOString().slice(0, 10);
                        setStartDate(e.target.value);
                        setFutruDate(futureDateString);
                    }}
                    
                      
                    // onChange={(e)=>
                    //     {
                    //         setStartDate(e.target.value)
                    //         const currentDate_ = e.target.value;
                    //         const futureDate = new Date(currentDate_.getTime() + 90 * 24 * 60 * 60 * 1000);
                    //         const [futrudate, setFutruDate] = useState<any | null>(futureDate.toISOString().split('T')[0])
                    //     }
                    // }
                    placeholder="Date"
                />
                
            </div>
            <div className={"col-span-6 text-left"}>
                <label className={"pb-2 text-sm"}>Valid To  <span className="redclass">*</span></label>
                <FormInput type="date"
                    name={"valid_Date"}
                    value={futrudate}
                    min={minimum_valid_date}
                    onChange={(e)=>
                    setFutruDate(e.target.value)
                    }
                    placeholder="Date"
                />
                
            </div>

            <div className={"col-span-12 text-left"}>
                <label className={"pb-2 text-sm"}>Budget</label>
                <FormInput type="number"
                    name={"internal_budget"}
                    defaultValue={internalbudget}
                    onChange={(e)=>
                    setInternalBudget(e.target.value)
                    }
                    placeholder=""
                />
                
            </div>
            <div className={"col-span-12 text-left"}>
                <label className={"pb-2 text-sm"}>Internal Notes</label>
                <FormTextarea
                            name={"internal_notes"}
                            defaultValue={internalnotes}
                            onChange={(e)=>setInternalNotes(e.target.value)}
                            aria-label="default input inline 1"/>
            </div>
            
            <div className={"col-span-4 text-left"}>
                <label className={"pb-2 text-sm"}>Pricing Mode</label>
                <FormSelect 
                value={pricingmode} 
                name={"pricing_mode"}
                onChange={(v) => {
                    setPricingMode(v.target.value)
                }}
                // options={{
                //                 placeholder: "Pricing Mode",
                //                 }} 
                className="w-full" >
                                <option value="0"></option>
                    <option value="1">Calculated Price</option>
                    <option value="2">Fixed Price</option>
                </FormSelect>
            </div>

            <div className={"col-span-4 text-left"}>
                <label className={"pb-2 text-sm"}>Urgency of work  <span className="redclass">*</span></label>
                <TomSelect 
                value={urgencywork} 
                name={"urgencywork"}
                onChange={(v) => {
                    setUrgencyWork(v)
                }}
                options={{
                                placeholder: "Urgency of work",
                                }} className="w-full" >
                    <option value="2">Standard</option>
                    <option value="1">Urgent</option>
                </TomSelect>
            </div>

            <div className={"col-span-4 text-left ml-10"}>
                <div className={"pb-2 text-sm"} style={{color:"#fff"}}>...</div>
                <div className="flex mt-2">
                    <FormCheck.Input
                        id={"markup"}
                        type="checkbox"
                        value={1}
                        name="markup"
                        //@ts-ignore
                        checked={markup}
                        onChange={(e)=>
                            setMarkup(!markup)
                        }
                    />
                    <FormCheck.Label htmlFor={"markup"}>
                        Mark Up Services
                    </FormCheck.Label>
                </div>
            </div>
            
        {/* TASKS DATA */}
        <div className="mt-5 col-span-12">
            <div className="task_heading mb-5">
                Tasks
            </div>

            <div className="flex  mb-5 align-center">
                <Button  className="mr-2shadow-md text-primary w-[120px]"
                        onClick={(event: React.MouseEvent)=> {
                            event.preventDefault();
                            save_client_data(2)
                            navigate("/new/task/0", { state: { asa_number: slugFromUrl } })
                        }}
                >
                    New Task
                </Button>

                <div 
                onClick={(event: React.MouseEvent)=> {
                    event.preventDefault();
                    save_client_data(2)
                    navigate("/multiple/tasks", { state: { asa_number: slugFromUrl } })
                }}
                className="blue_color ml-5">
                    + Add Multiple Tasks
                </div>
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
                                    <div className="w-[5%]">
                                        
                                    </div>
                                    <div className="w-[5%]">
                                        Bill
                                    </div>
                                    <div className="w-[30%]">
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
                                    <div
                                    className="w-[3%]">
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
                        <div className="w-[5%] mt-1 cursor_move">
                        <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1.75H15M1 7H15M1 12.25H15" stroke="#171717" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
            
                        </div>
                        <div className="w-[5%]">
                            <FormCheck.Input
                            className="flex-none border-slate-400 checked:border-primary"
                            type="checkbox"
                            checked={billtasks.includes(v.id as never)}
                            onChange={() => {do_update_tasks_checkbox(v.id)}}
                            />
                        </div>
                            <div className="w-[30%]">
                                
                                <span className={v.single_price == 0?"":"blue_color"} 
                                onClick={
                                    ()=> 
                                    {
                                        if(v.single_price == 0){} 
                                        else {
                                            save_client_data(2)
                                            navigate("/new/task/0", { state: { asa_number: slugFromUrl, specific_task: v.id, edit_mode: 1 } })
                                        }
                                    }
                                }
                                >{v.task_name}{(v.label!="" && v.label!= null)?" - "+v.label:""}</span>
                               
                                <div className="custom_pre">
                                    <pre>{v.task_description}</pre>
                                </div>
                            </div>
                        
                        <div className="w-[12%]">
                            <FormInput
                                name={"time"}
                                type="text"
                                className="w-[70%]"
                                placeholder="Time"
                                defaultValue={v.task_time}
                                disabled={pricingmode==2 || pricingmode == 0}
                                // maxLength={5}
                                onChange={(e)=>
                                    {
                                        const valuee = e.target.value || 1;
                                        HandleTaskUpdate(valuee, 'task_time', id)
                                    }
                                }
                            />
                        </div>
                        
                        <div className="w-[12%]">
                            <FormInput
                                name={"time"}
                                type="text"
                                className="w-[70%]"
                                placeholder="Time"
                                defaultValue={v.price}
                                disabled={pricingmode==2 || pricingmode == 0}
                                onChange={(e)=>
                                    
                                    {
                                        const valuee = e.target.value || 0;
                                        HandleTaskUpdate(valuee, 'price', id)
                                    }
                                }
                            />
                        </div>
                        <div className="w-[12%]">
                            <FormInput
                                name={"cost"}
                                type="text"
                                className="w-[70%]"
                                placeholder="cost"
                                defaultValue={v.cost}
                                disabled={pricingmode==2 || pricingmode == 0}
                                onChange={(e)=>
                                    {
                                        const valuee = e.target.value || 0;
                                        HandleTaskUpdate(valuee, 'cost', id)
                                    }
                                }
                            />
                        </div>
                        <div className="w-[12%]">
                        <FormInput
                                name={"price"}
                                type="text"
                                className="w-[70%]"
                                placeholder="price"
                                defaultValue={v.price}
                                disabled
                            />
                        </div>
                        <div className="w-[12%]">
                            
                            {
                                pricingmode == 1 ?
                                <>
                                    <div className="custom_center">
                                    {
                                        (() => {
                                            const old_price = v.price;
                                            const taxRate = (v.tax/100); // Assuming tax rate of 10%
                                            if(v.single_price == 0){
                                                var single_price____:any = (v.price);
                                            } else {
                                                if(old_price != v.price){
                                                    console.log("in price");
                                                    var single_price____:any = (v.price / v.task_time);
                                                } else {
                                                    var single_price____:any = (v.single_price);
                                                }
                                            }

                                            const single_price__ = single_price____;
                                            
                                            // const totalPrice = (v.single_price * v.task_time) + parseFloat(v.markup_rate);
                                            const sub_total = (single_price__ * v.task_time);

                                            if(v.markup_type == 1){
                                                var markup_tax = (v.markup_rate/100);
                                                var markup_add:any = sub_total * markup_tax;
                                            } else if(v.markup_type == 2){
                                                var markup_add:any = (v.markup_rate);
                                            } else {
                                                var markup_add:any = 0;
                                            }
                                            const totalPrice =  (sub_total+ parseFloat(markup_add));
                                            const tax = totalPrice * taxRate;
                                            const totalWithTax = totalPrice + tax;
                                            return totalWithTax.toFixed(2);
                                        })()
                                    }
                                    {/* {
                                        (() => {
                                            const taxRate = (v.tax/100); // Assuming tax rate of 10%
                                            const totalPrice = (v.single_price * v.task_time) + parseFloat(v.markup_rate);
                                            const tax = totalPrice * taxRate;
                                            const totalWithTax = totalPrice + tax;
                                            return totalWithTax;
                                        })()
                                    } */}
                                        {/* {
                                            (
                                            
                                                (v.price * v.task_time) + parseFloat(v.markup_rate)
                                            )
                                        } */}
                                    </div>
                                </>
                                :
                                <>
                                <FormInput
                                    name={"total"}
                                    type="text"
                                    className="w-[85%]"
                                    placeholder="total"
                                    defaultValue={v.total}
                                    disabled={pricingmode==1 || pricingmode==0}
                                    onChange={(e)=>HandleTaskUpdate(e.target.value, 'total', id)}
                                />
                                </>
                            }
                        </div>
                        <div className="w-[3%]">
                            {
                                v.deleteable == 1 &&
                                <div className="custom_center">
                                    <Lucide
                                    onClick={()=>do_delete_popup(v.id)}
                                    icon="Trash2" className="w-4 h-4 inline-block" color="red" />
                                </div>
                            }
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

            <div className="flex  mb-5 align-center">
                <Button  className="mr-2shadow-md text-primary w-[120px]"
                        onClick={(event: React.MouseEvent)=> {
                            event.preventDefault();
                            save_client_data(2)
                            navigate("/new/cost/0", { state: { asa_number: slugFromUrl } })
                        }}
                >
                    New Cost
                </Button>

                <div 
                onClick={(event: React.MouseEvent)=> {
                    event.preventDefault();
                    save_client_data(2)
                    navigate("/multiple/cost", { state: { asa_number: slugFromUrl } })
                }}
                className="blue_color ml-5">
                    + Add Multiple Costs
                </div>
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
                                    <div className="w-[5%]">
                                        
                                    </div>
                                    <div className="w-[5%]">
                                        Bill
                                    </div>
                                    <div className="w-[32%]">
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
                                    <div
                                    className="w-[3%]">
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
                        <div className="w-[5%] mt-1 cursor_move">
                        <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1.75H15M1 7H15M1 12.25H15" stroke="#171717" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
            
                        </div>
                        <div className="w-[5%]">
                            <FormCheck.Input
                            className="flex-none border-slate-400 checked:border-primary"
                            type="checkbox"
                            checked={billtasks.includes(v.id as never)}
                            onChange={() => {do_update_tasks_checkbox(v.id)}}
                            />
                        </div>
                            <div className="w-[32%]">
                                
                                <span className={v.single_price == 0?"":"blue_color"} 
                                onClick={
                                    ()=> 
                                    {
                                        if(v.single_price == 0){} 
                                        else {
                                            save_client_data(2)
                                            navigate("/new/cost/0", { state: { asa_number: slugFromUrl, specific_task: v.id, edit_mode: 1 } })
                                        }
                                    }
                                }
                                >{v.task_name}{(v.label!="" && v.label!= null)?" - "+v.label:""}</span>
                               
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
                            {/* {v.total} */}
                           
                            {
                                (
                                    (v.single_price * v.task_time) + parseFloat(v.cost)
                                ).toFixed(2)
                            }

                        </div>
                        <div className="w-[3%]">
                            {
                                v.deleteable == 1 &&
                                <Lucide
                                onClick={()=>do_delete_cost_popup(v.id)}
                                icon="Trash2" className="w-4 h-4 inline-block" color="red" />
                            }
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
        

       
       


        <div className={"col-span-12 text-right mt-10"}>
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
                        navigate("/")
                    }}
                    className="w-20 float-left   w-[120px] text-primary"
                    >
                    Cancel
                </Button>
                
            </div>
        </div>



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
        

        {/* DESCRIPTION POPUP OF TEMPLATE */}

        <Dialog
            open={templatepopup}
            onClose={() => {
            setTemplatePopup(false);
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
                        You want to change the description of service?
                    </div>
                </div>
                <div className="px-5 pb-8 text-center">
                    <Button
                    // variant="outline-secondary"
                    type="button"
                    onClick={() => {
                        setTemplatePopup(false);
                    }}
                    className="w-24 mr-1"
                    >
                    No
                    </Button>
                    <Button
                    variant="danger"
                    type="button"
                    className="w-24"
                    ref={deleteButtonRef}
                    onClick={()=>do_update_description()}
                    >
                    Yes
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
  