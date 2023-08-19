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
import { replaceNode } from "tom-select/src/vanilla";
import DataTable from "react-data-table-component";
import { Dialog, Menu } from "../../base-components/Headless";
import Table from "../../base-components/Table";

function Discipline() {
    const {getLoggedObject, setLoggedObject, isLoggedIn, checkLogin} = useAuth();
    const [loading, setLoading] = useState<any | null>(false);
    const navigate = useNavigate();
    const [addNewDept, setAddNewDept] = useState<any | null>(false)
    const [del, setDel] = useState<any | null>(false)
    const [departments, setDepartments] = useState<any | null>(null)
    const [selectedDept, setSelectedDept] = useState<any | null>(null)
    const [searchtext, setSearchText] = useState<any | null>(null)
    const [filtered, setFiltered] = useState<any | null>(null)
    const [deleteConfirmationModal, setDeleteConfirmationModal] = useState<any | null>(false);
    const [adddepertmentmodal, setAddDepartmentModal] = useState<any | null>(false)
    const deleteButtonRef = useRef<any | null>(null);
    const sendButtonRef = useRef<any | null>(null)
    const [departmentname, setDepartmentName] = useState<any | null>(null)
    const [price, setPrice] = useState<any | null>(null)
    const [editid, setEditID] = useState<any | null>(null)

    useEffect(() => {
        if(!departments){ getAllDisciplines() }
    }, [departments])

    const getAllDisciplines = async () => {
      const payload = {
        token:getLoggedObject()?.token,
      }
      setLoading(true);
      const {isError, data} = await doPost(payload, 'get_all_disciplines');
      setLoading(false);
      if(isError) {
          toast.error('Something went wrong with server.');
          setLoading(false);
      }else{
          if (data.action == "success") {
            setLoading(false);
            setDepartments(data?.data);
            setFiltered(data?.data)
          }
          else {
              setLoading(false);
              toast.error(data.error);
          }
      }
    }
    
    const save_department = async () =>{
      if(loading) return;
      const payload = {
        token:getLoggedObject()?.token,
        name:departmentname,
        price:price
      }
      setLoading(true);
      const {isError, data} = await doPost(payload, 'add_new_discipline');
      if(isError) {
          toast.error('Something went wrong with server.');
          setLoading(false);
      }else{
          if (data.action == "success") {
            setLoading(false);
            setDepartmentName(null)
            setPrice(null)
            setAddDepartmentModal(false)
            toast.success("New Discipline added successfully!")
            getAllDisciplines()
          }
          else {
              setLoading(false);
              toast.error(data.error);
          }
      }
    }
    const update_discipline = async () =>{
      if(loading) return;
      const payload = {
        token:getLoggedObject()?.token,
        name:departmentname,
        price:price,
        id:editid
      }
      setLoading(true);
      const {isError, data} = await doPost(payload, 'update_discipline');
      if(isError) {
          toast.error('Something went wrong with server.');
          setLoading(false);
      }else{
          if (data.action == "success") {
            setLoading(false);
            setDepartmentName(null)
            setPrice(null)
            setEditID(null)
            setAddDepartmentModal(false)
            toast.success("Discipline information updated successfully!")
            getAllDisciplines()
          }
          else {
              setLoading(false);
              toast.error(data.error);
          }
      }
    }
    const delete_department = async () =>{
      const payload = {
        token:getLoggedObject()?.token,
        id:del
      }
      setLoading(true);
      const {isError, data} = await doPost(payload, 'delete_discipline');
      setLoading(false);
      if(isError) {
          toast.error('Something went wrong with server.');
          setLoading(false);
      }else{
          if (data.action == "success") {
            setDeleteConfirmationModal(false)
            setLoading(false);
            toast.info("Discipline Deleted successfully!")
            getAllDisciplines()
          }
          else {
              setLoading(false);
              toast.error(data.error);
          }
      }
    }

    const get_discipline_update = async (val:any) => {
      if(loading) return;
      const payload = {
        token:getLoggedObject()?.token,
        id:val,
      }
      setLoading(true);
      const {isError, data} = await doPost(payload, 'get_specific_discipline');
      if(isError) {
          toast.error('Something went wrong with server.');
          setLoading(false);
      }else{
          if (data.action == "success") {
            setLoading(false);
            setEditID(val);
            setDepartmentName(data?.data.name);
            setPrice(data?.data.price);
            setAddDepartmentModal(true);
          }
          else {
              setLoading(false);
              toast.error(data.error);
          }
      }
    }

    const HandleSearch = async (val:any) => {
      setSearchText(val);
      let q = val;
      if (departments) {
          if (q){
              // @ts-ignore
              let results = departments.filter((item) => {
                  return item.name !== null && item.name.toLowerCase().includes(q.toLowerCase());
              })
              setDepartments(results)
          }else{
              setDepartments(filtered)
          }
      }
  }
  const resetStates =  async () => {
    setDepartmentName(null)
    setPrice(null)
  }
  
  return (
    <>
      <h2 className="mt-10 text-lg font-medium intro-y">All Disciplines</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
          <Button variant="primary" className="mr-2 shadow-md" onClick={(event: React.MouseEvent)=> {
              event.preventDefault();
              setEditID(null)
              setAddDepartmentModal(true);
            }}>
            Add New Discipline
          </Button>
        
          <div className="hidden mx-auto md:block text-slate-500">
          </div>
          <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
            <div className="relative w-56 text-slate-500">
              <FormInput
                type="text"
                className="w-56 pr-10 !box"
                placeholder="Search..."
                defaultValue={searchtext}
                onChange={(e)=>HandleSearch(e.target.value)}
              />
              <Lucide
                icon="Search"
                className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
              />
            </div>
          </div>
        </div>
      {
        departments && 
        <div className="col-span-12 overflow-auto intro-y lg:overflow-visible">
          <Table className="border-spacing-y-[10px] border-separate -mt-2">
            <Table.Thead>
              <Table.Tr>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  Discipline Name
                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  Price/hr
                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  Action
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              
              {
                departments.length == 0 &&
                (
                  <Table.Tr className="intro-x">
                  <Table.Td colSpan={3}>
                    <div className="bg-[#fff] bg-white border p-5 text-center">
                      No Record found.
                    </div>
                  </Table.Td>
                  
                  </Table.Tr>
                )
              }
              {departments.map((v:any, i:any) => (
                <Table.Tr key={i} className="intro-x">
                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    <a className="font-medium whitespace-nowrap">
                      {v.name}
                    </a>
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    <div className="font-medium whitespace-nowrap">
                      {v.price}
                    </div>
                  </Table.Td>
                  
                  <Table.Td className="first:rounded-l-md last:rounded-r-md w-56 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                    <div className="flex items-center justify-center">
                      
                    <Button variant="primary" className="mr-2 shadow-md"
                            onClick={(event: React.MouseEvent)=> {
                              event.preventDefault();
                              get_discipline_update(v.id);
                      }}
                    >
                      <Lucide icon="Pencil" className="w-4 h-4 mr-1" /> Edit
                    </Button>
                      {/* <a
                        className="flex items-center mr-2"
                        href="#"
                        onClick={(event) => {
                          event.preventDefault();
                          get_discipline_update(v.id);
                        }}
                      >
                        <Lucide icon="Pencil" className="w-4 h-4 mr-1" /> Edit
                      </a> */}
                      {/* <a
                        className="flex items-center text-danger"
                        href="#"
                        onClick={(event) => {
                          event.preventDefault();
                          setDel(v.id)
                          setDeleteConfirmationModal(true);
                        }}
                      >
                        <Lucide icon="Trash2" className="w-4 h-4" /> Delete
                      </a> */}

                      <Button variant="danger" className="mr-2 shadow-md"
                            onClick={(event: React.MouseEvent)=> {
                              event.preventDefault();
                              setDel(v.id)
                              setDeleteConfirmationModal(true);
                      }}
                    >
                      <Lucide icon="Trash2" className="w-4 h-4 mr-1" /> Delete
                    </Button>

                    </div>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
      }       
      </div>
      {/* BEGIN: Delete Confirmation Modal */}
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
              Do you really want to delete this discipline? <br />
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
              {/* BEGIN: Modal Content */}
        <Dialog staticBackdrop  open={adddepertmentmodal} 
        
        onClose={()=> {
            setAddDepartmentModal(false);
            }}
            initialFocus={sendButtonRef}
            >
            <Dialog.Panel>
                <Dialog.Title>
                    <h2 className="mr-auto text-base font-medium">
                        {editid!=null?"Update Discipline":"Add New Discipline"}
                    </h2>
                </Dialog.Title>
                <Dialog.Description className="grid grid-cols-12 gap-4 gap-y-3">
                    <div className="col-span-12">
                        <FormLabel htmlFor="modal-form-1">
                          Discipline Name <span className="redclass">*</span>
                        </FormLabel>
                        <FormInput 
                          id="modal-form-1" 
                          type="text" 
                          placeholder="" 
                          required={true}
                          defaultValue={departmentname}
                          onChange={(e)=>setDepartmentName(e.target.value)}
                          />
                    </div>
                    <div className="col-span-12">
                        <FormLabel htmlFor="modal-form-1">
                          Price/hr <span className="redclass">*</span>
                        </FormLabel>
                        <FormInput 
                          id="modal-form-1" 
                          type="number" 
                          placeholder="" 
                          required={true}
                          defaultValue={price}
                          onChange={(e)=>setPrice(e.target.value)}
                          />
                    </div>
                   
                </Dialog.Description>
                <Dialog.Footer>
                    <Button type="button" variant="outline-secondary" onClick={()=> {
                      setEditID(null)
                        resetStates()
                        setAddDepartmentModal(false);
                        }}
                        className="w-20 mr-1 float-left"
                        >
                        Cancel
                    </Button>
                    <Button variant="primary" type="button" className="w-20" ref={sendButtonRef} onClick={()=> editid==null?save_department():update_discipline()}>
                        {editid==null?"Add":"Update"}
                    </Button>
                </Dialog.Footer>
            </Dialog.Panel>
        </Dialog>
    </>
  );
  }
  
  export default Discipline;
  