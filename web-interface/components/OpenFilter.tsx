import { useState , useEffect} from "react";
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


const OpenFilter = ({users} : FilterProps) => {
    const [boardUsers, setBoardUsers] = useState<Array<user>>([])

    useEffect(()=>{
        //console.log(users)
        setBoardUsers(users)
    }, [users]);

    console.log(boardUsers)
    
    return (
         <div className={CardFilter.open}>
            {
                boardUsers.map((element : user) => <label>{element.username}</label>
                )
            }
        </div>
    );
};

export default OpenFilter;