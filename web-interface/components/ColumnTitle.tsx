import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import columntitle from '../styles/ColumnTitle.module.css';
import Filter from './Filter';

type user = {
    user_id: number,
    username: string,
    realname: string,
    avatar: string
}

type parent_columns = {
    parent_id: number,
    parent_name: string,
    parent_section: number,
    parent_position: number,
} 

type ColumnTitleProps = {
    name: string,
    left: boolean,
    right: boolean,
    color: string,
    returnResponse: any,
    parent_column_id: Array<parent_columns> | null,
    workflow_name: string,
    users: Array<user>
}

const ColumnTitle = ({name, left, right, color, returnResponse, parent_column_id, workflow_name, users} : ColumnTitleProps) => {
    var breadcrumb_trail = workflow_name;
    if(parent_column_id !== null){
        parent_column_id.map(function(element){
            breadcrumb_trail += '/' + element.parent_name;
        })
        breadcrumb_trail += '/' + name;
    }else {
        breadcrumb_trail += '/' + name;
    }
    const handleLeftClick = () => {
        returnResponse(-1);
    }

    const handleRightClick = () => {
        returnResponse(1);
    }

    return(
        <>
            <div className={columntitle.container} style={{ backgroundColor: color }}>
                <div className={columntitle.breadcrumb_trail}>{breadcrumb_trail}</div>
                <div className={columntitle.innercontainer}>
                    <div className={columntitle.buttons} onClick={() => handleLeftClick()}>
                        { left && 
                            <FontAwesomeIcon  icon={faAngleLeft} size="xl"/>
                        }
                    </div>
                    <div className={columntitle.title}>{name}</div>
                    <div className={columntitle.buttons} onClick={() => handleRightClick()}>
                        { right && 
                            <FontAwesomeIcon icon={faAngleRight} size="xl"/>
                        }
                    </div>
                </div>
                <div>
                    <Filter users={users} />
                </div>
            </div >
        </>
    )
}

export default ColumnTitle;