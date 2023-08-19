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
import Tippy from "../../base-components/Tippy";
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

function AsaArchived() {
    
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
      const {isError, data} = await doPost(payload, 'get_all_urarchived_asa');
      if(isError) {
          toast.error('Something went wrong with server.');
          setLoading(false);
      }else{
          if (data.action == "success") {
            setLoading(false);
            setAsa(data?.asa_data);
            console.log(data?.asa_data)
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
        ids: archived
      }
      // console.log(payload);
      // return;
      setLoading(true);
      const {isError, data} = await doPost(payload, 'delete_all_archive_requestes');
      setLoading(false);
      if(isError) {
          toast.error('Something went wrong with server.');
          setLoading(false);
      }else{
          if (data.action == "success") {
            setDeleteConfirmationModal(false)
            setLoading(false);
            get_standard_services();
            // toast.success("All Archived Requests deleted successfully!")
            toast.success("Selected ASA Requests deleted successfully!")
          }
          else {
              setLoading(false);
              toast.error(data.error);
          }
      }
    }

    const handleUnarchive = async (ros: any) =>{
        // console.log(delid)
        const payload = {
          token:getLoggedObject()?.token,
          ids: ros.id
        }
        setLoading(true);
        const {isError, data} = await doPost(payload, 'unarchive_specific_asa');
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
                    return projectNameMatch || projectNoMatch || projectUrgency;
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
    
    const columns = [
      {
        name: '#',
        width:"60px",
        sortable: true,
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
          width:"140px",
          allowOverflow: true,
          selector: (row: { pro_number: string; }) => row.pro_number,
          sortable: true,
          cell: (row: any) => (
            // @ts-ignore
            <span className="blurColor">
                {row.pro_number}{row.pro_version!=0?"."+row.pro_version:""}
            </span>
        )
      },
      {
        name: 'Name',
        allowOverflow: true,
        minWidth: "30%",
        selector: (row: { name: string; }) => row.name,
        sortable: true,
        cell: (row: any) => (
          // @ts-ignore
          <div className="flex">
            <span style={{marginRight:"10px"}}>
                {row.name}
            </span>
            {row.archive_reason != null && 
                  <Tippy className="" content={row.archive_reason}>
                  <Lucide icon="AlertOctagon" className="w-4 h-4 mr-1"/>
                  </Tippy>
            }
          </div>
      )
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
          width:"160px",
          cell: (row: any,) => (
            <div className="flex items-center justify-center">
                <Button size={"sm"} elevated={false}
                        onClick={() => {
                            handleUnarchive(row)
                        }}>
                    Un-archive
                </Button>
                <Button variant="danger" className="ml-1" size={"sm"} elevated={true}
                        onClick={() => {
                            handleDelete(row)
                        }}>
                    
                    <Lucide icon="Trash" className="w-4 h-4"/>
                </Button>
            </div>
          ),
      },
    ];


    const handleDelete = async (ros:any) => {
      setDelID(ros.id)
      setCreateNewModal(true)
    }

    const delete_asa_data = async () => {
      const payload = {
        token:getLoggedObject()?.token,
        ids: delid
      }
      setLoading(true);
      const {isError, data} = await doPost(payload, 'delete_specific_archive_asa');
      setLoading(false);
      if(isError) {
          toast.error('Something went wrong with server.');
          setLoading(false);
      }else{
          if (data.action == "success") {
            setCreateNewModal(false)
            setLoading(false);
            setDelID(null)
            get_standard_services();
            toast.success("ASA deleted successfully!")
          }
          else {
              setLoading(false);
              toast.error(data.error);
          }
      }
    }

    const prev = localStorage.getItem("ArdibiliAuth");
    const prevObj = prev ? JSON.parse(prev) : null;
    const  department = prevObj?.departement || 0;
    //const SHOWMENU = department==0?<SideMenuSmall/>:<SideMenu />

    
    return (
      <>
        <div className="flex flex-col items-center mt-8 intro-y sm:flex-row">
          <h2 className="mr-auto text-lg font-medium">Archived ASA Requests</h2>
        </div>

        <div className="flex flex-wrap justify-between items-center col-span-12 mt-2 intro-y sm:flex-nowrap mt-6">
                  {
                    department == 1 ?
                    <Button variant="danger" className="mr-2 shadow-md"
                            onClick={(event: React.MouseEvent)=> {
                              event.preventDefault();
                              // setDeleteConfirmationModal(true);
                              archivebutton?setDeleteConfirmationModal(true):null
                            }}

                            disabled={(asa && asa.length===0) || !archivebutton }
                    >
                      Delete Archive
                    </Button>
                    :
                    <div></div>
                  }

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
            open={deleteConfirmationModal}
            onClose={() => {
            setDeleteConfirmationModal(false);
            }}
            initialFocus={deleteButtonRef}
        >
            <Dialog.Panel>
                <div className="p-5 text-center">
                    <Lucide
                    icon="XCircle"
                    className="w-16 h-16 mx-auto mt-3 text-confirm"
                    />
                    <div className="mt-5 text-3xl">Are you sure?</div>
                    <div className="mt-5 text-slate-500">
                    Do you want to delete all archive ASA Request(s)? 
                    this action won't be reversed.
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
                    onClick={()=>archive_requests()}
                    >
                    Delete All
                    </Button>
                </div>
            </Dialog.Panel>
        </Dialog>
      {/* END: Delete Confirmation Modal */}


      <Dialog
            open={createNewModal}
            onClose={() => {
            setCreateNewModal(false);
            }}
            initialFocus={deleteButtonRef}
        >
            <Dialog.Panel>
                <div className="p-5 text-center">
                    <Lucide
                    icon="XCircle"
                    className="w-16 h-16 mx-auto mt-3 text-confirm"
                    />
                    <div className="mt-5 text-3xl">Are you sure?</div>
                    <div className="mt-5 text-slate-500">
                    Do you want to delete this ASA? <br />
                    All data will be removed from records.
                    </div>
                </div>
                <div className="px-5 pb-8 text-center">
                    <Button
                    // variant="outline-secondary"
                    type="button"
                    onClick={() => {
                        setCreateNewModal(false);
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
                    onClick={()=>delete_asa_data()}
                    >
                    Delete
                    </Button>
                </div>
            </Dialog.Panel>
        </Dialog>

      {/* ADD NEW DEPARTMENT DIAGLOG */}
        <Dialog staticBackdrop  open={adddepertmentmodal} 
            onClose={()=> {
                setAddDepartmentModal(false);
            }}
            initialFocus={sendButtonRef}
            size={"lg"}
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
                                                           onChange={(e)=>
                                                            setRequestDate(e.target.value)
                                                          }
                                                           placeholder="Date"/>
                                 
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

                                <div className={"col-span-6 text-left"}>
                                                <label className={"pb-2 text-sm"}>Select Discipline</label>
                                                <div className="flex flex-col mt-2 sm:flex-row">
                                                {disciplinelist.map((v:any, i:any) => (
                                                    <FormCheck className="mt-2 mr-2 sm:mr-5">
                                                    <FormCheck.Input
                                                        id={v.name}
                                                        type="checkbox"
                                                        value={v.name}
                                                        name="discipline"
                                                        //@ts-ignore
                                                        checked={items.includes(v.name as never)}
                                                        onChange={(e)=>
                                                          do_update_change(v.name)
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
                                   items.includes(v.name as never) &&
                                    <div className="col-span-12 text-left">
                                      <div className={"col-span-12 text-left mb-2"}>
                                          <label className={"pb-2 text-sm"}>{v.name} Hours</label>
                                          <FormInput type="text"
                                                      name={"hour_"+v.name}
                                                      defaultValue={branches[i].hour}
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
                                      <FormTextarea
                                                    // bullet={true}
                                                  name={"task_"+v.name}
                                                  defaultValue={branches[i].task}
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
                        setAddDepartmentModal(false);
                        }}
                        className="w-20 mr-1 float-left"
                        >
                        Cancel
                    </Button>
                    <Button variant="primary" type="button" className="w-20" ref={sendButtonRef}>
                        Submit
                    </Button>
                </Dialog.Footer>
            </Dialog.Panel>
        </Dialog>


      </>
    );
  }
  
  export default AsaArchived;
  