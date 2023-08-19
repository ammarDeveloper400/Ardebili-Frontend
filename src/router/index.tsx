import { useRoutes, useNavigate } from "react-router-dom";
import React, {useEffect} from "react";
import {doPost} from "../utils/apiCalls";
import AuthLoading from "../pages/AuthLoading";
import AsaRequests from "../pages/AsaRequests";
import Departments from "../pages/Departments";
import Login from "../pages/Login";
import useAuth from "../hooks/useAuth";
import Profile from "../pages/Profile";
import Users from "../pages/Users";
import Discipline from "../pages/Discipline";
import Proposals from "../pages/Proposals";
import StandardServices from "../pages/StandardServices";
import SideMenu from "../layouts/SideMenu";
import SideMenuSmall from "../layouts/SideMenuSmall";
import Logout from "../pages/Logout";
import SimpleMenu from "../layouts/SimpleMenu";
import TopMenu from "../layouts/TopMenu";
import AsaArchived from "../pages/AsaArchived";
import SendClient from "../pages/AsaRequests/SendClient";
import NewTask from "../pages/StandardServices/NewTask";
import Cost from "../pages/Cost";
import NewCost from "../pages/Cost/NewTask";
import MultipleTasks from "../pages/StandardServices/MultipleTasks";
import MultipleCosts from "../pages/Cost/MultipleCosts";
import Quote from "../pages/Quote";
import NewQuote from "../pages/Quote/SendClient";
import NewQuoteInfo from "../pages/Quote/ViewQuote";
import ViewPDF from "../pages/AsaRequests/ViewPDF";
import QuotePDF from "../pages/Quote/ViewPDF";

function Router() {
  const {getLoggedObject, setLoggedObject, isLoggedIn, checkLogin} = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
      setColorSchemeClass();
    //   handleLogin();
      setInterval(() => {
        handleLogin();
      }, 5000);
      
  }, [])

  const handleLogin = async () => {
    const prev = localStorage.getItem("ArdibiliAuth") || null;
    let token_data = JSON.parse(prev!);
    const payLoad = {token:token_data?.token};
    const {isError, data} = await doPost(payLoad, 'check_login');
    if(data.error == "Invalid login credentials"){
        localStorage.removeItem("ArdibiliAuth");
        setLoggedObject(null);
        navigate('/login', {replace: true});
    }
    
  }
  const setColorSchemeClass = () => {
      const el = document.querySelectorAll("html")[0];
      el.setAttribute("class", "theme-2");
  };

    const prev = localStorage.getItem("ArdibiliAuth");
    const prevObj = prev ? JSON.parse(prev) : null;
    const  department = prevObj?.departement || 0;
    const SHOWMENU = department==0?<SideMenuSmall/>:<SideMenu />

  const authRoutes = [
    {
        path: "/",
        element: SHOWMENU,
        children: [
            {
                path: "/",
                element: <AsaRequests/>,
            },
            {
                path: "/view/pdf/:slug",
                element: <ViewPDF/>,
            },
            {
                path: "/send/client/:slug",
                element: <SendClient/>,
            },
            {
                path: "/archive",
                element: <AsaArchived/>,
            },
            {
                path: "/profile",
                element: <Profile/>,
            },
            {
                path: "/users",
                element: <Users/>,
            },
            {
                path: "/proposals",
                element: <Proposals/>,
            },
            {
                path: "/departments",
                element: <Departments/>,
            },
            {
                path: "/discipiline",
                element: <Discipline/>,
            },
            {
                path: "/services",
                element: <StandardServices/>,
            },
            {
                path: "/new/task/:slug",
                element: <NewTask/>,
            },
            {
                path: "/multiple/tasks",
                element: <MultipleTasks/>,
            },
            
            {
                path: "/costs",
                element: <Cost/>,
            },
            {
                path: "/new/cost/:slug",
                element: <NewCost/>,
            },
            {
                path: "/multiple/cost",
                element: <MultipleCosts/>,
            },
            {
                path: "/quotes",
                element: <Quote/>,
            },
            {
                path: "/new/quote/:slug",
                element: <NewQuote/>,
            },
            {
                path: "/quote/information/:slug",
                element: <NewQuoteInfo/>,
            },
            {
                path: "/quote/pdf/:slug",
                element: <QuotePDF/>,
            },
        ],
    },
    {
        path: "/logout",
        element: <Logout/>,
    },
    {path: "/login", element: <Login/>}

];


  const unAuthRoutes = [{path: "/", element: <AuthLoading/>},{path: "/login", element: <Login/>}];
  const routes = isLoggedIn ? authRoutes : unAuthRoutes;
  // const routes = unAuthRoutes;
  return useRoutes(routes);
}

export default Router;
