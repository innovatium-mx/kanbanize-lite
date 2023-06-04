import { FC, useState } from "react"
import { NavigationBarItem } from "typescript"
import Image from "next/image"
import InterfaceDropdown from "./InterfaceDropdown"
import LanguageDropdown from "./LanguageDropdown"
import { boardCard } from "./Dashboard"
import Sidebar from "./Sidebar"
import navbar from '../styles/Navbar.module.css'
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { GetServerSideProps } from "next"
import Cookies from "cookies"
import {urlCloud} from '../constants'



type Props = {}

interface Data {
    workspace_id: number,
    type: number,
    is_archived: number,
    name: string,
    boards: Array<boardCard> | null
  }
  
    type NextJsI18NConfig = {
      defaultLocale: string
      domains?: {
        defaultLocale: string
        domain: string
        http?: true
        locales?: string[]
      }[]
      localeDetection?: false
      locales: string[]
    }
  
    interface PropsResponse {
      data : Array<Data>
      _nextI18Next : NextJsI18NConfig
    }

const Navbar = ({data} : PropsResponse) => {

    const [boards, setBoards] = useState<Array<boardCard> | null>([]);

    const getBoards = async (workspace_id: number) => {
        const workspaceSelected = data.find(item => item.workspace_id === workspace_id);
        workspaceSelected !== undefined && setBoards(workspaceSelected.boards);
    }

    return (
        <>
            <nav className={navbar.nav}>
                <div className={navbar.left}>
                    <Image src={"/../public/LogoKanbanize.png"}
                      width={64}
                      height={24} 
                      className={navbar.icon}/>
                    <InterfaceDropdown data={data} name={"WORKSPACE"} getData={getBoards} />
                </div>
                <div>
                    <Sidebar />
                </div>
            </nav>
        </>
    )
}


  
export default Navbar

