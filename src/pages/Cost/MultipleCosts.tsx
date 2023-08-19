import React, { useEffect, useState, useRef } from "react";
import {Link, useNavigate, useLocation} from 'react-router-dom';
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
import LoadingIcon from "../../base-components/LoadingIcon";

function MultipleCosts() {
    const {getLoggedObject, setLoggedObject, isLoggedIn, checkLogin} = useAuth();
    const [loading, setLoading] = useState<any | null>(false);
    const navigate = useNavigate();
    const [addNewDept, setAddNewDept] = useState<any | null>(false)
    const [del, setDel] = useState<any | null>(false)
    const [departments, setDepartments] = useState<any | null>(null)
    const [selectedDept, setSelectedDept] = useState<any | null>(null)
    const [searchtext, setSearchText] = useState<any | null>(null)
    const [filtered, setFiltered] = useState(null)
    const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
    const [adddepertmentmodal, setAddDepartmentModal] = useState<any | null>(false)
    const deleteButtonRef = useRef(null);
    const sendButtonRef = useRef(null)
    const [departmentname, setDepartmentName] = useState<any | null>(null)
    const [price, setPrice] = useState<any | null>(null)
    const [editid, setEditID] = useState<any | null>(null)
    const [billtasks, setBillTasks] = useState<any | null>([])

    const params = useLocation();
    var po_number = 0;
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


    useEffect(() => {
        if(client_number == 0){
            navigate("/")
            return;
        }
        if(!departments){ getAllDisciplines() }
    }, [departments])

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
            setDepartments(data?.data);
            setFiltered(data?.data)
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
    
    const save_asa_data = async () =>{
        if(billtasks.length == 0){
            toast.info('Select atleast one cost to save.');
            return;
        }
     
        if(loading) return;
        const payload = {
            token:getLoggedObject()?.token,
            data:departments,
            checked:billtasks,
            client_number:client_number,
            proposal:proposal__
        }
      setLoading(true);
      const {isError, data} = await doPost(payload, 'save_asa_multiple_costs');
      if(isError) {
          toast.error('Something went wrong with server.');
          setLoading(false);
      }else{
          if (data.action == "success") {
            setLoading(false);
            toast.success("Costs information saved successfully!")
            if(proposal__ == 1){
                navigate("/new/quote/"+client_number, {state: {proposal: params.state?.proposal, version:version____}})
            } else {
                navigate("/send/client/"+client_number)
            }
          }
          else {
              setLoading(false);
              toast.error(data.error);
          }
      }
    }
    
    const update_data = (e:any, id:string, title_d:string) => {
        const newBranches = [...departments];
        const branchIndex = newBranches.findIndex(branch => branch.id === id);
        const branchToUpdate = newBranches[branchIndex];
        branchToUpdate[title_d] = e.target.value;
        setDepartments(newBranches);
        console.log(newBranches);
    };
  
  return (
    <>
      <h2 className="mt-10 text-lg font-medium intro-y">Multiple Cost Information</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
      {
        departments && 
        <div className="col-span-12 overflow-auto intro-y lg:overflow-visible">
            <div className="table_bg_custom col-span-12">
                <div className="overflow-x-auto sm:overflow-x-visible">
                    <div className="intro-y">
                        <div
                            className={clsx([
                            "transition duration-200 ease-in-out transform cursor-pointer inline-block sm:block border-b border-slate-200/60 dark:border-darkmode-400 font-medium",
                            "bg-white text-slate-800 dark:text-slate-300 dark:bg-darkmode-600"
                            ])}
                        >
                            <div className="flex px-5 py-3">
                            <div className="w-[8%]">
                                Bill
                            </div>
                            <div className="w-[30%]">
                                Name
                            </div>
                            <div className="w-[20%]">
                                Quantity
                            </div>
                            <div className="w-[20%]">
                                Cost
                            </div>
                            <div className="w-[20%]">
                                Calculated mark Up
                            </div>
                            <div className="w-[10%]">
                                Total
                            </div>
                               
                            </div>
                        </div>
                        </div>
                {departments.map((v:any, id:any) => (
                    <div key={v.id} className="intro-y">
                    <div
                        className={clsx([
                        "transition duration-200 ease-in-out transform cursor-pointer inline-block sm:block border-b border-slate-200/60 dark:border-darkmode-400",
                        "hover:scale-[1.002] hover:relative hover:z-20 hover:shadow-md hover:border-0 hover:rounded",
                        "bg-white text-slate-800 dark:text-slate-300 dark:bg-darkmode-600"
                        ])}
                    >
                        <div className="flex px-5 py-3 custom_multiple_input align-center">
                        <div className="w-[8%]">
                            <FormCheck.Input
                            className="flex-none border-slate-400 checked:border-primary"
                            type="checkbox"
                            checked={billtasks.includes(v.id as never)}
                            onChange={() => {do_update_tasks_checkbox(v.id)}}
                            />
                        </div>
                        <div className="w-[30%]">
                            {v.name}
                        </div>
                        
                        <div className="w-[20%]">
                                <FormInput 
                                    type="text"
                                    name="est_hrs"
                                    value={v.est_hrs}
                                    onChange={(e) => update_data(e, v.id, 'est_hrs')}
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
                        
                        <div className="w-[20%]">
                            <FormInput 
                                    type="text"
                                    name="price"
                                    value={v.price}
                                    onChange={(e) => update_data(e, v.id, 'price')}
                                    onKeyPress={(e) => {
                                        const keyCode = e.keyCode || e.which;
                                        const keyValue = String.fromCharCode(keyCode);
                                        const regex = /^[0-9\b.]+$/;
                                        if (!regex.test(keyValue)) {
                                            e.preventDefault();
                                        }
                                    }}
                                    aria-label="default input inline 1"
                                />
                        </div>
                        <div className="w-[20%]">
                                <FormInput 
                                    type="text"
                                    name="markup_cost"
                                    value={v.markup_cost}
                                    onChange={(e) => update_data(e, v.id, 'markup_cost')}
                                    onKeyPress={(e) => {
                                        const keyCode = e.keyCode || e.which;
                                        const keyValue = String.fromCharCode(keyCode);
                                        const regex = /^[0-9\b.]+$/;
                                        if (!regex.test(keyValue)) {
                                            e.preventDefault();
                                        }
                                    }}
                                    aria-label="default input inline 1"
                                />
                        </div>
                       
                        <div className="w-[10%]">
                            {/* {
                                (
                                    (
                                        (v.est_hrs * v.price) + parseFloat(v.markup_cost)
                                    ).toFixed(2)
                                )
                            } */}

                                    {
                                        (() => {
                                            const old_price = v.price;
                                            const taxRate = 1; // Assuming tax rate of 10%
                                            if(old_price != v.price){
                                                var single_price____:any = (v.price / v.est_hrs);
                                            } else {
                                                if(v.single_price == 0){
                                                    var single_price____:any = (v.price / v.est_hrs);
                                                } else {
                                                    var single_price____:any = (v.single_price);
                                                }
                                            }

                                            

                                            const single_price__ = (single_price____);

                                            // console.log(single_price__)
                                            
                                            // const totalPrice = (v.single_price * v.est_hrs) + parseFloat(v.markup_rate);
                                            const sub_total = (single_price__ * v.est_hrs);

                                            
                                            if(v.markup_type == 1){
                                                var markup_tax = (v.markup_cost/100);
                                                var markup_add:any = sub_total * markup_tax;
                                            } else if(v.markup_type == 2){
                                                var markup_add:any = (parseFloat(v.markup_cost));
                                            } else {
                                                if(v.markup_price != 0){
                                                    var markup_tax = (v.markup_cost/100);
                                                    var markup_add:any = sub_total * markup_tax;
                                                } else {
                                                    var markup_add:any = 0;
                                                }
                                            }

                                            const totalPrice =  (sub_total+markup_add);
                                            // const tax = 0;
                                            // const totalWithTax = (totalPrice + tax);

                                            return totalPrice;
                                        })()
                                    }
                        </div>
                       
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </div>
            <div className={"col-span-12 text-right mt-10"}>
                <div className="flex w-[100%] justify-end gap-5">
                
                    <Button type="button" onClick={()=> {
                            if(proposal_number==1){
                                navigate("/new/quote/"+client_number, {state: {proposal: params.state?.proposal, version:version____}})
                            } else {
                                navigate("/send/client/"+client_number)
                            }
                        }}
                        className="w-20 mr-1 float-left   w-[120px] text-primary"
                        >
                        Cancel
                    </Button>
                    <Button variant="primary" type="button" className="w-20  w-[120px]" ref={sendButtonRef} onClick={()=> save_asa_data()}>
                        {loading?<LoadingIcon icon="rings" className="w-8 h-5 whiteocolor" />:"Save"}
                    </Button>
                </div>
                </div>
        </div>

                
      }       
      </div>
      
      
    </>
  );
  }
  
  export default MultipleCosts;
  