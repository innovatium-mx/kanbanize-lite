import { useState , useEffect} from "react";
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


const OpenFilter = ({users, selected} : FilterProps) => {

    const [selectedFilter, setSelectedFilter] = useState<Array<number>>([])

    useEffect(()=>{
        setSelectedFilter(selected);
    });

    return (
         <div className={CardFilter.open}>
            {
                users.map((element : any) => 
                    <div className={CardFilter.content} key={element.key}>
                        <div className={CardFilter.imagecontainer}>
                            <img src={element.avatar} className={CardFilter.image}/>
                        </div>
                        <div className={CardFilter.username}>
                            {element.username}
                        </div>
                        <div className={CardFilter.checkbox}>
                            {
                                selectedFilter.find(item => item === element.user_id) !== undefined ?
                                <input type="checkbox" value={element.user_id} defaultChecked={true}/> : <input type="checkbox" value={element.user_id}/>
                            }
                        </div>

                    </div>
                )
            }
        </div>
    );
};

export default OpenFilter;