import React, { use } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react';
import logo from "../assets/logo.png";   // direct import
import {useClerk,UserButton,useUser} from '@clerk/clerk-react'

const Navbar = () => {

    const navigate =useNavigate();
    const {user} =useUser();
    const {openSignIn} = useClerk();


    
  return (
    <div className='fixed h-22 z-5 w-full backdrop-blur-2xl flex 
    justify-between items-center py-2 px-4 sm:px-16
    xl:px-28'>
        <img src={logo} alt="logo" className='w-32  sm:w-44 cursor-pointer'
        onClick={()=> navigate('/home')}/>

        {
            user ? <UserButton/> :
            (
                <button
                onClick={openSignIn}
                className="relative inline-flex items-center justify-center p-[3px] 
                bg-gradient-to-tr from-[#af40ff] via-[#5b42f3] to-[#00ddeb]
                rounded-full shadow-[0_15px_30px_-5px_rgba(151,65,252,0.2)]
                transition-all duration-300 active:scale-90 focus:outline-none group">
                <span
               className="bg-[#05062d] text-white text-sm flex items-center gap-2 
               px-6 py-2 rounded-full transition-all duration-300 
               group-hover:bg-transparent">
                Get Started <ArrowRight className="w-4 h-4" />
             </span>
            </button>
            )
        }
    </div>
  )
}

export default Navbar
