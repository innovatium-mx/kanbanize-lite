import { useState , useEffect} from "react";
import CardFilter from '../../styles/Filter.module.css';
import {selection, user, AddCoOwners} from '../../types/types';

const CoOwner = ({users, selected, userId, changeNoneSelected, setNewSelection} : AddCoOwners) => {  

    const [checked, setChecked] = useState<Array<selection>>([]);
    const [options, setOptions] = useState<Array<user>>([])

    useEffect(()=>{
            setChecked(selected);
            setOptions(users);
    })

    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const temp = checked;

        const found = checked.findIndex(item => item.user_id !== null && item.user_id.toString() === e.target.value);
        temp[found].checked = !temp[found].checked;

        setChecked(temp);
        setNewSelection(temp);
    };

    return (
         <div className={CardFilter.open}  style={{right:'30vw', position:'fixed'}}>
            
            {
                options.map((element : any) =>
                    <div className={CardFilter.content} key={element.key}>
                        <div className={CardFilter.imagecontainer}>
                        {
                            (element.avatar !=  null &&  element.avatar!="") ?
                                <img src={element.avatar} className={CardFilter.image}/>:
                                <div className={CardFilter.noPhoto_noUser} style={{background: '#35A97A'}}><div className={CardFilter.letter}>{element.username[0]}</div></div>
                        }
                        </div>
                        <div className={CardFilter.username}>
                            {element.username}
                        </div>
                        <div className={CardFilter.checkbox}>
                            <input type="checkbox" value={element.user_id} defaultChecked={checked[checked.findIndex( item => item.user_id == element.user_id)].checked} onChange={handleChange}/>
                        </div>

                    </div>
                )
            }
        </div>
    );
};

export default CoOwner;