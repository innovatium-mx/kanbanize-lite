import newcard from '../styles/NewCardComponent.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faXmark, faPlus} from '@fortawesome/free-solid-svg-icons';
import { newCard,user, selection } from '../types/types';
import { useEffect, useState, useLayoutEffect } from 'react';
import CoOwner from '../components/CoOwnersDropdown/CoOwner';
const cookieCutter= require('cookie-cutter');
import adjustColor from '../helpers/lightenColor';
import { t } from 'i18next';
import { urlCloud } from '../constants';
import { useRouter } from 'next/router';


const NewCardComponent = ({users, activateInsertCard, color, selected, lane_id, column_id, updateSelected}: newCard) =>{

    const [showCoOwners, setShowCoOwners] = useState<boolean>(false);
    const [noneSelected, setNoneSelected] = useState<boolean>(true);
    
    const [currCoBg1, setCurrCoBg1] = useState<string | undefined>('#ff0000');
    const [currCoBg2, setCurrCoBg2] = useState<string | undefined>('#ff0000');
    const [currCoBg3, setCurrCoBg3] = useState<string | undefined>('#ff0000');
    const [currCo1, setCurrCo1] = useState<string | undefined>('_');
    const [currCo2, setCurrCo2] = useState<string | undefined>('_');
    const [currCo3, setCurrCo3] = useState<string | undefined>('_');

    const userId = cookieCutter.get('userid');
    const sessionUsername = cookieCutter.get('username');
    const sessionAvatar = cookieCutter.get('avatar');
    const apikey = cookieCutter.get('apikey');
    const host = cookieCutter.get('host');
    const [alteredSelected, setAlteredSelected] = useState<Array<selection>>(selected);

    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const router = useRouter();

    console.log(alteredSelected);

    const handleClose = () =>{
        activateInsertCard(false);
    }

    const handleAddCoOwners = () =>{
        setShowCoOwners(!showCoOwners);
    }

    const handleUpdateTitle = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setTitle(e.target.value);
    }

    const handleUpdateDescription = (e: React.FormEvent<HTMLTextAreaElement>) =>{
        setDescription(e.currentTarget.value);
    }

    const handleInsert = () =>{

        var co_owner_ids : Array<number | null> = ([]);

        for(var x=0; x < selected.length; x++){
            if(alteredSelected[x].checked){
                co_owner_ids.push(alteredSelected[x].user_id);
            }
        }

        let formData : string = JSON.stringify({
            "lane_id" : lane_id,
            "column_id" : column_id,
            "title" : title,
            "description" : description,
            "owner_user_id" : userId,
            "co_owner_ids" : co_owner_ids
        });


        fetch(urlCloud + 'addCard/' + host,{
            method: "POST",
            headers: {
                "Content-Type" : "application/json",
                "apikey" : apikey
            },
            body: formData
        })
        .then((response) => response.json())
        .then((data) =>{
            if(data.error){
                cookieCutter.set('apikey', '', { expires: new Date(0) })
                cookieCutter.set('host', '', { expires: new Date(0) })
                cookieCutter.set('email', '', { expires: new Date(0) })
                cookieCutter.set('userid', '', { expires: new Date(0) }) 
                router.replace({pathname: '/'});
            }
            else{
                alert("Tarjeta agregada satisfactoriamente");



                activateInsertCard(false);
            }
        })
        .catch((error) =>{
            cookieCutter.set('apikey', '', { expires: new Date(0) })
            cookieCutter.set('host', '', { expires: new Date(0) })
            cookieCutter.set('email', '', { expires: new Date(0) })
            cookieCutter.set('userid', '', { expires: new Date(0) }) 
            router.replace({pathname: '/'}); 
        })

    }

    const setNewSelection = (newSelection: Array<selection>) =>{
        setAlteredSelected(newSelection);
        updateSelected(newSelection);
    }

    const renderCoOwners = () =>{
        
        var letterCo : Array<string | undefined> = [undefined, undefined, undefined] 
        var letterCoBg : Array<string | undefined> = [undefined, undefined, undefined] 
        const grays : Array<string> = ['#6c6c6c','#929292','#cfcfcf'];

        for(var x = 0; x < alteredSelected.length; x++){
            //coOwner[x] existance

            if(alteredSelected!=null && (users[x].avatar===undefined || users[x].avatar==="") && alteredSelected[x].checked){ // coOwners exist, but don't have avatar
                letterCo[x]=users[x].username.charAt(0); 
                letterCoBg[x]=adjustColor(color, 500*(x+0.7)/10);
            }   
        }

        for(var y=0; y < 3; y++){
            if(letterCo[y]==undefined){ // coOwners doesn't exist
                letterCo[y] = 'N';
                letterCoBg[y] = grays[y];
            }
        }
    
        setCurrCoBg1(letterCoBg[0])
        setCurrCoBg2(letterCoBg[1])
        setCurrCoBg3(letterCoBg[2])

        setCurrCo1(letterCo[0]);
        setCurrCo2(letterCo[1]);
        setCurrCo3(letterCo[2]);
    }

    useEffect(()=>{
        renderCoOwners();
    })



    const changeNoneSelected = (value: boolean) =>{
        setNoneSelected(value);
    }

    var letter = ''
    var letterBackground = ''

    //owner existance
    if(sessionUsername==undefined && sessionAvatar==undefined){
        letter = 'N';
        letterBackground = '#505050';
    }
    else if(sessionUsername!=undefined && (sessionAvatar=="" || sessionAvatar==null)){
        letter = sessionUsername.charAt(0);
        letterBackground = color;
    }

    return(
        <>
        
            <div className={newcard.modalBackground}>
                <div className={newcard.NewCard}>

                    <div className={newcard.close} onClick={()=> handleClose()}>
                        <button className={newcard.closeButton}>
                            <FontAwesomeIcon icon={faXmark} style={{color: "#62656a", height: "2em"}} />
                        </button>
                    </div>

                    <input type="text" className={newcard.inputTitle} placeholder='Título de tarjeta' onChange={handleUpdateTitle} />

                    <div className={newcard.ownersWrap}>
                        <div className={newcard.owner}>

                            {sessionAvatar!="" && sessionAvatar!=undefined && <img src={sessionAvatar} alt="owner_avatar" className={newcard.ownerPhoto}/> /*user exists and have photo*/} 
                            {sessionUsername!=null && (sessionAvatar=="" || sessionAvatar== null) && <div className={newcard.ownerPhoto} style={{backgroundColor:letterBackground}}><div className={newcard.letter}>{letter}</div></div> /*user exists, but doesn't have photo*/}

                            <div>Owner</div>
                        </div>

                        <div className={newcard.coOwners}>


                                { /* User 1 */ users.length >= 0 && users[0]!=undefined &&
                                    (alteredSelected!=null && alteredSelected != undefined && alteredSelected[0].checked==true && (users[0].avatar!="" || users[0].avatar!=null)) && <img src={users[0].avatar} alt="owner_avatar1" className={newcard.image1}/>
                                }
                                
                                {   users.length >= 0 && users[0]!=undefined &&
                                    (alteredSelected!=null) && (!alteredSelected[0].checked || (users[0].avatar=="" || users[0].avatar==null)) && 
                                    <div className={newcard.image1} style={ {backgroundColor:currCoBg1}}><div className={newcard.letter}>{currCo1}</div></div>
                                }

                                {
                                    users[0]==undefined && <div className={newcard.image1} style={ {backgroundColor:currCoBg1}}><div className={newcard.letter}>{currCo1}</div></div>
                                }


                                { /* User 2 */ users.length >= 1 && users[1]!=undefined &&
                                    (alteredSelected!=null && alteredSelected != undefined && alteredSelected[1].checked==true && (users[1].avatar!="" || users[1].avatar!=null)) && <img src={users[1].avatar} alt="owner_avatar2" className={newcard.image2}/>
                                }
                                
                                {   users.length >= 1 && users[1]!=undefined &&
                                    (alteredSelected!=null) && (!alteredSelected[1].checked || (users[1].avatar=="" || users[1].avatar==null)) && 
                                    <div className={newcard.image2} style={ {backgroundColor:currCoBg2}}><div className={newcard.letter}>{currCo2}</div></div>
                                }

                                {
                                    users[1]==undefined && <div className={newcard.image2} style={ {backgroundColor:currCoBg2}}><div className={newcard.letter}>{currCo2}</div></div>
                                }

                                { /* User 3 */ users.length >= 2 && users[2]!=undefined &&
                                    (alteredSelected!=null && alteredSelected != undefined && alteredSelected[2].checked==true && (users[2].avatar!="" || users[2].avatar!=null)) && <img src={users[2].avatar} alt="owner_avatar3" className={newcard.image3}/>
                                }
                                
                                {   users.length >= 2 && users[2]!=undefined &&
                                    (alteredSelected!=null) && (!alteredSelected[2].checked || (users[2].avatar=="" || users[2].avatar==null)) && 
                                    <div className={newcard.image3} style={ {backgroundColor:currCoBg3}}><div className={newcard.letter}>{currCo3}</div></div>
                                }

                                {
                                    users[2]==undefined && <div className={newcard.image3} style={ {backgroundColor:currCoBg3}}><div className={newcard.letter}>{currCo3}</div></div>
                                }


                            <div style={{display:'flex', paddingTop:'4em'}}>
                                CoOwner
                                <button className={newcard.showCoOwnersButton} onClick={()=> handleAddCoOwners()}>
                                    <FontAwesomeIcon icon={faPlus} style={{color: "#000000", height: "1em", paddingLeft:'0.4em', paddingTop:'0.2em'}} />
                                </button>
                            </div>
                            {showCoOwners && <div><CoOwner users={users} selected={alteredSelected} userId={userId} changeNoneSelected={changeNoneSelected} setNewSelection={setNewSelection}/></div>}

                            
                        </div>
                    </div>

                    <textarea className={newcard.inputDescription} placeholder='Título de tarjeta' onChange={handleUpdateDescription}/>

                    <button className={newcard.createButton} onClick={()=>handleInsert()}>
                        Crear
                    </button>
 
               </div>
            </div>

        </>
    )
}

export default NewCardComponent;