import { useState , useEffect} from "react";
import CardFilter from '../../styles/Filter.module.css';
import {selection, user, AddCoOwners, croppedUser} from '../../types/types';

const CoOwner = ({users, selected, userId, changeNoneSelected, setNewSelection, updateAvatars, updateUserIdsArray, avatarsList} : AddCoOwners) => {  

    const [checked, setChecked] = useState<Array<selection>>([]);
    const [options, setOptions] = useState<Array<user>>([])
    const [retrievedAvatarList, setRetrievedAvatarList] = useState<Array<croppedUser>>([]);

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


        if(temp[found].checked){
            if(!retrievedAvatarList.some(e => e.user_id === newUserId)){ //Adds the new element to the array
                var tempArray = retrievedAvatarList;

                var newCroppedUser : croppedUser = {user_id : newUserId, avatar : newAvatar}
                tempArray.push(newCroppedUser);

                updateAvatars(tempArray);
            }

        }               
        else{
            const ix : number = retrievedAvatarList.findIndex(e => e.user_id === newUserId);
            let listCopy = retrievedAvatarList;
            let x = listCopy.filter((e) => e.user_id !== newUserId);
            
            updateAvatars(x);
            console.log(x); 
        }



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