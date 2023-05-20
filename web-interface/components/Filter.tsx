import { useState } from "react";
import OpenFilter from './OpenFilter';
import CardFilter from '../styles/Filter.module.css';

type selection = {
    user_id: number | null,
    checked: boolean
}

type user = {
    user_id: number | null,
    username: string,
    realname: string,
    avatar: string
}


interface FilterProps {
    users : Array<user>,
    selected: Array<selection>,
    setFilter: any
}

const Filter = ({users, selected, setFilter} : FilterProps) => {

    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <div className={CardFilter.filter}>
            <div onClick={() => setIsOpen(!isOpen)}>
                    <img src="/filter.png" width="32" height="32"/>
            </div>
            {
                isOpen && (
                   <OpenFilter users={users} selected={selected} setFilter={setFilter}/>
                )
            }
        </div>
    );
}

export default Filter;