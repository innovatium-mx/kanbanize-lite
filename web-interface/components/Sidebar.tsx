import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import sidebar from '../styles/Sidebar.module.css'
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Swal from 'sweetalert2'



const cookieCutter= require('cookie-cutter');

const Sidebar = () => {

    const router = useRouter();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const LanguageButton = dynamic(import('./LanguageDropdown'), {ssr:false});


  const ref: React.MutableRefObject<any> = useRef();
  const tooltipRef: React.MutableRefObject<any> = useRef();

  function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    setIsMenuOpen(!isMenuOpen);
  }

  function handleClickOutside(event: any) {
    if (
      ref.current &&
      !ref.current.contains(event.target) &&
      !tooltipRef.current.contains(event.target)
    ) {
      setIsMenuOpen(false);
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {

    Swal.fire({
        title: 'Confirm Logout',
        icon: 'question',
        confirmButtonText: 'Logout',
        showCancelButton: true,
        confirmButtonColor: '#42AD49'
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            
            cookieCutter.set('apikey', '', { expires: new Date(0) })
            cookieCutter.set('host', '', { expires: new Date(0) })
            cookieCutter.set('email', '', { expires: new Date(0) })
            cookieCutter.set('userid', '', { expires: new Date(0) }) 
            router.replace({pathname: '/'}).then( () => {
                Swal.fire('Logged Out!', '', 'success')
            });
        } 
      })

    
    

  }

  return (
    <nav>
        <ul className={sidebar.list}>
            <li>
                <LanguageButton/>
            </li>
            <li>
                <button className={sidebar.button} onClick={handleLogout}>
                    Logout
                </button>
            </li>

        </ul>
    </nav>
  );
}

export default Sidebar