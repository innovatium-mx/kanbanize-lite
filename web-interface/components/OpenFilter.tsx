import { useState , useEffect} from "react";
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


const OpenFilter = ({users, selected, setFilter} : FilterProps) => {  

    const [checkedAll, setCheckedAll] = useState(false);
    const [checked, setChecked] = useState<Array<selection>>([]);
    const [options, setOptions] = useState<Array<user>>([])

    useEffect(() => {
        setChecked(selected);
        setOptions(users)
    }, [selected, users]);
    

    useEffect(() => {
    let allChecked = true;
    for (var i=0; i< checked.length; i++) {
        if (checked[i].checked === false) {
            allChecked = false;
        }
    }
    if (allChecked) {
      setCheckedAll(true);
    } else {
      setCheckedAll(false);
    }
  }, [checked]);

    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const temp = checked;
        if( e.target.value === "") {
            temp[temp.length -1 ].checked = !temp[temp.length -1 ].checked;
        }
        else{
            const found = checked.findIndex(item => item.user_id !== null && item.user_id.toString() === e.target.value);
            temp[found].checked = !temp[found].checked;
        }

        let allChecked = true;
        for (var i=0; i< temp.length; i++) {
            if (temp[i].checked === false) {
                allChecked = false;
            }
        }
        if (allChecked) {
        setCheckedAll(true);
        } 
        else {
        setCheckedAll(false);
        }
        setChecked(temp);
        setFilter(temp);
    };

    const handleCheckAllChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const temp = checked;
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
        setChecked(temp);
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
                options.map((element : any) => 
                    <div className={CardFilter.content} key={element.key}>
                        <div className={CardFilter.imagecontainer}>
                            {(element.avatar !=  null &&  element.avatar!="") ? <img src={element.avatar} className={CardFilter.image}/> :
                            <div className={CardFilter.noPhoto_noUser} style={{background: '#35A97A'}}><div className={CardFilter.letter}>{element.username[0]}</div></div>}
                        </div>
                        <div className={CardFilter.username}>
                            {element.username}
                        </div>
                        <div className={CardFilter.checkbox}>
                            <input type="checkbox" value={element.user_id} checked={checked[checked.findIndex( item => item.user_id == element.user_id)].checked} onChange={handleChange}/>
                        </div>

                    </div>
                )
            }
        </div>
    );
};

export default OpenFilter;