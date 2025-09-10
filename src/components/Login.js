import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';



const Login = (props) => {
    const [credentials, setCredentials] = useState({email:"", password:""});
    const [password, setpassword] = useState("");
    let navigate=useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({email:credentials.email,password:credentials.password})

        });
        const json = await response.json();
        if(json.success){
            //Save the authtoken and redirect
            localStorage.setItem('token',json.authToken);
            props.showAlert("Logged in Successfully","success");
            navigate("/");
        }
        else{
            props.showAlert("Invalid Credentials","danger");
        }
    }
    const onChange=(e)=>{
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }
    return (
        <div className='mt-3'>
        <h2>Login to continue to My-Notes</h2>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" value={credentials.email} onChange={onChange} placeholder="Enter email" />
                <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" className="form-control" id="password" name="password" value={credentials.password} onChange={onChange} placeholder="Password" />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
        </div>
    )
}

export default Login