import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from 'reactstrap'
import { useRouter } from 'next/router'
import dashboard from '../styles/Dashboards.module.css';
import { DropdownProps } from '../types/types';


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
        <div>
            <Dropdown isOpen={dropdown} toggle={openCloseDropdown}  >
                        <DropdownToggle caret className={dashboard.workspaceStyle}>{name}</DropdownToggle>
                        <DropdownMenu className={dashboard.menuOptions}>
                            {data.map((element: any)=> (element.type === 0 || element.type === 1) && <DropdownItem className={dashboard.item} key={element.key} value={ element.workspace_id || element.workflow_id } onClick={() => onToggleClick(element.workspace_id || element.workflow_id )}>{element.name}</DropdownItem>)}
                        </DropdownMenu>
            </Dropdown>
        </div>
        </>
    )
}
export default InterfaceDropdown;


