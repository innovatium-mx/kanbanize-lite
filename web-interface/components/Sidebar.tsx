import React, { useState, useEffect, useRef } from "react";
import sidebar from '../styles/Sidebar.module.css'
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Swal from 'sweetalert2'
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faBars, faXmark } from "@fortawesome/free-solid-svg-icons";



const cookieCutter = require('cookie-cutter');

const menuItems = ["op1", "op2", "op3"]

const Sidebar = () => {

    const router = useRouter();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const LanguageButton = dynamic(import('./LanguageDropdown'), { ssr: false });


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

            if (result.isConfirmed) {

                cookieCutter.set('apikey', '', { expires: new Date(0) })
                cookieCutter.set('host', '', { expires: new Date(0) })
                cookieCutter.set('email', '', { expires: new Date(0) })
                cookieCutter.set('userid', '', { expires: new Date(0) })
                router.replace({ pathname: '/' })
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                    })
                    
                    Toast.fire({
                    icon: 'success',
                    title: "Logged Out"
                    })
            }
        })
    }

    return (
        <div className={sidebar.navItems}>
            <ul className={sidebar.list}>
                <li>
                    <Link href={"/dashboard"} >
                        <span className={sidebar.workspaces}>Workspaces</span>
                    </Link>
                </li>
                <li>
                    <LanguageButton />
                </li>
                <li>
                    <button className={sidebar.button} onClick={handleLogout}>
                        <FontAwesomeIcon icon={faArrowRightFromBracket} className={sidebar.icon} />
                        Logout
                    </button>
                </li>
            </ul>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} ref={tooltipRef} className={sidebar.buttonMenu}>
                {isMenuOpen ? (<FontAwesomeIcon icon={faXmark} size="xl" />) : (<FontAwesomeIcon icon={faBars} size="xl" />)}
            </button>

            {isMenuOpen && (
                <div
                    className={sidebar.menuPanel}
                    ref={ref}
                >
                    <ul className={sidebar.listPanel}>
                        <li>
                            <Link href={"/dashboard"} >
                                <span className={sidebar.workspaces}>Workspaces</span>
                            </Link>
                        </li>
                        <li>
                            <LanguageButton />
                        </li>
                        <li>
                            <button className={sidebar.buttonPanel} onClick={handleLogout}>
                                <FontAwesomeIcon icon={faArrowRightFromBracket} className={sidebar.icon} />
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            )}


        </div>
    );
}

export default Sidebar

/*

"use client";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

import { menuItems, menuItem } from "@/constants";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  return (
    <nav className="absolute top-5 left-0 right-0 w-full px-5 z-20">
      <div className=" justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8">
        <div className=" flex items-center justify-between py-3 md:block">
          <Link href={"/"} className="">
            <Image
              src={"/images/icons/favicon-32x32.png"}
              alt="LiberIK Logo"
              width={44}
              height={44}
            />
          </Link>
          <div className=" md:hidden">
            <button
              className="outline-none p-2 rounded-full focus:border-gray-400 bg-slate-900 bg-opacity-50 focus:border
              hover:bg-opacity-70 active:bg-opacity-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              ref={tooltipRef}
            >
              {isMenuOpen ? (
                <Image
                  className="focus:border-none active:border-none opacity-50"
                  src={"/images/icons/x.svg"}
                  alt="Close Icon"
                  width={24}
                  height={24}
                />
              ) : (
                <Image
                  className="focus:border-none active:border-none opacity-80"
                  src={"/images/icons/hamburger.svg"}
                  alt="Menu Icon"
                  width={24}
                  height={24}
                />
              )}
            </button>
          </div>
        </div>
        {/Card for when menu is open on small screens/}
        {isMenuOpen && (
          <div
            className=" w-72 h-auto rounded-2xl absolute top-16 right-5 flex flex-col items-center p-4 gap-4 bg-slate-900
           shadow-xl backdrop-blur-xl bg-opacity-30 md:hidden"
            ref={ref}
          >
            <ul className=" flex flex-col items-start p-0 w-56 h-auto gap-1 m-6">
              {menuItems.map((item: menuItem) => (
                <li
                  key={item.name}
                  className=" box-border flex flex-col w-full items-start gap-3 bg-zinc-800 bg-opacity-20
                     mix-blend-normal bg-blend-overlay rounded-md border-white border-opacity-20
                      border-[1px] hover:border-opacity-100 hover:bg-opacity-40 "
                >
                  <Link
                    className="text-md text-white font-normal p-2 w-full h-full text-left"
                    href={item.path}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {/Items for medium and large screens/}
        <div className="hidden flex-1 justify-self-center  md:block">
          <ul className="h-auto items-center justify-start flex px-8">
            {menuItems.map((item: menuItem) => (
              <li
                key={item.name}
                className="text-md text-white py-2 text-center px-4 border-b-0
                hover:border-b-2 hover:border-white hover:border-opacity-60"
              >
                <Link
                  href={item.path}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

*/