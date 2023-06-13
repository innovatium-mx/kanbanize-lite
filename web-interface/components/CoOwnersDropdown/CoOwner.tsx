import { useState , useEffect, useRef, useCallback} from "react";
import CardFilter from '../../styles/Filter.module.css';
import {selection, user, AddCoOwners, croppedUser} from '../../types/types';

const CoOwner = ({users, selected, setNewSelection, updateAvatars, avatarsList} : AddCoOwners) => {  

    const [checked, setChecked] = useState<Array<selection>>([]);
    const [options, setOptions] = useState<Array<user>>([])
    const [retrievedAvatarList, setRetrievedAvatarList] = useState<Array<croppedUser>>([]);

    const [, updateState] = useState<any>();
    const forceUpdate = useCallback(() => updateState({}), []);

    useEffect(()=>{
        setRetrievedAvatarList(avatarsList);
    },[avatarsList])

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

        var newAvatar : string | undefined = users.find(item => item.user_id === temp[found].user_id)?.avatar;
        var newUserId : any = users.find(item => item.user_id === temp[found].user_id)?.user_id;
        var newUserName : string | undefined =  users.find(item => item.user_id === temp[found].user_id)?.username;

        if(temp[found].checked){
            if(!retrievedAvatarList.some(e => e.user_id === newUserId)){ //Adds the new element to the array
                var tempArray = retrievedAvatarList;

                var newCroppedUser : croppedUser = {user_id : newUserId, avatar : newAvatar, username : newUserName}
                tempArray.push(newCroppedUser);

                updateAvatars(tempArray);
            }
            else{
                updateAvatars(retrievedAvatarList);
            }

        }               
        else{
            let listCopy = retrievedAvatarList;
            let x = listCopy.filter((e) => e.user_id !== newUserId);
            
            updateAvatars(x);
        }
        forceUpdate();
    };

    return (
         <div className={CardFilter.newcardOpen}>
            
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
                            <input type="checkbox" value={element.user_id} checked={checked[checked.findIndex( item => item.user_id === element.user_id)].checked} onChange={handleChange}/>
                        </div>

                    </div>
                )
            }
        </div>
    );
};

export default CoOwner;