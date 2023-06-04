import { useState, useEffect, useRef} from "react";
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

    const ref: React.MutableRefObject<any> = useRef();
    const tooltipRef: React.MutableRefObject<any> = useRef();

    function handleClickOutside(event: any) {
        if (
            ref.current &&
            !ref.current.contains(event.target) &&
            !tooltipRef.current.contains(event.target)
        ) {
            setIsOpen(false);
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    
    return (
        <div className={CardFilter.filter}>
            <div onClick={() => setIsOpen(!isOpen)} ref={tooltipRef}>
                    <img src="/filter.png" width="32" height="32"/>
            </div>
            {
                isOpen && (
                    <div ref={ref}>
                        <OpenFilter  users={users} selected={selected} setFilter={setFilter}/>
                    </div>
                )
            }
        </div>
    );
}

export default Filter;