import { FC, useState } from "react"
import { NavigationBarItem } from "typescript"
import Image from "next/image"
import InterfaceDropdown from "./InterfaceDropdown"
import LanguageDropdown from "./LanguageDropdown"
import { boardCard } from "./Dashboard"
import Sidebar from "./Sidebar"
import navbar from '../styles/Navbar.module.css'


  


const Navbar  = () => {

        return (
            <>
                <nav className={navbar.nav}>
                    <div className={navbar.left}>
                        <p>Logo</p>
                        <p>Dropdown</p>
                    </div>
                    <div>
                        <Sidebar/>
                    </div>
                </nav>
            </>
        )
}

export default Navbar

