import React, { useEffect, useState, useRef, createRef } from "react";
import {Link, useNavigate} from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from "../../hooks/useAuth";
import { doPost } from "../../utils/apiCalls";
import { validateEmail, getStatusEnums, getUrgencyEnums, getStatusActive } from "../../utils/functions";
import Lucide from "../../base-components/Lucide";
import { createIcons, icons } from "lucide";
import { urls } from "./../../utils/Api_urls";

import logoUrl from "../../assets/images/logo_main.png";
import logoWhite from "../../assets/images/logo_white.png";
import illustrationUrl from "../../assets/images/illustration.svg";
import { FormInput, FormCheck, FormSelect, FormLabel } from "../../base-components/Form";
import Button from "../../base-components/Button";
import clsx from "clsx";
import { replaceNode } from "tom-select/src/vanilla";
import DataTable from "react-data-table-component";
import { Dialog, Menu } from "../../base-components/Headless";
// import Table from "../../base-components/Table";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import { stringToHTML } from "../../utils/helper";
import TomSelect from "../../base-components/TomSelect";

interface Response {
  name?: string;
  category?: string;
  images?: string[];
  status?: string;
}

function Users() {
    const tableRef = createRef<HTMLDivElement>();
    const tabulator = useRef<Tabulator>();
    const [filter, setFilter] = useState({
      field: "name",
      type: "like",
      value: "",
    });
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

    const [firstname, setFirstname] = useState<any | null>(null)
    const [lastname, setLastname] = useState<any | null>(null)
    const [email, setEmail] = useState<any | null>(null)
    const [password, setPassword] = useState<any | null>(null)
    const [userdata, setUserData] = useState(null)
    const [editid, setEditID] = useState(null)
    const [delid, setDelID] = useState(null)

    const [departmentall, setDepartmentAll] = useState<any | null>([])
    const [selecteddepartments, setSelectedDepartments] = useState<any | null>([])
    


    const departmentlistall = async () => {
      if(loading) return;
      const payload = {
        token:getLoggedObject()?.token,
      }
      setLoading(true);
      const {isError, data} = await doPost(payload, 'get_all_departments');
      if(isError) {
          toast.error('Something went wrong with server.');
          setLoading(false);
      }else{
          if (data.action == "success") {
            setLoading(false);
            setDepartmentAll(data?.data);
            // console.log(data?.data);
          }
          else {
              setLoading(false);
              toast.error(data.error);
          }
      }
    }
    const get_all_user_data = async () => {
      if(loading) return;
      const payload = {
        token:getLoggedObject()?.token,
      }
      setLoading(true);
      const {isError, data} = await doPost(payload, 'get_all_users');
      if(isError) {
          toast.error('Something went wrong with server.');
          setLoading(false);
      }else{
          if (data.action == "success") {
            setLoading(false);
            setAsa(data?.data);
          }
          else {
              setLoading(false);
              toast.error(data.error);
          }
      }
    }

    
  
    useEffect(() => {
      get_all_user_data()
      departmentlistall()
    }, []);

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
            setSelectedDepartments(data?.data.departmentalls)
            // console.log(data?.data.departmentalls);
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

    // UPDATE DEPARTMENT
    const update_department = async () =>{
      if(loading) return;
      if(firstname==null){
          toast.error('Please enter your first name.');
          return;
      }
      if(lastname==null){
          toast.error('Please enter your last name.');
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
      if(password==null && editid == null){
        toast.error('Please enter your password.');
        return;
      }
      if(selecteddepartments.length == 0){
          toast.error('Please select atleast one department.');
          return;
      }
      const payload = {
        token:getLoggedObject()?.token,
        firstname:firstname,
        lastname:lastname,
        email:email,
        password:password,
        id:editid,
        departments:selecteddepartments
      }
      setLoading(true);
      const {isError, data} = await doPost(payload, 'update_user');
      if(isError) {
          toast.error('Something went wrong with server.');
          setLoading(false);
      }else{
          if (data.action == "success") {
            setLoading(false);
            setAddDepartmentModal(false);
            toast.success("User information updated successfully!");
            // window.location.reload();
            resetStates()
            get_all_user_data()
          }
          else {
              setLoading(false);
              toast.error(data.error);
          }
      }
    }

    //SAVE DEPARTMENT
    const save_department = async () =>{
      
      if(loading) return;
      if(firstname==null){
          toast.error('Please enter your first name.');
          return;
      }
      if(lastname==null){
          toast.error('Please enter your last name.');
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
      if(password==null && editid == null){
        toast.error('Please enter your password.');
        return;
      }
      if(selecteddepartments.length == 0){
          toast.error('Please select atleast one department.');
          return;
      }
      const payload = {
        token:getLoggedObject()?.token,
        firstname:firstname,
        lastname:lastname,
        email:email,
        password:password,
        departments:selecteddepartments
      }
      // console.log(payload);return
      setLoading(true);
      const {isError, data} = await doPost(payload, 'add_new_user');
      if(isError) {
          toast.error('Something went wrong with server.');
          setLoading(false);
      }else{
          if (data.action == "success") {
            setLoading(false);
            setAddDepartmentModal(false)
            toast.success("New user added successfully!");
            // window.location.reload();
            resetStates()
            get_all_user_data()
          }
          else {
              setLoading(false);
              toast.error(data.error);
          }
      }
    }
    const delete_department = async () =>{
      // console.log(delid)
      const payload = {
        token:getLoggedObject()?.token,
        id:delid
      }
      setLoading(true);
      const {isError, data} = await doPost(payload, 'delete_specific_user');
      setLoading(false);
      if(isError) {
          toast.error('Something went wrong with server.');
          setLoading(false);
      }else{
          if (data.action == "success") {
            setDeleteConfirmationModal(false)
            setLoading(false);
            resetStates()
            get_all_user_data()
            toast.success("User deleted successfully!")
          }
          else {
              setLoading(false);
              toast.error(data.error);
          }
      }
    }

    const active_block_user = async (ros:any) =>{
      // console.log(delid)
      const payload = {
        token:getLoggedObject()?.token,
        id:ros
      }
      setLoading(true);
      const {isError, data} = await doPost(payload, 'update_specific_user_status');
      setLoading(false);
      if(isError) {
          toast.error('Something went wrong with server.');
          setLoading(false);
      }else{
          if (data.action == "success") {
            setLoading(false);
            get_all_user_data()
            toast.success("User status updated successfully!")
          }
          else {
              setLoading(false);
              toast.error(data.error);
          }
      }
    }
    

    function HandleSearch(values: any) {
      let q = values;
      if (asa) {
          if (q){
              // @ts-ignore
              let results = asa.filter((item) => {
                  const projectNameMatch = item.name !== null && item.name.toLowerCase().includes(q.toLowerCase());
                  const projectNoMatch = item.email !== null && item.email.includes(q);
                  const projectUrgency = item.departmentslist && typeof item.departmentslist === 'string' && item.departmentslist.toLowerCase().includes(q.toLowerCase());
                  return projectNameMatch || projectNoMatch || projectUrgency;
              })
              setFiltered(results)
          }else{
              setFiltered(null)
          }
      }
  }

  const resetStates = async () => {
    setFirstname(null)
    setLastname(null)
    setEmail(null)
    setSelectedDepartments([])
    setPassword(null)
    setEditID(null)
    setDel(false)
  }


    const columns = [
      {
          name: 'Name',
          width:"20%",
          allowOverflow: true,
          selector: (row: { name: string; }) => row.name,
          sortable: true,
          cell: (row: any) => (
            // @ts-ignore
            <span>
                {row.name}
            </span>
        )
      },
      {
        name: 'Email',
        allowOverflow: true,
        minWidth: "30%",
        selector: (row: { email: string; }) => row.email,
        sortable: true,
    },
      {
          name: 'Departments',
          width:"30%",
          allowOverflow: false,
          selector: (row: { departmentslist: any; }) => row.departmentslist,
          sortable: true,
          // format: (row: { email: any; }) => new Date(row.email).toLocaleDateString(),
      },
      {
          name: 'Status',
          selector: (row: { status: any; }) => row.status,
          sortable: true,
          cell: (row: any) => (
            <span className={getStatusActive(row.status).color}>
                {getStatusActive(row.status).title}
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
                              active_block_user(row.id)
                          }}>
                          {
                              row.status == 1 ?
                              <div className="flex">
                                <Lucide icon="UserX" className="w-4 h-4 mr-2" /> Block
                              </div>
                              :
                              <div className="flex">
                                <Lucide icon="UserCheck" className="w-4 h-4 mr-2" /> Activate
                              </div>
                          }
                          </Menu.Item>
                          <Menu.Item onClick={() => {
                              get_specific_user_records(row.id)
                          }}><Lucide icon="Pencil" className="w-4 h-4 mr-2" /> Edit</Menu.Item>
                          <Menu.Item onClick={() => {
                              delete_user_data(row.id)
                          }}><Lucide icon="Trash2" className="w-4 h-4 mr-2" /> Delete</Menu.Item>

                      </Menu.Items>
                  </Menu>
              </div>
          ),
      },
    ];
    
    
  
    return (
      <>
        <div className="flex flex-col items-center mt-8 intro-y sm:flex-row">
          <h2 className="mr-auto text-lg font-medium">All Users</h2>
        
        </div>

        <div className="flex flex-wrap justify-between items-center col-span-12 mt-2 intro-y sm:flex-nowrap mt-6">
                    <Button variant="primary" className="mr-2 shadow-md"
                            onClick={(event: React.MouseEvent)=> {
                              event.preventDefault();
                              setAddDepartmentModal(true);
                            }}
                    >
                      Add New User
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
              className="w-16 h-16 mx-auto mt-3 text-danger"
            />
            <div className="mt-5 text-3xl">Are you sure?</div>
            <div className="mt-2 text-slate-500">
              Do you really want to delete this user? <br />
              This process cannot be undone.
            </div>
          </div>
          <div className="px-5 pb-8 text-center">
            <Button
              variant="outline-secondary"
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
              onClick={()=>delete_department()}
            >
              Delete
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
            size={"lg"}
            >
            <Dialog.Panel>
                <Dialog.Title>
                    <h2 className="mr-auto text-base font-medium">
                        {editid!=null?"Update User":"Add New User"}
                    </h2>
                </Dialog.Title>
                <Dialog.Description className="grid gap-4 gap-y-3">
                    <div className="pb-3">
                        <div className="my-5">
                            <div className="grid grid-cols-12 gap-3">

                                <div className={"col-span-6 text-left"}>
                                    <label className={"pb-2 text-sm"}>First Name <span className="redclass">*</span></label>
                                    <FormInput type="text"
                                                name={"fname"}
                                                defaultValue={firstname}
                                                onChange={(e)=>setFirstname(e.target.value)}
                                                aria-label="default input inline 1"/>
                                </div>

                                <div className={"col-span-6 text-left"}>
                                    <label className={"pb-2 text-sm"}>Last Name <span className="redclass">*</span></label>
                                    <FormInput type="text"
                                                name={"lname"}
                                                defaultValue={lastname}
                                                onChange={(e)=>setLastname(e.target.value)}
                                                aria-label="default input inline 1"/>
                                </div>

                                <div className={"col-span-12 text-left"}>
                                    <label className={"pb-2 text-sm"}>Email Address <span className="redclass">*</span></label>
                                    <FormInput type="email"
                                                name={"email"}
                                                defaultValue={email}
                                                onChange={(e)=>setEmail(e.target.value)}
                                                aria-label="default input inline 1"/>
                                </div>
                                <div className={"col-span-12 text-left"}>
                                    <label className={"pb-2 text-sm"}>Department <span className="redclass">*</span></label>
                                    <TomSelect value={selecteddepartments} 
                                    name={"standard_services"}
                                    onChange={(v) => {
                                      setSelectedDepartments(v)
                                  }}
                                    options={{
                                                    placeholder: "Search Standard Services",
                                                  }} className="w-full" multiple>

                                    {departmentall.map((v:any, i:any) => (
                                      <option value={v.id}>{v.role}</option>
                                    ))}
                                      
                                  </TomSelect>
                                </div>
                                {/* <div className={"col-span-12 text-left"}>
                                    <label className={"pb-2 text-sm"}>Department</label>
                                    <TomSelect value={values.departments}
                                                onChange={(v) => {
                                                    setFieldValue("departments", v)
                                                }}
                                                options={{placeholder: "Select departments",}}
                                                className="w-full"
                                                multiple
                                                name={"departments"}
                                    >
                                        {
                                            //@ts-ignore
                                            departments && departments.map((dept, key) =>
                                                (<option key={key}
                                                          value={dept.id}>
                                                    {dept.role}
                                                </option>))
                                        }


                                    </TomSelect>
                                </div> */}
                                <div className={"col-span-12 text-left"}>
                                    <label className={"pb-2 text-sm"}>Password {editid == null?<span className="redclass">*</span>:''}</label>
                                    <FormInput type="password"
                                                name={"password"}
                                                defaultValue={password}
                                                onChange={(e)=>setPassword(e.target.value)}
                                                aria-label="default input inline 1"/>
                                </div>

                            </div>
                        </div>
                    </div>
                </Dialog.Description>
                <Dialog.Footer>
                    <Button type="button" variant="outline-secondary" onClick={()=> {
                        resetStates()
                        setAddDepartmentModal(false);
                        }}
                        className="w-20 mr-1 float-left"
                        >
                        Cancel
                    </Button>
                    <Button variant="primary" type="button" className="w-20" ref={sendButtonRef} onClick={()=>editid!=null?update_department():save_department()}>
                        Submit
                    </Button>
                </Dialog.Footer>
            </Dialog.Panel>
        </Dialog>
      </>
    );
  }
  
  export default Users;
  