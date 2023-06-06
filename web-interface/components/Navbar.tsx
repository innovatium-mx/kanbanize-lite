import { FC, useState } from "react"
import { NavigationBarItem } from "typescript"
import Image from "next/image"
import InterfaceDropdown from "./InterfaceDropdown"
import { boardCard } from "../types/types"
import Sidebar from "./Sidebar"
import navbar from '../styles/Navbar.module.css'
import { NextJsI18NConfig, NavBarData} from "../types/types"

type Props = {}
  
  interface PropsResponse {
    data : Array<NavBarData>
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

