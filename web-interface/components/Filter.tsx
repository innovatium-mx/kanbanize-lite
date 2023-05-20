import { useState } from "react";
import OpenFilter from './OpenFilter';
import CardFilter from '../styles/Filter.module.css';

type user = {
    user_id: number,
    username: string,
    realname: string,
    avatar: string
}


interface FilterProps {
    users : Array<user>,
    selected: Array<number>
}

const Filter = ({users, selected} : FilterProps) => {

    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <div className={CardFilter.filter}>
            <div onClick={() => setIsOpen(!isOpen)}>
                    <img src="/filter.png" width="32" height="32"/>
            </div>
            {
                isOpen && (
                   <OpenFilter users={users} selected={selected}/>
                )
            }
        </div>
    );
}

export default Filter;