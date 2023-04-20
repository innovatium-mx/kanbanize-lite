import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from 'reactstrap'
import { useRouter } from 'next/router'
import dashboard from '../styles/Dashboards.module.css';

interface workSpace {
    workspace_id: number,
    type: number,
    is_archived: number,
    name: string,
}

type card = {
    "card_id": number,
    "custom_id": number | null,
    "title": string,
    "owner_user_id": number | null,
    "owner_username": string | null,
    "owner_avatar": string | null,
    "type_id": number | null,
    "color": string,
    "section": number,
    "lane_id": number,
    "position": number
  }
  
type column = {
    "column_id": number,
    "section": number,
    "parent_column_id": number,
    "position": number,
    "name": string,
    "description": string,
    "color": string,
    "limit": number,
    "cards_per_row": number,
    "flow_type": number,
    "card_ordering": string | null,
    "cards": Array<card> | null
}
  
  
type workflow = {
    "type": number,
    "position": number,
    "is_enabled": number,
    "is_collapsible": number,
    "name": string,
    "workflow_id": number,
    "columns": Array<column> | null
}

interface DropdownProps {
    data : Array<workSpace> | Array<workflow>
    getData : any
    name : string
}

const InterfaceDropdown = ({data, getData, name} : DropdownProps) => {

    const router = useRouter();
    const [dropdown, setDropdown]=useState(false);

    const openCloseDropdown = () => {
        setDropdown(!dropdown);
    }

    const onToggleClick = (element: number) => {
            getData(element);    
    }
    
    return(
        <>
        <div className={dashboard.testing}>
            <Dropdown isOpen={dropdown} toggle={openCloseDropdown}  >
                        <DropdownToggle caret className={dashboard.workspaceStyle}>{name}</DropdownToggle>
                        <DropdownMenu >
                            {data.map((element: any)=><DropdownItem key={element.key} value={ element.workspace_id || element.workflow_id } onClick={() => onToggleClick(element.workspace_id || element.workflow_id )}>{element.name}</DropdownItem>)}
                        </DropdownMenu>
            </Dropdown>
        </div>
        </>
    )
}
export default InterfaceDropdown;


