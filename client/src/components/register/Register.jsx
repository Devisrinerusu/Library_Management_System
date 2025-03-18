import React from 'react'
import './Register.css'
import { useForm } from 'react-hook-form'
import { useState,useEffe } from 'react'
import { useNavigate ,Link} from 'react-router-dom'
import { userLoginContext } from '../../contexts/userLoginContext'
import { useContext } from 'react'


function Register() {
  
  let {register,handleSubmit,formState:{errors}}=useForm()
  let [err, setErr] = useState('');
  //const {fetchUsers}=useContext(UserLoginContext);


  let navigate=useNavigate();

  async function handleFormSubmit(userCred) {
        try {
            let res = await fetch('http://localhost:5000/users-api/register', {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(userCred),
            });
    
            let data = await res.json();
    
            if (res.status === 400) {
                setErr(data.message); // Display error message if user exists
            } else if (res.status === 201) {
                navigate('/login'); // Redirect on successful registration
            }
        } catch (error) {
            console.error("Error during registration:", error);
            setErr("Something went wrong. Please try again.");
        }
    }
    


  return (
    <div className="pageregister">
   <div className="register">
    <div className="container registerpage">

    {err.length !== 0 && <p className='fs-4 text-danger text-center'>{err}</p>}

    <div className="registercard">
      <form action="" className='signup' onSubmit={handleSubmit(handleFormSubmit)}>
        <p className='text-center'>Join The BooksNest!!</p>

        <div className="mb-2">
               <label htmlFor="username" className='form-label' ></label>
                <input type="text" id='username' className='form-control' {...register("username", { required: true, minLength: 4 ,validate: (value) => !/\s/.test(value)|| "Username should not contain spaces"})} placeholder='Username' />
                {errors.username?.type === "required" && <p className="text-danger lead">*Username is required</p>}
                {errors.username?.type === "minLength" && <p className="text-danger lead">*Min Length should be 4</p>}
                {errors.username?.message && <p className="text-danger lead">{errors.username.message}</p>}
         </div>

         <div className="mb-2">
                <label htmlFor="email" className='form-label'></label>
                <input type="email" id='email' className='form-control' {...register("email", { required: true })} placeholder='Email'/>
                {errors.email?.type === 'required' && <p className='text-danger lead'>*Email is required</p>}
        </div>

        <div className="mb-2">
                <label htmlFor="rollNo" className='form-label'></label>
                <input type="text" id='rollNo' className='form-control' {...register("rollNo", { required: true })} placeholder='Register Number'/>
                {errors.rollNo?.type === 'required' && <p className='text-danger lead'>*Register Number is required</p>}
        </div>

        <div className="mb-2">
                <label htmlFor="branch" className='form-label'></label>
                <input type="text" id='branch' className='form-control' {...register("branch", { required: true })} placeholder='Branch'/>
                {errors.branch?.type === 'required' && <p className='text-danger lead'>*Branch is required</p>}
        </div>

        <div className="mb-2">
                <label htmlFor="password" className='form-label'></label>
                <input type="password" id='password' className='form-control' {...register("password", { required: true })} placeholder='Password' />
                {errors.password?.type === 'required' && <p className='text-danger lead'>*Password is required</p>}
        </div>

        <div className="mb-2">
                <label htmlFor="mobile" className='form-label'></label>
                <input type="text" id='mobile' className='form-control' {...register("mobile", { required: true, minLength: 10, maxLength: 10 })} placeholder='Mobile number' />
                {errors.mobile?.type === 'required' && <p className='text-danger lead'>*Mobile Number is required</p>}
                {errors.mobile?.type === 'minLength' && <p className='text-danger lead'>*Length should be 10</p>}
                {errors.mobile?.type === 'maxLength' && <p className='text-danger lead'>*Length should be 10</p>}
        </div>
        
        <div className='text-center'>
                <button className="btn1 text-white" type="submit">Join</button>
        </div>
 
      </form>
     </div>
    </div>
   </div>
   </div>
  )
}

export default Register