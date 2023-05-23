import { FC, useState } from "react"
import { NavigationBarItem } from "typescript"
import Image from "next/image"
import InterfaceDropdown from "./InterfaceDropdown"
import LanguageDropdown from "./LanguageDropdown"
import { boardCard } from "./Dashboard"

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

const Navbar  = ({data}: PropsResponse) => {

    const [boards, setBoards] = useState<Array<boardCard> | null>([]);

    const workspaces = data;

    const getBoards = async (workspace_id : number) => {
        const workspaceSelected = workspaces.find(item => item.workspace_id === workspace_id);
        workspaceSelected !== undefined && setBoards(workspaceSelected.boards);
    }

        return (
            <>
            </>
        )
}

export default Navbar

