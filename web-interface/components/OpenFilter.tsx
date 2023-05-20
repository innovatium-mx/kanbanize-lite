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
        setBoardUsers(users)
    }, [users]);
    
    return (
         <div className={CardFilter.open}>
            {
                boardUsers.map((element : user) => 
                    <div className={CardFilter.content}>
                        <div className={CardFilter.imagecontainer}>
                            <img src={element.avatar} className={CardFilter.image}/>
                        </div>
                        <div className={CardFilter.username}>
                            {element.username}
                        </div>
                        <div className={CardFilter.checkbox}>
                            <input type="checkbox" value={element.user_id}/>
                        </div>

                    </div>
                )
            }
        </div>
    );
};

export default OpenFilter;