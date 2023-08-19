import React, { useEffect, useState, useRef, createRef } from "react";
import {Link, useNavigate} from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from "../../hooks/useAuth";
import { doPost } from "../../utils/apiCalls";
import { validateEmail, getStatusEnums, getUrgencyEnums, getStatusQuote, getStatusActive, getStatusEnumsQuote } from "../../utils/functions";
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


interface Response {
  name?: string;
  category?: string;
  images?: string[];
  status?: string;
}

function ASAREQUESTS() {
    
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
    const [requestdate, setRequestDate] = useState<any | null>(new Date().toISOString().slice(0,-8));
    // const [requestdate, setRequestDate] = useState<any | null>(new Date().toLocaleString([], {timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone}).slice(0, -8));
    
    const [fullname, setFullName] = useState(user_default_id)
    const [disablefullname, setDisableFullName] = useState(true)
    const [email, setEmail] = useState(getLoggedObject()?.email)
    const [disableemail, setDisableEmail] = useState(true)
    const [projectnumber, setProjectNumber] = useState<any | null>(null)
    const [projectname, setProjectName] = useState<any | null>(null)
    const [clientprojectnumber, setClientprojectnumber] = useState<any | null>(null)
    const [client, setClient] = useState<any | null>(null)
    const [clientcontact, setClientContact] = useState<any | null>(null)
    const [contactemails, setContactEmails] = useState<any | null>([])
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
    const [condition, setCondition] = useState<any | null>([3,6])

    const [statusupdate, setStatusUpdate] = useState<any | null>(false);
    const [codeset, setCodeset] = useState<any | null>(0);
    const [datastaus, setDataStaus] = useState<any | null>([]);
    const [codetext, setCodeText] = useState<any | null>(null);
    const current_date_to_manage  = new Date().toISOString().split('T')[0];
    const [archivereason, setArchiveReason] = useState<any | null>(null);

    const [singlearchive, setSingleArchive] = useState<any | null>(false);
    const [singlearchiveid, setSingleArchiveID] = useState<any | null>(0);

    const [quotefilter, setQuoteFilter] = useState<any | null>([1,2]);
    const [quotefilterasa, setQuoteFilterAsa] = useState<any | null>(true);

    
    useEffect(() => {
      get_standard_services();
    }, []);

    const get_standard_services = async () => {
      const payload = {
        token:getLoggedObject()?.token,
      }
      setLoading(true);
      const {isError, data} = await doPost(payload, 'get_all_quotes');
      if(isError) {
          toast.error('Something went wrong with server.');
          setLoading(false);
      }else{
          if (data.action == "success") {
            setLoading(false);
            setAsa(data?.quote_data);
          }
          else {
              setLoading(false);
              toast.error(data.error);
          }
      }
    }

    function handleViewInformation(request: any) {
        setSelectedRequest(request)
        setInfoModal(true)
    }

    const get_specific_user_records = async (id:any) =>{
      if(loading) return;
      const payload = {
        token:getLoggedObject()?.token,
        id:id,
      }
      setLoading(true);
      const {isError, data} = await doPost(payload, 'get_specific_user');
      if(isError) {
          toast.error('Something went wrong with server.');
          setLoading(false);
      }else{
          if (data.action == "success") {
            setLoading(false);
            setEditID(id);
            // setUserData(data?.data);
            setFirstname(data?.data.fname);
            setLastname(data?.data.lname);
            setEmail(data?.data.email);

            setAddDepartmentModal(true);
          }
          else {
              setLoading(false);
              toast.error(data.error);
          }
      }
    }

    const delete_user_data = async (id:any) =>{
      setDelID(id);
      setDeleteConfirmationModal(true);
    }


    const resetStates = async () => {
        setRequestDate(new Date().toISOString().slice(0,-8));
        setFullName(user_default_id);
        setEmail(getLoggedObject()?.email);
        setProjectNumber(null)
        setProjectName(null)
        setClientprojectnumber(null)
        setClient(null)
        setClientContact(null)
        setContactEmails(null)
        setServiceDescription(null)
        setStandardService([])
        setUrgencyWork(0)
        setItems([])
        setCompletionDate(null)
        setCompdiscipline(null)
        setNotifyengineers([])
        setBranches([])
        setEditID(null)
    };
    //SAVE DEPARTMENT
    const save_asa = async () =>{
      if(loading) return;
      if(requestdate==null){
          toast.error('Please enter ASA Request Date.');
          return;
      }

      if(fullname==null){
          toast.error('Please enter Full Name.');
          return;
      }
      if(email==null){
          toast.error('Please enter your email address.');
          return;
      }
      if(!validateEmail(email)){
          toast.error('Please provide a valid email address');
          return false;
      }
      if(projectnumber == null){
        toast.error('Please enter project Number.');
        return;
      }
      if(projectname == null){
        toast.error('Please enter project Name.');
        return;
      }
      if(clientprojectnumber == null){
        toast.error('Please enter client project Number.');
        return;
      }
      if(client == null){
        toast.error('Please enter Client.');
        return;
      }
      if(clientcontact == null){
        toast.error('Please enter client contact.');
        return;
      }
      if(contactemails == null){
        toast.error('Please enter contact emails.');
        return;
      }
      if(servicedescription == null){
        toast.error('Please enter Service description.');
        return;
      }
      if(standardService.length == 0){
        toast.error('Please select standard services.');
        return;
      }
      if(urgencywork == 0){
        toast.error('Please select urgency work.');
        return;
      }
      if(items.length == 0){
        toast.error('Please select atleast one discipline.');
        return;
      }
      if(completiondate == null){
        toast.error('Please enter completion date.');
        return;
      }
      if(compdiscipline == null){
        toast.error('Please select Completed Discipline.');
        return;
      }

      if(compdiscipline != 3){
        if(notifyengineers.length == 0){
          toast.error('Please select Notify Engineering PM.');
          return;
        }
      }
     
      const payload = {
        token:getLoggedObject()?.token,
        requestdate:requestdate,
        fullname:fullname,
        // email:email,
        projectnumber:projectnumber,
        projectname:projectname,
        clientprojectnumber:clientprojectnumber,
        client:client,
        clientcontact:clientcontact,
        contactemails:contactemails,
        servicedescription:servicedescription,
        standardService:standardService,
        urgencywork:urgencywork,
        disciplinehour:disciplinehour,
        disciplintasks:disciplintasks,
        completiondate:completiondate,
        compdiscipline:compdiscipline,
        notifyengineers:notifyengineers,
        additionalpm:additionalpm,
        items:items,
        branches:branches,
        editid:editid
      }
        //   console.log(payload)
        //   return;
      setLoading(true);
      const {isError, data} = await doPost(payload, editid==null?'add_new_asa':'update_asa');
      if(isError) {
          toast.error('Something went wrong with server.');
          setLoading(false);
      }else{
          if (data.action == "success") {
            setLoading(false);
            setAddDepartmentModal(false)
            setEditID(null);
            toast.success(editid==null?"New ASA Request added successfully!":"ASA Request updated successfully!");
            window.location.reload();
            // get_standard_services();
          }
          else {
              setLoading(false);
              toast.error(data.error);
          }
      }
    }
    const archive_requests = async () =>{
      // console.log(delid)
      const payload = {
        token:getLoggedObject()?.token,
        ids: archived,
        reason: archivereason==null?null:archivereason
      }
      setLoading(true);
      const {isError, data} = await doPost(payload, 'archive_specific_asa');
      setLoading(false);
      if(isError) {
          toast.error('Something went wrong with server.');
          setLoading(false);
      }else{
          if (data.action == "success") {
            setDeleteConfirmationModal(false)
            setLoading(false);
            get_standard_services();
            toast.success("Request(s) status updated successfully!")
          }
          else {
              setLoading(false);
              toast.error(data.error);
          }
      }
    }

    function HandleSearch(values: any) {
        let q = values;
        // console.log(asa);
        if (asa) {
            if (q){
                // @ts-ignore
                let results = asa.filter((item) => {
                    const projectNameMatch = item.projectname !== null && item.projectname.toLowerCase().includes(q.toLowerCase());
                    const projectNoMatch = item.quote_number !== null && item.quote_number.includes(q);
                    const projectNo = item.projectnumber !== null && item.projectnumber.includes(q);
                    // const projectUrgency = item.urgency_text !== null && item.urgency_text.toLowerCase().includes(q.toLowerCase());
                    // const projectStatus = item.status_text !== null && item.status_text.toLowerCase().includes(q.toLowerCase());
                    // return projectNameMatch || projectNoMatch || projectUrgency || projectStatus;÷
                    return projectNameMatch || projectNoMatch || projectNo;
                })
                setFiltered(results)
            }else{
                setFiltered(null)
            }
        }
    }


    const do_update_change = async (id:any) => {
      if(items.includes(id as never)){
        var people = items;
        var toRemove = id;
        var index = people.indexOf(toRemove as never);
        if (index > -1) { 
          people.splice(index, 1);
        }
        setItems([...people]);
      } else {
        var people = items;
        people.push(id as never);
        setItems([...people]);
      }
    }

    const do_update_select_archive = async (id:any) => {
        if(archived.includes(id as never)){
          var people = archived;
          var toRemove = id;
          var index = people.indexOf(toRemove as never);
          if (index > -1) { 
            people.splice(index, 1);
          }
          setArchived([...people]);
        } else {
          var people = archived;
          people.push(id as never);
          setArchived([...people]);
        }

        if(archived.length > 0){
            setArchiveButton(true)
        } else {
            setArchiveButton(false)
        }
    }
    

    const handleInputChange = (e:any, id:string, title_d:string) => {
      const newBranches = [...branches];
      const branchIndex = newBranches.findIndex(branch => branch.id === id);
      if (branchIndex < 0) {
        // create a new object with the updated value
        const newBranch = { id, [title_d]: e.target.value };
        newBranches.push(newBranch);
      } else {
        // get a reference to the object at the specified id and update its value
        const branchToUpdate = newBranches[branchIndex];
        branchToUpdate[title_d] = e.target.value;
      }
      setBranches(newBranches);
    //   console.log(newBranches);
    };

    const handleReviseASA = (val:any) => {
        // console.log(val);
        // const emails_split = val?.asa_email;
        // const new_val = emails_split.split(',');
        // console.log(new_val)
        setEditID(val.id);
        setRequestDate(val.asa_request_date)
        setProjectName(val.asa_project_name)
        setProjectNumber(val.asa_project_no)
        setClientprojectnumber(val.client_project_number)
        setClient(val.asa_company_name)
        setClientContact(val.company_contact)
        setContactEmails(val?.asa_email)
        setServiceDescription(val.service_description)
        setUrgencyWork(val.urgency)
        setItems(val.items)
        setStandardService(val.standard_service_id)
        const newBranches = val.discipline_data;
        setBranches(val?.discipline_data)
        setCompletionDate(val?.request_due_date)
        setCompdiscipline(val?.completed_discipline)
        setNotifyengineers(val?.additional_pm_ar)
        setAddDepartmentModal(true);
    }

    const handleArchiveASA = async (ros: any) =>{
        // console.log(delid)
        const payload = {
          token:getLoggedObject()?.token,
          // ids: ros.id
          ids: ros,
          reason:archivereason
        }
        // console.log(payload)
        // return;
        setLoading(true);
        const {isError, data} = await doPost(payload, 'archive_single_specific_asa');
        setLoading(false);
        if(isError) {
            toast.error('Something went wrong with server.');
            setLoading(false);
        }else{
            if (data.action == "success") {
              setDeleteConfirmationModal(false)
              setLoading(false);
              setSingleArchive(false)
              setSingleArchiveID(0)
              get_standard_services();
              toast.success("Request(s) status updated successfully!")
            }
            else {
                setLoading(false);
                toast.error(data.error);
            }
        }
    }

    const do_action_update = async (ros: any, code: any, textcode: any) => {
        setCodeset(code)
        setDataStaus(ros);
        setCodeText(textcode)
        setStatusUpdate(true);
    }
        
    const handleStatusUpdate = async () =>{
        const payload = {
          token:getLoggedObject()?.token,
          ids: datastaus.id,
          code: codeset,
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
              setStatusUpdate(false)
              setCodeset(0)
              setDataStaus([]);
              setCodeText(null)
              setLoading(false);
              get_standard_services();
              toast.success("Request(s) status updated successfully!")
            }
            else {
                setLoading(false);
                toast.error(data.error);
            }
        }
    }

    

    const handleSendToClient = async (ros: any) => {
        if(ros.completed_discipline != 3){
            if(ros.completed_discipline==1){
                const sta_ = "Waiting for E to complete ASA";
                toast.error(sta_);
                return;
            }
            if(ros.completed_discipline==2){
                const sta_ = "Waiting for MP to complete ASA";
                toast.error(sta_);
                return;
            }
            if(ros.completed_discipline==4){
                const sta_ = "ASA already approved.";
                toast.error(sta_);
                return;
            }
            if(ros.completed_discipline==5){
                const sta_ = "Declined ASA can't be sent!";
                toast.error(sta_);
                return;
            }
            if(ros.completed_discipline==6){
                const sta_ = "ASA already sent to client!";
                toast.error(sta_);
                return;
            }
        } else {
            navigate('send/client/'+ros.ASA_PRO_NUMBER)
        }
    }

    const handleDateChange = (e:any) => {
        const selectedDate = e.target.value;
        const currentDate = new Date().toISOString().slice(0, 16);
        if (selectedDate < currentDate) {
          toast.error('ASA Request Date is older than the current date');
          setRequestDate(new Date().toISOString().slice(0,-8));
          return;
        }
        setRequestDate(selectedDate);
    };

    
    const columns = [
      // {
      //     name: '#',
      //     width:"60px",
      //     sortable: true,
      //     selector: (row: { id: any; }) => parseInt(row.id),
      //     format: (row: { id: any; }) => parseInt(row.id),
      //     cell: (row: any,) => (
      //       <FormCheck className="custom_checkbox">
      //           <FormCheck.Input
      //               id={row.id}
      //               type="checkbox"
      //               value={row.id}
      //               name="selectunselect"
      //               //@ts-ignore
      //               checked={archived.includes(row.id as never)}
      //               onChange={(e)=>
      //                   do_update_select_archive(row.id)
      //               }
      //           />
      //       </FormCheck>
      //   ),
       
      // },
      {
        name: 'Quote No.',
        width:"120px",
        allowOverflow: true,
        selector: (row: { quote_number: string; }) => row.quote_number,
        sortable: true,
        cell: (row: any) => (
          // @ts-ignore
          <span className="blurColor" style={{cursor:"pointer"}} onClick={() => {
            navigate("/quote/information/" + row.quote_number, { state: { proposal: row.type == 1 ? 1 : 0 } });
        }}>
              {row.quote_number+((row?.revision_number!=null && row?.revision_number!=0)?"."+row?.revision_number:"")}
          </span>
      )
    },
      {
          name: 'Project #',
          width:"120px",
          allowOverflow: true,
          selector: (row: { projectnumber: string; }) => row.projectnumber,
          sortable: true,
          cell: (row: any) => (
            // @ts-ignore
            <span>
                {row.projectnumber}
            </span>
        )
      },
      {
        name: 'Name',
        allowOverflow: true,
        minWidth: "35%",
        selector: (row: { projectname: string; }) => row.projectname,
        sortable: true,
    },
      {
          name: 'Request Date',
          allowOverflow: true,
          selector: (row: { created_at: any; }) => row.created_at,
          sortable: true,
          // format: (row: { email: any; }) => new Date(row.email).toLocaleDateString(),
      },
      {
          name: 'Urgency',
          selector: (row: { asa_urgency_work: any; }) => row.asa_urgency_work,
          sortable: true,
          cell: (row: any) => (
            <span className={getUrgencyEnums(row.asa_urgency_work).color}>
                {getUrgencyEnums(row.asa_urgency_work).title}
            </span>
          )
      },
      {
          name: 'Status',
          selector: (row: { completed_discipline: any; }) => row.completed_discipline,
          sortable: true,
          cell: (row: any) => (
            <>
            {
              row.type == 1 ?
                <span style={{color: getStatusQuote(row.completed_discipline).color}}>
                    {getStatusQuote(row.completed_discipline).title}
                </span>
              :
                <span style={{color: getStatusEnumsQuote(row.completed_discipline).color}}>
                    {getStatusEnumsQuote(row.completed_discipline).title}
                </span>
            }
            </>
          )
      },
      {
          name: 'Actions',
          width:"80px",
          cell: (row: any,) => (
            <>
              <div className="flex items-center justify-center w-100">
                  <Menu>
                    
                      <Menu.Button
                          as={"div"}
                         >
                          <Lucide icon="Plus" className="w-4 h-4 mr-1"/>{" "}
                      </Menu.Button>
                      
                      <Menu.Items className="w-40">
                          <Menu.Item onClick={() => {
                              navigate("/quote/information/" + row.quote_number, { state: { proposal: row.type == 1 ? 1 : 0 } });
                          }}>Information</Menu.Item>
                        
                        {
                            ((row.completed_discipline != 6 || row.type != 2) && row.completed_discipline != 5 && row.completed_discipline != 4) &&
                          <Menu.Item onClick={() => {
                              // handleReviseASA(row)
                              navigate("/new/quote/" + row.quote_number, { state: { proposal: row.type == 1 ? 1 : 2 } });
                            } }>Revise</Menu.Item>
                          }
                            
                            {
                            (row.completed_discipline == 6) &&
                          <>
                            <Menu.Item
                            onClick={() => {
                                navigate('/quote/pdf/'+row.quote_number)
                            }}
                            >View PDF </Menu.Item>
                            </>
                        }
                      
                      {
                            (row.completed_discipline != 6 && row.completed_discipline != 5 && row.completed_discipline != 4  && row.completed_discipline != 1) &&
                          <>
                            <Menu.Item
                                onClick={() => {
                                    // handleSendToClient(row)
                                    do_action_update(row, 6, "Sent to client")
                                }}
                            >Send to client</Menu.Item>
                            </>
      }
                              
                            
                            {
                              row.type==2 &&
                           
                              <Menu.Item
                                  onClick={() => {
                                      do_action_update(row, 7, "ASA declined, proceed with work")                                    
                                  }}
                              >ASA declined, proceed with work</Menu.Item>
                            }

{
                             (row.completed_discipline != 5) &&
                            <>
                            <Menu.Item
                                onClick={() => {
                                    do_action_update(row, 4, "Approve")
                                    // handleApproveASA(row)
                                }}
                            >
                                Approve</Menu.Item>
                            <Menu.Item
                                onClick={() => {
                                    // handleDeclineASA(row)
                                    do_action_update(row, 5, "Decline")
                                }}
                            >Decline</Menu.Item>
                            </>
      }
                       
                          {/* <Menu.Item
                              onClick={() => {
                                  setSingleArchive(true)
                                  setSingleArchiveID(row.id)
                                  // handleArchiveASA(row)
                              }}
                          >Archive ASA</Menu.Item> */}
                      </Menu.Items>
                         
                  </Menu>
              </div>
              </>
          ),
      },
    ];

    const generateRandomNumber = () => {
      const min = 10000; // Minimum 6-digit number
      const max = 99999; // Maximum 6-digit number
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      return randomNumber
  }
    const do_create_new_quote = async(val:any) => {
      
      const type_val = val==1?"P":"A";
      var currentYear = new Date().getFullYear();
      // var lastDigit = (currentYear % 100)+"00";
      var lastDigit = "0000";
       if(val == 1){
          var number_format = "P"+lastDigit;
      } else {
          var number_format = "A"+lastDigit;
      }
      const quote_nnn = number_format;
      // console.log(quote_nnn);
      // return;
      // navigate("/new/quote/"+quote_nnn, { state: { proposal: val } })
      // return;
      // const type_val = val==1?"P":"A";
      // const quote_nnn = type_val+generateRandomNumber();
      const payload = {
        token:getLoggedObject()?.token,
        quote_number: quote_nnn,
        type: val==1?1:2,
        update_status:1,
      }
      // console.log(payload);
      // return;
      setLoading(true);
      const {isError, data} = await doPost(payload, 'quote_client_number_generator');
      setLoading(false);
      if(isError) {
          toast.error('Something went wrong with server.');
          setLoading(false);
      }else{
          if (data.action == "success") {
            setLoading(false);
            const data_retunr = data?.data.toString();
            // console.log(data_retunr)
            // console.log(data_retunr.length)
            const return_length = data_retunr.length;
            let newval : string;
            newval = "0000";
            if(return_length == 1){
              newval = "0000";
            } else if(return_length == 2){
              newval = "000";
            }
            else if(return_length == 3){
              newval = "00";
            }
            else if(return_length == 4){
              newval = "0";
            } else if(return_length == 5){
              newval = "";
            }

            const final_val =  newval;
            const new_quote_num = type_val+final_val+data?.data
            navigate("/new/quote/"+new_quote_num, { state: { proposal: val, version:0 } })
          }
          else {
              setLoading(false);
              toast.error(data.error);
          }
      }
    }
    
    return (
      <>
        <div className="flex flex-col items-center mt-8 intro-y sm:flex-row">
          <h2 className="mr-auto text-lg font-medium">Quotes</h2>
            {/* <div className="">
                {
                  !quotefilter.includes(1) ?
                      <Button className="shadow-md"
                              onClick={(event: React.MouseEvent)=> {
                                //handle_filter_q(1)
                              }}
                      >
                        Proposals
                      </Button>
                      :
                      <Button variant="primary" className=" shadow-md"
                              onClick={(event: React.MouseEvent)=> {
                               // handle_filter_q(1)
                              }}
                      >
                        Proposals
                      </Button>
                  }
                    

                {
                  !quotefilter.includes(2)?
               
                      <Button className=" shadow-md"
                              onClick={(event: React.MouseEvent)=> {
                               // handle_filter_quote(2)
                              }}
                      >
                        Added Service Estimate
                      </Button>
                      :
                      <Button variant="primary" className=" shadow-md"
                              onClick={(event: React.MouseEvent)=> {
                                //handle_filter_quote(2)
                              }}
                      >
                        Added Service Estimate
                      </Button>
                  }
            </div> */}
        </div>

        <div className="flex flex-wrap justify-between items-center col-span-12 mt-2 intro-y sm:flex-nowrap mt-6">
                  <div className="">
                    <Button variant="primary" className="mr-2 shadow-md"
                            onClick={(event: React.MouseEvent)=> {
                              do_create_new_quote(1)
                              // navigate("/new/quote", { state: { proposal: 1 } })
                            }}
                    >
                      New Proposal
                    </Button>
                    <Button className="mr-2 shadow-md"
                            onClick={(event: React.MouseEvent)=> {
                              do_create_new_quote(2)
                              // navigate("/new/quote", { state: { proposal: 0 } })
                            }}
                    >
                      New ASA Estimate
                    </Button>
                  </div>
                    <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
                        <div className="relative w-[250px] text-slate-500">
                        
                            <FormInput
                                name={"search"}
                                type="text"
                                className="w-[250px] pr-10 !box"
                                placeholder="Search..."
                                defaultValue={searchtext || undefined}
                                onChange={(e)=>HandleSearch(e.target.value)}
                            />
                            <Lucide
                                icon="Search"
                                className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
                            />
                        </div>
                    </div>
        </div>
        {/* BEGIN: HTML Table Data */}


        <div className="mt-5 intro-y box overflow-auto lg:overflow-visible">
              {asa &&
                <DataTable
                    //@ts-ignore
                    columns={columns}
                    data={filtered ? filtered : asa}
                    className={"must-overflow-y"}
                    pagination={true}
                    paginationComponentOptions={{
                        selectAllRowsItem: true
                    }}
                />
              }
        </div>
        {/* END: HTML Table Data */}
              
        <Dialog
            open={statusupdate}
            onClose={() => {
            setStatusUpdate(false);
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
                    Do you want update status to <b className="text-danger">{codetext}</b>? 
                    </div>
                </div>
                <div className="px-5 pb-8 text-center">
                    <Button
                    // variant="outline-secondary"
                    type="button"
                    onClick={() => {
                        setStatusUpdate(false);
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
                    onClick={()=>handleStatusUpdate()}
                    >
                    Update
                    </Button>
                </div>
            </Dialog.Panel>
        </Dialog>

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
                    Do you want to archive ASA Request(s)? 
                    </div>
                </div>


                <div className="px-5 pb-5">
                  <label className={"pb-2 text-sm"} style={{color:"red"}}>Please note a reason of archiving</label>
                <FormInput 
                                        type="text"
                                        name="archivereason"
                                        value={archivereason}
                                        onChange={(e) => setArchiveReason(e.target.value)}
                                  
                                        aria-label="default input inline 1"
                                    />
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
                    onClick={()=>archive_requests()}
                    >
                    Archive
                    </Button>
                </div>
            </Dialog.Panel>
        </Dialog>

        <Dialog
            open={singlearchive}
            onClose={() => {
            setSingleArchive(false);
            }}
            initialFocus={deleteButtonRef}
        >
            <Dialog.Panel>
                <div className="p-5 text-center">
                </div>


                <div className="px-5 pb-5">
                  <label className={"pb-2 text-sm"} style={{color:"red"}}>Please note a reason of archiving</label>
                <FormInput 
                                        type="text"
                                        name="archivereason"
                                        value={archivereason}
                                        onChange={(e) => setArchiveReason(e.target.value)}
                                  
                                        aria-label="default input inline 1"
                                    />
                </div>
                <div className="px-5 pb-8 text-center">
                    <Button
                    // variant="outline-secondary"
                    type="button"
                    onClick={() => {
                        setSingleArchive(false);
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
                    onClick={()=>handleArchiveASA(singlearchiveid)}
                    >
                    Archive
                    </Button>
                </div>
            </Dialog.Panel>
        </Dialog>
        
      {/* END: Delete Confirmation Modal */}

      {/* ADD NEW DEPARTMENT DIAGLOG */}
        <Dialog staticBackdrop  open={adddepertmentmodal} 
            onClose={()=> {
                setAddDepartmentModal(false);
            }}
            initialFocus={sendButtonRef}
            size={"xl"}
            >
            <Dialog.Panel>
                <Dialog.Title>
                    <h2 className="mr-auto text-base font-medium">
                        {editid!=null?"Update ASA":"Create new ASA"}
                    </h2>
                </Dialog.Title>
                <Dialog.Description className="grid gap-4 gap-y-3">
                    <div className="pb-3">
                        <div className="my-5">
                            <div className="grid grid-cols-12 gap-3 overflow-y-auto p-3 pt-0 mycustomlabel">
                                <div className={"col-span-6 text-left"}>
                                    <label className={"pb-2 text-sm"}>ASA Request Date</label>
                                    <FormInput type="datetime-local"
                                        name={"asa_request_date"}
                                        defaultValue={requestdate}
                                        // min= "2023-05-21T00:00"
                                        min={new Date().toISOString().slice(0, 16)}
                                        // onChange={(e)=>handleDateChange(e)}
                                        onChange={(e)=>
                                            setRequestDate(e.target.value)
                                        }
                                    />
                                </div>
                                <div className={"col-span-6 text-left"}>
                                    <label className={"pb-2 text-sm"}>Full Name</label>
                                     <TomSelect 
                                          value={fullname} 
                                          name={"fullname"} 
                                          onChange={(v) => setFullName(v)} 
                                          options={{placeholder: "Name & Email"}} 
                                          className="w-full"
                                        >
                                          {/* <option value="0">Select Email</option> */}
                                          {userlist.map((v:any, i:any) => (
                                            <option value={v.id}>{v.fname} {v.lname} ({v.email})</option>
                                          ))}
                                        </TomSelect>
                                </div>
                                <div className={"col-span-6 text-left"}>
                                    <label className={"pb-2 text-sm"}>Project Number</label>
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
                                    <label className={"pb-2 text-sm"}>Project Name</label>
                                    <FormInput type="text"
                                                name={"projectname"}
                                                defaultValue={projectname}
                                                onChange={(e)=>setProjectName(e.target.value)}
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
                                    <label className={"pb-2 text-sm"}>Client</label>
                                    <FormInput type="text"
                                                name={"client"}
                                                defaultValue={client}
                                                onChange={(e)=>setClient(e.target.value)}
                                                aria-label="default input inline 1"/>
                                </div>
                                <div className={"col-span-6 text-left"}>
                                    <label className={"pb-2 text-sm"}>Contact</label>
                                    <FormInput type="text"
                                                name={"clientcontact"}
                                                defaultValue={clientcontact}
                                                onChange={(e)=>setClientContact(e.target.value)}
                                                aria-label="default input inline 1"/>
                                </div>

                                <div className={"col-span-6 text-left"}>
                                    <label className={"pb-2 text-sm"}>Contact Email Address</label>
                                    {/* <TomSelect value={contactemails} 
                                      name={"contactemails"}
                                      onChange={(v) => {
                                        setContactEmails(v)
                                      }}
                                      options={{
                                        placeholder: "Contact Email Address",
                                      }} className="w-full" 
                                      multiple
                                    >

                                  </TomSelect> */}
                                    <FormInput type="text"
                                                name={"contactemails"}
                                                defaultValue={contactemails}
                                                onChange={(e)=>setContactEmails(e.target.value)}
                                                aria-label="default input inline 1"/>
                                </div>

                                <div className={"col-span-12 text-left"}>
                                    <label className={"pb-2 text-sm"}>Description of Service</label>
                                    <FormTextarea 
                                                name={"servicedescription"}
                                                defaultValue={servicedescription}
                                                onChange={(e)=>setServiceDescription(e.target.value)}
                                                aria-label="default input inline 1"/>
                                </div>

                                <div className={"col-span-12 text-left"}>
                                    <label className={"pb-2 text-sm"}>Standard Services</label>
                                    <TomSelect value={standardService} 
                                    name={"standard_services"}
                                    onChange={(v) => {
                                      setStandardService(v)
                                  }}
                                    options={{
                                                    placeholder: "Search Standard Services",
                                                  }} className="w-full" multiple>

                                    {standardServicelist.map((v:any, i:any) => (
                                      <option value={v.id}>{v.name}</option>
                                    ))}
                                      
                                  </TomSelect>
                                </div>

                                <div className={"col-span-6 text-left"}>
                                    <label className={"pb-2 text-sm"}>Urgency of work</label>
                                    <TomSelect 
                                    value={urgencywork} 
                                    name={"urgencywork"}
                                    onChange={(v) => {
                                      setUrgencyWork(v)
                                  }}
                                    options={{
                                                    placeholder: "Urgency of work",
                                                  }} className="w-full" >
                                      <option value=""></option>
                                      <option value="2">Standard</option>
                                      <option value="1">Urgent</option>
                                  </TomSelect>
                                </div>

                                <div className={"col-span-12 text-left"}>
                                                <label className={"text-sm"}>Select Discipline</label>
                                                <div className="flex flex-col mt-2">
                                                {disciplinelist.map((v:any, i:any) => (
                                                    <FormCheck className="mt-2 mr-2 sm:mr-5">
                                                    <FormCheck.Input
                                                        id={v.id}
                                                        type="checkbox"
                                                        value={v.id}
                                                        name="discipline"
                                                        //@ts-ignore
                                                        checked={items.includes(v.id as never)}
                                                        onChange={(e)=>
                                                          do_update_change(v.id)
                                                        }
                                                    />
                                                    <FormCheck.Label htmlFor={v.name}>
                                                        {v.name}
                                                    </FormCheck.Label>
                                                </FormCheck>
                                                  ))}
                                                </div>
                                            </div>
                               {disciplinelist.map((v:any, i:any) => (   
                                <>         
                                {
                                   items.includes(v.id as never) &&
                                    <div className="col-span-12 text-left">
                                      <div className={"col-span-12 text-left mb-2"}>
                                          <label className={"pb-2 text-sm"}>{v.name} Hours</label>
                                          <FormInput type="text"
                                                      name={"hour_"+v.name}
                                                      defaultValue={branches[i]?.hour}
                                                      onChange={(e)=> handleInputChange(e, v.id, "hour")}
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
                                      <div className={"col-span-12 text-left"}>
                                      <label className={"pb-2 text-sm"}>{v.name} Tasks</label>
                                      <FormTextareaBullet
                                                  bullet={true}
                                                  name={"task_"+v.name}
                                                  value={branches[i]?.task}
                                                  onChange={(e)=>handleInputChange(e, v.id, "task")}
                                                  aria-label="default input inline 1"/>
                                    </div>
                                    </div>
                                   }
                                 </>
                               ))}


                               <div className={"col-span-12 text-left"}>
                                    <label className={"pb-2 text-sm"}>Requested Completion Date</label>
                                    <FormInput type="date"
                                      placeholder=""
                                      name={"request_due_date"}
                                      min={current_date_to_manage}
                                      defaultValue={completiondate}
                                      onChange={(e)=>setCompletionDate(e.target.value)}
                                      aria-label="default "/>
                                </div>


                                 <div className={"col-span-12 text-left"}>
                                                <label className={"pb-2 text-sm"}>Select Completed Discipline</label>
                                                <div className="flex flex-col mt-2 sm:flex-row">

                                                    <FormCheck className="mt-2 mr-2 sm:mr-5">
                                                    <FormCheck.Input
                                                        id={'checkbox-switch-1'}
                                                        type="radio"
                                                        value={'1'}
                                                        name="completed_discipline"
                                                        //@ts-ignore
                                                        checked={compdiscipline===1}
                                                        onChange={(e)=>
                                                          setCompdiscipline(1)
                                                        }
                                                    />
                                                    <FormCheck.Label htmlFor={'checkbox-switch-1'}>
                                                      MP Completed Waiting for E
                                                    </FormCheck.Label>
                                                </FormCheck>
                                                 
                                                </div>
                                                <div className="flex flex-col mt-2 sm:flex-row">

                                                    <FormCheck className="mt-2 mr-2 sm:mr-5">
                                                    <FormCheck.Input
                                                        id={'checkbox-switch-2'}
                                                        type="radio"
                                                        value={'2'}
                                                        name="completed_discipline"
                                                        //@ts-ignore
                                                        checked={compdiscipline===2}
                                                        onChange={(e)=>
                                                          setCompdiscipline(2)
                                                        }
                                                    />
                                                    <FormCheck.Label htmlFor={'checkbox-switch-2'}>
                                                      E Completed Waiting for MP
                                                    </FormCheck.Label>
                                                </FormCheck>
                                                 
                                                </div>
                                                <div className="flex flex-col mt-2 sm:flex-row">

                                                    <FormCheck className="mt-2 mr-2 sm:mr-5">
                                                    <FormCheck.Input
                                                        id={'checkbox-switch-3'}
                                                        type="radio"
                                                        value={'3'}
                                                        name="completed_discipline"
                                                        //@ts-ignore
                                                        checked={compdiscipline===3}
                                                        onChange={(e)=>
                                                          setCompdiscipline(3)
                                                        }
                                                    />
                                                    <FormCheck.Label htmlFor={'checkbox-switch-3'}>
                                                      This Form is Complete
                                                    </FormCheck.Label>
                                                </FormCheck>
                                                 
                                                </div>
                                                
                                     </div>
                          {
                            !additionalpm &&
                                <div className={"col-span-12 text-left"}>
                                    <label className={"pb-2 text-sm"}>Notify Ardebili Engineering PM Working on this Project</label>
                                      <TomSelect 
                                          value={notifyengineers} 
                                          name={"notifyengineers"} 
                                          onChange={(v) => setNotifyengineers(v)} 
                                          options={{placeholder: "Person’s Email"}} 
                                          className="w-full"
                                          multiple
                                          
                                        >
                                          {userlist.map((v:any, i:any) => (
                                            <option value={v.id}>{v.fname} {v.lname} ({v.email})</option>
                                          ))}
                                        </TomSelect>
                                </div>
                          }
                            {
                              (compdiscipline == 3 || compdiscipline == null) &&
                                <div className={"col-span-12 text-left"}>
                                                <div className="flex flex-col mt-2 sm:flex-row">
                                                    <FormCheck className="mt-2 mr-2 sm:mr-5">
                                                    <FormCheck.Input
                                                        id={'no_additional_pm'}
                                                        type="checkbox"
                                                        value={'1'}
                                                        name="additionalpm"
                                                        //@ts-ignore
                                                        checked={additionalpm}
                                                        onChange={(e)=>
                                                          setAdditionalpm(!additionalpm)
                                                        }
                                                    />
                                                    <FormCheck.Label htmlFor={'no_additional_pm'}>
                                                    No Additional PM is working on this Project
                                                    </FormCheck.Label>
                                                </FormCheck>
                                                 
                                                </div>
                                                
                                     </div>
                            }


                            </div>
                        </div>
                    </div>
                </Dialog.Description>
                <Dialog.Footer>
                    <Button type="button" variant="outline-secondary" onClick={()=> {
                        resetStates();
                        setAddDepartmentModal(false);
                        }}
                        className="w-20 mr-1 float-left"
                        >
                        Cancel
                    </Button>
                    <Button variant="primary" type="button" className="w-20" ref={sendButtonRef} onClick={()=>editid!=null?save_asa():save_asa()}>
                        Submit
                    </Button>
                </Dialog.Footer>
            </Dialog.Panel>
        </Dialog>

      </>
    );
  }
  
  export default ASAREQUESTS;
  