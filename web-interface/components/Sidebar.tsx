import React, { useState, useEffect, useRef } from "react";
import sidebar from '../styles/Sidebar.module.css'
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Swal from 'sweetalert2'
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faBars, faXmark } from "@fortawesome/free-solid-svg-icons";

const cookieCutter = require('cookie-cutter');

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
                router.replace({ pathname: '/' })
                cookieCutter.set('apikey', '', { expires: new Date(0) })
                cookieCutter.set('host', '', { expires: new Date(0) })
                cookieCutter.set('email', '', { expires: new Date(0) })
                cookieCutter.set('userid', '', { expires: new Date(0) })
                cookieCutter.set('avatar', '', { expires: new Date(0) })
                cookieCutter.set('username', '', { expires: new Date(0) })
                
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
            <div>
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
                                {<LanguageButton />}
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


        </div>
    );
}

export default Sidebar