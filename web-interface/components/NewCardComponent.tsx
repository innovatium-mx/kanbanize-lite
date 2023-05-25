import newcard from '../styles/NewCardComponent.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faXmark, faPlus} from '@fortawesome/free-solid-svg-icons';
import { newCard,user, selection } from '../types/types';
import { useEffect, useState } from 'react';
import CoOwner from '../components/CoOwnersDropdown/CoOwner';

const NewCardComponent = ({owner_username, owner_avatar, users, activateInsertCard}: newCard) =>{

    const [dropdown, setDropdown] = useState<boolean>(false);
    const [showCoOwners, setShowCoOwners] = useState<boolean>(false);
    const [selected, setSelected] = useState<Array<selection>>([]);

    const openCloseDropdown = () =>{
        setDropdown(!dropdown);
    }

    const handleClose = () =>{
        activateInsertCard(false);
    }

    const handleAddCoOwners = () =>{
        setShowCoOwners(!showCoOwners);
    }

    const setAllSelected = (u : Array<user>) => {
        const usersselection : Array<selection> = [];
        u.map((element: user) =>{
            usersselection.push({user_id: element.user_id, checked: true});
        })
        setSelected(usersselection);
    }

    useEffect(()=>{
        setAllSelected(users);
    })

    console.log(users);

    return(
        <>
        
            <div className={newcard.modalBackground}>
                <div className={newcard.NewCard}>

                    <div className={newcard.close} onClick={()=> handleClose()}>
                        <button className={newcard.closeButton}>
                            <FontAwesomeIcon icon={faXmark} style={{color: "#62656a", height: "2em"}} />
                        </button>
                    </div>

                    <input type="text" className={newcard.inputTitle} placeholder='Título de tarjeta' />


                    <div className={newcard.ownersWrap}>
                        <div className={newcard.owner}>{ }

                            <div>Owner</div>
                        </div>

                        <div className={newcard.coOwners}>


                            <div style={{display:'flex'}}>
                                CoOwner
                                <button className={newcard.showCoOwnersButton} onClick={()=> handleAddCoOwners()}>
                                    <FontAwesomeIcon icon={faPlus} style={{color: "#000000", height: "1em", paddingLeft:'0.4em', paddingTop:'0.2em'}} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {showCoOwners && <div><CoOwner users={users} selected={selected}/></div>}


                    <textarea className={newcard.inputDescription} placeholder='Título de tarjeta' />

                    <button className={newcard.createButton}>
                        Crear
                    </button>
 
               </div>
            </div>



        </>
    )
}

export default NewCardComponent;