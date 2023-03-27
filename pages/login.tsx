import axios from "axios";
import login from '../styles/Login.module.css'
import { use, useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faCircleCheck, faTimesCircle } from '@fortawesome/free-solid-svg-icons';



export default function Login() {

    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const loginPost = () =>{
        axios({
            method: ""


        })

    }

    return (
        <>
        <div className={login.grid}>
            <header className="login.header">
                <h1>Login</h1>
            </header>

            <form className={login.form}>
                <input type="text" name="username" placeholder="username" onChange={e => setLoginUsername(e.target.value)}></input>
                <input type="password" name="passwrd" placeholder="password" onChange={e => setLoginPassword(e.target.value)}></input>
                <button>Login</button>
            </form>



        </div>
        </>
    )
}