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

interface response {
    data : Array<workSpace>
    getBoards : any
}

const WorkspacesDropdown = ({data, getBoards} : response) => {

    const router = useRouter();

    const [dropdown, setDropdown]=useState(false);
    
    //const [decoy, setDecoy]=useState(0);

    const openCloseDropdown = () => {
        setDropdown(!dropdown);
        //setDecoy(1);
    }

    const onToggleClick = (element: number) => {
            getBoards(element);    
    }
    
    return(
        <>
        <div className={dashboard.testing}>
            <Dropdown isOpen={dropdown} toggle={openCloseDropdown}  >
                        <DropdownToggle caret className={dashboard.workspaceStyle}>WorkSpaces</DropdownToggle>
                        <DropdownMenu >
                            {data.map((element: any)=><DropdownItem key={element.key} value={element.workspace_id} onClick={() => onToggleClick(element.workspace_id)}>{element.name}</DropdownItem>)}
                        </DropdownMenu>
            </Dropdown>
        </div>
        </>
    )
}
export default WorkspacesDropdown;


