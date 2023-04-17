import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from 'reactstrap'
import { useRouter } from 'next/router'

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

    console.log(data[0]);
    const router = useRouter();

    const [dropdown, setDropdown]=useState(false);

    const openCloseDropdown = () => {
        setDropdown(!dropdown);
    }

    const onToggleClick = (element: number) => {
        console.log(element);
        getBoards(element);
    }
    
    return(
        <>
        <Dropdown isOpen={dropdown} toggle={openCloseDropdown}  >
                    <DropdownToggle caret >WorkSpaces</DropdownToggle>

                    <DropdownMenu >
                        {data.map((element: any)=><DropdownItem key={element.key} value={element.workspace_id} onClick={() => onToggleClick(element.workspace_id)}>{element.name}</DropdownItem>)}
                    </DropdownMenu>

        </Dropdown>
        </>
    )
}
export default WorkspacesDropdown;


