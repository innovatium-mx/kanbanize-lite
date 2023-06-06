import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import columntitle from '../styles/ColumnTitle.module.css';
import Filter from './Filter';
import OpenFilter from './OpenFilter';
import { ColumnTitleProps } from '../types/types';


const ColumnTitle = ({name, left, right, color, returnResponse, parent_column_id, workflow_name, users, selected, setFilter, filterSelectAll} : ColumnTitleProps) => {
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
        <div className={columntitle.container} style={{ backgroundColor: color }}>
            <div className={columntitle.grid}>
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
            </div>
            <Filter  filterSelectAll={filterSelectAll} users={users} selected={selected} setFilter={setFilter}/>
        </div >
    )
}

export default ColumnTitle;