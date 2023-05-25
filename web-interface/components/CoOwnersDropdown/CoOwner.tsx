import { useState , useEffect} from "react";
import CardFilter from '../../styles/Filter.module.css';
import {selection, user, AddCoOwners} from '../../types/types';

const CoOwner = ({users, selected} : AddCoOwners) => {  

    const [checked, setChecked] = useState<Array<selection>>([]);
    const [options, setOptions] = useState<Array<user>>([])

    useEffect(() => {
        setChecked(selected); //selection array [{user_id : string, checked: boolean}]
        setOptions(users) //users array
    }, [selected, users]);
    

    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {

        const temp = checked;

        if( e.target.value === "") { //if not checked, changes the state
            temp[temp.length -1 ].checked = !temp[temp.length -1 ].checked;
        }
        else{ // if checked, changes the state and updates checked variable in selected
            const found = checked.findIndex(item => item.user_id !== null && item.user_id.toString() === e.target.value);
            temp[found].checked = !temp[found].checked;
        }

        console.log(temp);

        setChecked(temp);
    
    };


    return (
         <div className={CardFilter.open}  style={{right:'25%', position:'fixed'}}>
            
            {
                options.map((element : any) =>  
                    <div className={CardFilter.content} key={element.key}>
                        <div className={CardFilter.imagecontainer}>
                            <img src={element.avatar} className={CardFilter.image}/>
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

export default CoOwner;