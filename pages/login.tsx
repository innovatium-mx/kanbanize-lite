import axios from "axios";
import { use, useState } from "react"


export default function Login() {

    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const login = () =>{
        axios({
            method: ""


        })



    }




    return (
        <div>
            <h1>Login</h1>

            <input type="text" name="username" placeholder="username" onChange={e => setLoginUsername(e.target.value)}></input>
            <input type="password" name="passwrd" placeholder="password" onChange={e => setLoginPassword(e.target.value)}></input>
            <button>Login</button>


        </div>
    )
}