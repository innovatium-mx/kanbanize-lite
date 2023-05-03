import openedCard from '../styles/OpenedActivityCard.module.css';
import React, { useState, useLayoutEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faXmark, faChevronDown } from '@fortawesome/free-solid-svg-icons';

export type OpenedActivityCardProps = {
    "title" : string,
    "description" : string,
    "owner" : string,
    "owner_avatar" : string,
    "co_owners"  : Array<string>,
    "co_owners_avatars" : Array<string>,
}

const OpenedActivityCard = ({title, owner, owner_avatar, co_owners, co_owners_avatars, description}: OpenedActivityCardProps) =>{

    const [openComments, setOpenComments] = useState(false);
    var arrowDown = openedCard.arrowDown

    const handleOpenComments = () =>{
        setOpenComments(!openComments);

        if(openComments){
            arrowDown = openedCard.arrowDownAnimated
        }
        else{
            arrowDown = openedCard.arrowDown
        }
        console.log(openComments)
        console.log(arrowDown)
    }


    /*
    if (typeof window !== 'undefined') {
        document.documentElement.style.setProperty('--dynamic-height-', '45em');
    }*/

    return(
    <>
        <div className={openedCard.modalBackground}>
           <div className={openedCard.Card}>
                <div className={openedCard.close}>
                    <button className={openedCard.closeButton}>
                        <FontAwesomeIcon icon={faXmark} style={{color: "#62656a", height: "2em"}} />
                    </button>
                </div>

                <div className={openedCard.title}>
                    {title}
                </div>

                <div className={openedCard.ownersWrap}>
                    <div className={openedCard.owner}>
                        <img src={owner_avatar} alt="owner_avatar" className={openedCard.ownerPhoto}/>
                        <div>Owner</div>
                    </div>
                    <div className={openedCard.coOwners}>
                        <img src={owner_avatar} alt="owner_avatar" className={openedCard.image1}/>
                        <img src={owner_avatar} alt="owner_avatar2" className={openedCard.image2}/>
                        <img src={owner_avatar} alt="owner_avatar3" className={openedCard.image3}/>
                        <div className={openedCard.coOwnerText}>Co-Owner</div>
                    </div>

                </div>

                <div className={openedCard.description}>
                    {description}
                </div>

                <div className={openedCard.addComment}>
                    <input type="password" className={openedCard.inputComment} name = 'password' placeholder={'Agregar comentario...'} title="Enter your password"></input>
                </div>

                <div className={openedCard.commentsWrap}>
                    <div className={openedCard.commentsText}>
                        Comentarios
                    </div>
                        <FontAwesomeIcon icon={faChevronDown} className={arrowDown} onClick={() => handleOpenComments()}/>
                    </div>

            </div>
        </div>
        
    </>

    )


}

export default OpenedActivityCard;