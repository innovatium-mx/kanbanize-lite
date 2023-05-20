import { useState , useEffect} from "react";
import CardFilter from '../styles/Filter.module.css';

type selection = {
    user_id: number,
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


const OpenFilter = ({users, selected, setFilter} : FilterProps) => {  

    const [checkedAll, setCheckedAll] = useState(false);

    useEffect(() => {
    let allChecked = true;
    for (var i=0; i< selected.length; i++) {
      if (selected[i].checked === false) {
        allChecked = false;
      }
    }
    if (allChecked) {
      setCheckedAll(true);
    } else {
      setCheckedAll(false);
    }
  }, [selected]);

    const handleChange = (e : React.ChangeEvent<HTMLTextAreaElement>) => {
        const temp = selected;
        if( e.target.value === "") {
            temp[temp.length -1 ].checked = !temp[temp.length -1 ].checked;
        }
        else{
            const found = selected.findIndex(item => item.user_id == e.target.value);
            temp[found].checked = !temp[found].checked;
        }
        setFilter(temp);
    };

    const handleCheckAllChange = (e : React.ChangeEvent<HTMLTextAreaElement>) => {
        const temp = selected;
        if(checkedAll){
            for (var i=0; i< temp.length; i++){
                temp[i].checked = false;
            }
            setCheckedAll(false);
        }
        else{
            for (var i=0; i< temp.length; i++){
                temp[i].checked = true;
            }
            setCheckedAll(true);
        }
        setFilter(temp);
    };

    return (
         <div className={CardFilter.open}>
            <div className={CardFilter.content} >
                <div className={CardFilter.username}>
                    Select All
                </div>
                <div className={CardFilter.checkbox}>
                    <input type="checkbox" value={0} checked={ checkedAll} onChange={handleCheckAllChange}/>
                </div>
            </div>
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