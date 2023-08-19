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
    // new Date().toISOString().slice(0,-8)
    const [requestdate, setRequestDate] = useState<any | null>(null);
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

    const [clientaddress, setClientAddress] = useState<any | null>('abc')

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

    const [dateofcompletion, setDateOfCompletion] = useState<any | null>(false);
   
    
    useEffect(() => {
      get_standard_services();
    }, []);

    const get_standard_services = async () => {
      const payload = {
        token:getLoggedObject()?.token,
      }
        //   console.log(payload);
        //   return;
      setLoading(true);
      const {isError, data} = await doPost(payload, 'get_all_standard_services');
      if(isError) {
          toast.error('Something went wrong with server.');
          setLoading(false);
      }else{
          if (data.action == "success") {
            setLoading(false);
            setAsa(data?.asa_data);
            setStandardServicelist(data?.data);
            setDisciplinelist(data?.discp);
            console.log(data?.discp);
            setUserList(data?.users_list)
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
        setRequestDate(null);
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
        setDateOfCompletion(false)
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
      // if(clientprojectnumber == null){
      //   toast.error('Please enter client project Number.');
      //   return;
      // }
      if(client == null){
        toast.error('Please enter Client.');
        return;
      }
      if(clientcontact == null){
        toast.error('Please enter Contact Name.');
        return;
      }
      if(contactemails == null){
        toast.error('Please enter contact emails.');
        return;
      }
      // if(clientaddress == null){
      //   toast.error('Please enter Client Address.');
      //   return;
      // }
      if(servicedescription == null){
        toast.error('Please enter Service description.');
        return;
      }
      // if(standardService.length == 0){
      //   toast.error('Please select standard services.');
      //   return;
      // }
      if(urgencywork == 0){
        toast.error('Please select urgency work.');
        return;
      }
      if(items.length == 0){
        toast.error('Please select atleast one discipline.');
        return;
      }
      // if(completiondate == null){
      //   toast.error('Please enter completion date.');
      //   return;
      // }
      let error_show = 0;
      if(items.length > 0){
        const missingItems = items.filter((itemId) => !branches.find((branch) => branch.id === itemId));
        // console.log(missingItems);
        if (missingItems.length > 0) {
          // Show an alert if there are missing items
          // alert(`Specific item(s) not filled out: ${missingItems.map(itemId => disciplinelist.find((item: { id: any; }) => item.id === itemId).name).join(', ')}`);
          toast.error(`Please completed ${missingItems.map(itemId => disciplinelist.find((item: { id: any; }) => item.id === itemId).name).join(', ')} discipline!`);
          error_show = 1;
          return;
        } else {
          // @ts-ignore
          const filteredBranches = branches.filter(branch => items.includes(branch.id));
          console.log(filteredBranches);
          filteredBranches.forEach((branch) => {
            const branchName = disciplinelist.find((item: { id: any; }) => item.id === branch.id)?.name || "Unknown Branch";
            if (!branch.hour || branch.hour == "") {
              error_show = 1;
              toast.error(`Please complete ${branchName}   Revisions - ASA Hours`);
              return false;
            }
            else if (!branch.task || branch.task == "") {
              error_show = 1;
              toast.error(`Please complete ${branchName}   Revisions - ASA Tasks`);
              return false;
            }  else {
              return true;
            }
          });
        }
      }

      const error_display = error_show;

      if(error_display == 1){
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
        clientaddress: clientaddress,
        servicedescription:servicedescription,
        standardService:standardService,
        urgencywork:urgencywork,
        disciplinehour:disciplinehour,
        disciplintasks:disciplintasks,
        dateofcompletion: dateofcompletion?1:0,
        completiondate:dateofcompletion?completiondate:null,
        compdiscipline:compdiscipline,
        notifyengineers:notifyengineers,
        additionalpm:additionalpm?1:0,
        items:items,
        branches:branches,
        editid:editid
      }
          // console.log(payload)
          // return;
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
            toast.success(editid==null?"ASA has been created successfully!":"ASA Request updated successfully!");
            // window.location.reload();
            resetStates();
            get_standard_services();
          }
          else {
              setLoading(false);
              toast.error(data.error);
          }
      }
    }
    const archive_requests = async () =>{

      if(archivereason == null){
        toast.error('Please enter Reason.');
        return;
      }
      
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
                    const projectNameMatch = item.name !== null && item.name.toLowerCase().includes(q.toLowerCase());
                    const projectNoMatch = item.pro_number !== null && item.pro_number.includes(q);
                    const projectUrgency = item.urgency_text !== null && item.urgency_text.toLowerCase().includes(q.toLowerCase());
                    const projectStatus = item.status_text !== null && item.status_text.toLowerCase().includes(q.toLowerCase());
                    return projectNameMatch || projectNoMatch || projectUrgency || projectStatus;
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
        // console.log(val?.discipline_data);
        // console.log(disciplinelist)
        // console.log(val?.items)
        // return;
        // const emails_split = val?.asa_email;
        // const new_val = emails_split.split(',');
        // console.log(new_val)
        setEditID(val.id);
        setFullName(val?.asa_creator_id)
        setRequestDate(val.asa_request_date)
        setProjectName(val.asa_project_name)
        setProjectNumber(val.asa_project_no)
        setClientprojectnumber(val.client_project_number)
        setClient(val.asa_company_name)
        setClientContact(val.company_contact)
        setContactEmails(val?.asa_email)
        setServiceDescription(val.service_description)
        setUrgencyWork(val.urgency)
        setItems(val?.items)
        setStandardService(val.standard_service_id)
        const newBranches = val?.discipline_data;
        setBranches(newBranches)
        setCompletionDate(val?.request_due_date)
        setDateOfCompletion(val?.dateofcompletion==1?true:false)
        //if(val?.dateofcompletion==1){
          setCompdiscipline(val?.completed_discipline)
        //}
        setNotifyengineers(val?.additional_pm_ar)
        setAddDepartmentModal(true);
        if(val?.additional_pm_ar == ""){
          setAdditionalpm(true)
        } else {
          setAdditionalpm(false)
        }
        //setClientAddress(val?.client_address);
    }

    const handleArchiveASA = async (ros: any) =>{
        if(archivereason == null){
          toast.error('Please enter Reason.');
          return;
        }
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
          code: codeset
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
      {
          name: '#',
          width:"60px",
          sortable: false,
          selector: (row: { id: any; }) => parseInt(row.id),
          format: (row: { id: any; }) => parseInt(row.id),
          cell: (row: any,) => (
            <FormCheck className="custom_checkbox">
                <FormCheck.Input
                    id={row.id}
                    type="checkbox"
                    value={row.id}
                    name="selectunselect"
                    //@ts-ignore
                    checked={archived.includes(row.id as never)}
                    onChange={(e)=>
                        do_update_select_archive(row.id)
                    }
                />
            </FormCheck>
        ),
       
      },
      {
          name: 'Project No.',
          width:"120px",
          allowOverflow: false,
          // format: (row: { pro_number: any; }) => parseInt(row.pro_number),
          selector: (row: { pro_number: string; }) => parseInt(row.pro_number),
          sortable: true,
          cell: (row: any) => (
            <span className="blurColor">
                {row.pro_number}
            </span>
        )
      },
      {
        name: 'Name',
        allowOverflow: true,
        minWidth: "35%",
        selector: (row: { name: string; }) => row.name,
        sortable: true,
    },
      {
          name: 'Request Date',
          allowOverflow: true,
          selector: (row: { email: any; }) => row.email,
          sortable: true,
          format: (row: { email: any; }) => new Date(row.email).toLocaleDateString(),
      },
      {
          name: 'Urgency',
          selector: (row: { urgency: any; }) => row.urgency,
          sortable: true,
          cell: (row: any) => (
            <span className={getUrgencyEnums(row.urgency).color}>
                {getUrgencyEnums(row.urgency).title}
            </span>
          )
      },
      {
          name: 'Status',
          selector: (row: { status: any; }) => row.status,
          sortable: true,
          cell: (row: any) => (
              <span style={{color: getStatusEnums(row.status).color}}>
                  {getStatusEnums(row.status).title}
              </span>
          )
      },
      {
          name: 'Actions',
          width:"80px",
          cell: (row: any,) => (
              <div className="flex items-center justify-center w-100">
                  <Menu>
                    
                      <Menu.Button
                          as={"div"}
                         >
                          <Lucide icon="Plus" className="w-4 h-4 mr-1"/>{" "}
                      </Menu.Button>
                     
                      <Menu.Items className="w-40">
                          <Menu.Item onClick={() => {
                              handleViewInformation(row)
                          }}>Information</Menu.Item>

                         {
                            (row.completed_discipline != 4 && row.completed_discipline != 5 && row.completed_discipline != 6) &&
                          <Menu.Item onClick={() => {
                              handleReviseASA(row)
                          }}>Revise ASA</Menu.Item>
                        }

                        {
                            (row.completed_discipline == 6) &&
                            <Menu.Item
                            onClick={() => {
                                navigate('view/pdf/'+row.ASA_PRO_NUMBER)
                            }}
                            >View PDF </Menu.Item>
                        }
                        {
                            (row.check_admin == 1 && (row.completed_discipline != 4 && row.completed_discipline != 5 && row.completed_discipline != 6)) &&
                            <Menu.Item
                                onClick={() => {
                                    handleSendToClient(row)
                                }}
                            >Send to client</Menu.Item>
                        }

                          {
                             (row.check_admin == 1 && (condition.includes(row.completed_discipline as never))) &&
                            <>
                            <Menu.Item
                                onClick={() => {
                                    do_action_update(row, 7, "ASA declined, proceed with work")                                    
                                }}
                            >ASA declined, proceed with work</Menu.Item>
                            <Menu.Item
                                onClick={() => {
                                    do_action_update(row, 4, "Approve ASA")
                                    // handleApproveASA(row)
                                }}
                            >
                                Approve ASA</Menu.Item>
                            <Menu.Item
                                onClick={() => {
                                    // handleDeclineASA(row)
                                    do_action_update(row, 5, "Decline ASA")
                                }}
                            >Decline ASA</Menu.Item>
                            </>
                        }
                         {
                             (row.check_admin == 1) &&
                          <Menu.Item
                              onClick={() => {
                                  setSingleArchive(true)
                                  setSingleArchiveID(row.id)
                                  // handleArchiveASA(row)
                              }}
                          >Archive ASA</Menu.Item>
                        }
                      </Menu.Items>
                         
                  </Menu>
              </div>
          ),
      },
    ];

    return (
      <>
        <div className="flex flex-col items-center mt-8 intro-y sm:flex-row">
          <h2 className="mr-auto text-lg font-medium">Additional Service Request</h2>
        </div>

        <div className="flex flex-wrap justify-between items-center col-span-12 mt-2 intro-y sm:flex-nowrap mt-6">
                    <Button variant="primary" className="mr-2 shadow-md"
                            onClick={(event: React.MouseEvent)=> {
                              event.preventDefault();
                              setAddDepartmentModal(true);
                            }}
                    >
                      Add New ASA
                    </Button>

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

        <div className="mt-5">
            <div  className={archivebutton?"activeArchive":"ActArchive"}>
               <span  onClick={(event: React.MouseEvent)=> {
                        event.preventDefault();
                        archivebutton?setDeleteConfirmationModal(true):null
                    }}>Archive Request</span>
            </div>
        </div>

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
                    Do you want update ASA status to <b className="text-danger">{codetext}</b>? 
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
                                    <label className={"pb-2 text-sm"}>ASA Request Date  <span className="redclass">*</span></label>
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
                                    <label className={"pb-2 text-sm"}>Full Name  <span className="redclass">*</span></label>
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
                                    <label className={"pb-2 text-sm"}>Project Name  <span className="redclass">*</span></label>
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
                                    <label className={"pb-2 text-sm"}>Client  <span className="redclass">*</span></label>
                                    <FormInput type="text"
                                                name={"client"}
                                                defaultValue={client}
                                                onChange={(e)=>setClient(e.target.value)}
                                                aria-label="default input inline 1"/>
                                </div>
                                <div className={"col-span-6 text-left"}>
                                    <label className={"pb-2 text-sm"}>Contact Name  <span className="redclass">*</span></label>
                                    <FormInput type="text"
                                                name={"clientcontact"}
                                                defaultValue={clientcontact}
                                                onChange={(e)=>setClientContact(e.target.value)}
                                                aria-label="default input inline 1"/>
                                </div>

                                <div className={"col-span-6 text-left"}>
                                    <label className={"pb-2 text-sm"}>Contact Email Address  <span className="redclass">*</span></label>
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

                                {/* <div className={"col-span-12 text-left"}>
                                    <label className={"pb-2 text-sm"}>Client Address</label>
                                    <FormInput type="text"
                                                name={"clientaddress"}
                                                defaultValue={clientaddress}
                                                onChange={(e)=>setClientAddress(e.target.value)}
                                                aria-label="default input inline 1"/>
                                </div> */}

                                <div className={"col-span-12 text-left"}>
                                    <label className={"pb-2 text-sm"}>Description of Service  <span className="redclass">*</span></label>
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
                                      <option value=""></option>
                                      <option value="2">Standard</option>
                                      <option value="1">Urgent</option>
                                  </TomSelect>
                                </div>

                                
                                
                                <div className={"col-span-12 text-left"}>
                                                <label className={"text-sm"}>Select Discipline  <span className="redclass">*</span></label>
                                                <div className="flex flex-col mt-2">
                                                {disciplinelist.map((v:any, i:any) => (
                                                <div className="flex flex-col mt-2 sm:flex-row mb-3">
                                                  <FormCheck className="mt-2 mr-2 sm:mr-5">
                                                    <FormCheck.Input
                                                        id={'abc'+v.id}
                                                        type="checkbox"
                                                        value={v.id}
                                                        name="discipline"
                                                        //@ts-ignore
                                                        checked={items.includes(v.id as never)}
                                                        onChange={(e)=>
                                                          do_update_change(v.id)
                                                        }
                                                    />
                                                    <FormCheck.Label htmlFor={'abc'+v.id}>
                                                      {v.name}
                                                    </FormCheck.Label>
                                                  </FormCheck>
                                              </div>

                                                  // <div>
                                                  //   <FormCheck className="mt-2 mr-2 sm:mr-5">
                                                  //     <FormCheck.Input
                                                  //         id={v.id}
                                                  //         type="checkbox"
                                                  //         value={v.id}
                                                  //         name="discipline"
                                                  //         //@ts-ignore
                                                  //         checked={items.includes(v.id as never)}
                                                  //         onChange={(e)=>
                                                  //           do_update_change(v.id)
                                                  //         }
                                                  //     />
                                                  //     <FormCheck.Label htmlFor={v.name}>
                                                  //         {v.name}
                                                  //     </FormCheck.Label>
                                                  // </FormCheck>
                                                  // </div>
                                                  ))}
                                                </div>
                                            </div>

                                            {disciplinelist.map((v:any, i:any) => {
  if (items.includes(v.id as never)) {
    const branch = branches.find((b) => b.id === v.id);
    return (
      <>
        <div className="col-span-12 text-left">
          <div className="col-span-12 text-left mb-2">
            <label className="pb-2 text-sm">
              {v.name} Hours <span className="redclass">*</span>
            </label>
            <FormInput
              type="text"
              name={"hour_" + v.name}
              value={branch?.hour}
              onChange={(e) => handleInputChange(e, v.id, "hour")}
              onKeyPress={(e) => {
                const keyCode = e.keyCode || e.which;
                const keyValue = String.fromCharCode(keyCode);
                // const regex = /^[0-9\b]+$/;
                const regex = /^[0-9]*(?:\.[0-9]*)?$/;
                if (!regex.test(keyValue)) {
                  e.preventDefault();
                }
              }}
              aria-label="default input inline 1"
            />
          </div>
          <div className="col-span-12 text-left">
            <label className="pb-2 text-sm">
              {v.name} Tasks <span className="redclass">*</span>
            </label>
            <FormTextareaBullet
              bullet={true}
              name={"task_" + v.name}
              value={branch?.task}
              onChange={(e) => handleInputChange(e, v.id, "task")}
              aria-label="default input inline 1"
            />
          </div>
        </div>
      </>
    );
  }
  return null;
})}

                               {/* {disciplinelist.map((v:any, i:any) => (   
                                <>         
                                {
                                   items.includes(v.id as never) &&
                                    <div className="col-span-12 text-left">
                                      <div className={"col-span-12 text-left mb-2"}>
                                          <label className={"pb-2 text-sm"}>{v.name} Hours  <span className="redclass">*</span></label>
                                          <FormInput type="text"
                                                      name={"hour_"+v.name}
                                                      value={branches[i]?.hour}
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
                                      <label className={"pb-2 text-sm"}>{v.name} Tasks <span className="redclass">*</span></label>
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
                               ))} */}
                              {/* <div className={"col-span-12 text-left"}>
                            <hr style={{width:"100%"}} />
                            </div>  */}

                               <div className={"col-span-12 text-left"}>
                                    <label className={"pb-2 text-sm"}>
                                    <FormCheck className="mt-2 mr-2 sm:mr-5">
                                                    <FormCheck.Input
                                                        id={'completion_date'}
                                                        type="checkbox"
                                                        value={'1'}
                                                        name="completion_date"
                                                        //@ts-ignore
                                                        checked={dateofcompletion}
                                                        onChange={(e)=>
                                                          setDateOfCompletion(!dateofcompletion)
                                                        }
                                                    />
                                                    <FormCheck.Label htmlFor={'completion_date'}>
                                                      Requested Completion Date
                                                    </FormCheck.Label>
                                                </FormCheck>
                                      
                                      </label>
                                    {
                                      dateofcompletion &&
                                    
                                    <FormInput type="date"
                                      placeholder=""
                                      name={"request_due_date"}
                                      min={current_date_to_manage}
                                      defaultValue={completiondate}
                                      onChange={(e)=>setCompletionDate(e.target.value)}
                                      aria-label="default "/>
                                    }
                                </div>


                                 <div className={"col-span-12 text-left"}>
                                                <label className={"pb-2 text-sm"}>Select Completed Discipline  <span className="redclass">*</span></label>
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
                                                          // setCompdiscipline(1)
                                                          {
                                                            setAdditionalpm(false)
                                                            setCompdiscipline(1)
                                                          }
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
                                                          {
                                                            setAdditionalpm(false)
                                                            setCompdiscipline(2)
                                                          }
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
                            (compdiscipline == 3 || compdiscipline == null) &&
                                <div className={"col-span-12 text-left"}>
                                                <div className="flex flex-col mt-2 sm:flex-row mb-3">
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

        <InfoModal
            setInfoModalPreview={setInfoModal}
            infoModalPreview={infoModal}
            reqInfo={selectedRequest}
        />

      </>
    );
  }
  
  export default ASAREQUESTS;
  