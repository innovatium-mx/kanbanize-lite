import { useState } from "react";
import { MultiSelectComponent, FilteringEventArgs } from '@syncfusion/ej2-react-dropdowns';
import CardFilter from '../styles/Filter.module.css';

type user = {
    user_id: number,
    username: string,
    realname: string,
    avatar: string
}


interface FilterProps {
    users : Array<user>
}

const Filter = ({users} : FilterProps) => {
    
    const handleClick = () =>{
        console.log(users);
    }

    return (
        <div onClick={handleClick}>
                <img src="/filter.png" width="32" height="32"/>
        </div>
    );
}

export default Filter;