import { useState , useEffect} from "react";
import CardFilter from '../styles/Filter.module.css';

type selection = {
    user_id: number,
    checked: boolean
}

type user = {
    user_id: number,
    username: string,
    realname: string,
    avatar: string
}

interface FilterProps {
    users : Array<user>,
    selected: Array<selection>,
    setFilter: any
}


const OpenFilter = ({users, selected, setFilter} : FilterProps) => {  

    const handleChange = (e: {
        target: { value: React.SetStateAction<number> };
      }) => {
        const found = selected.findIndex(item => item.user_id == e.target.value);
        const temp = selected;
        temp[found].checked = !temp[found].checked;
        setFilter(temp);
      };

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
                                selected[selected.findIndex(item => item.user_id == element.user_id)].checked ?
                                <input type="checkbox" value={element.user_id} defaultChecked={true} onChange={handleChange}/> :
                                <input type="checkbox" value={element.user_id} defaultChecked={false} onChange={handleChange}/>
                            }
                        </div>

                    </div>
                )
            }
        </div>
    );
};

export default OpenFilter;