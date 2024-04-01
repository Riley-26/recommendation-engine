import { Person } from '@mui/icons-material';
import {ThemeContext} from "../App";
import React, {FC, useContext} from 'react'
import { useNavigate } from 'react-router-dom';

const LoginButton:FC = () => {

    const navigate = useNavigate();
    const loggedContext:any = useContext(ThemeContext)!;
    
    const login = function(){
        if (loggedContext.loggedIn === true){
            navigate("/user");
        } else {
            navigate("/login");
        }
    }

    return (
        <div id='loginBtn' className='fixed bg-gray-800 bottom-5 right-5 w-28 h-28 border-2 border-indigo-200 rounded-full p-3 cursor-pointer transition-all hover:bg-indigo-200' onClick={() => login()}>
            <Person style={{width: "100%", height: "100%"}}/>
        </div>
    )
}

export default LoginButton;