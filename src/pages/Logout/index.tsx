import React, { useEffect, useState } from "react";
import {Link, useNavigate} from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from "../../hooks/useAuth";
import { doPost } from "../../utils/apiCalls";
import { validateEmail } from "../../utils/functions";

import logoUrl from "../../assets/images/logo_main.png";
import logoWhite from "../../assets/images/logo_white.png";
import illustrationUrl from "../../assets/images/illustration.svg";
import { FormInput, FormCheck } from "../../base-components/Form";
import Button from "../../base-components/Button";
import clsx from "clsx";

function Logout() {
  const {getLoggedObject, setLoggedObject, isLoggedIn, checkLogin} = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const do_login_acion = async () => {
    localStorage.removeItem("ArdibiliAuth");
    setLoggedObject(null);
    navigate('/login');
          // window.location.reload();
    // navigate('/');
  }


  return (
    <>
      <div className="mycustom_fix">
        <div className="inner_custom_fix">
          <b>
            Confirm Logout?
          </b>
      <div className="flex">
          <Button
                    variant="secondary"
                    className="w-full px-4 py-3 align-top xl:w-32 xl:mr-3 mr-3"
                    onClick={()=>navigate("/")}
                  >
                    Cancel
                  </Button>

          <Button
                    variant="danger"
                    className="w-full px-4 py-3 align-top xl:w-32 xl:mr-3"
                    onClick={do_login_acion}
                  >
                    Logout
                  </Button>
      </div>
        </div>
      </div>
    </>
  );
}

export default Logout;
