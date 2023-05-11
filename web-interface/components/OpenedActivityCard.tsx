import openedCard from '../styles/OpenedActivityCard.module.css';
import React, { useState, useLayoutEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faXmark, faChevronDown } from '@fortawesome/free-solid-svg-icons';

export type OpenedActivityCardProps = {
    "title" : string,
    "owner" : string | null,
    "owner_avatar" : string | null,
    "co_owner_usernames"  : Array<string> | null,
    "co_owner_avatars" : Array<string> | null,
    "description": string,
    "setDisplayCard": any
}

const OpenedActivityCard = ({title, owner, owner_avatar, co_owner_usernames, co_owner_avatars, description, setDisplayCard}: OpenedActivityCardProps) =>{

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

    const onCloseClick = () =>{
        setDisplayCard(false);
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
                    <button className={openedCard.closeButton} onClick={() => onCloseClick()}>
                        <FontAwesomeIcon icon={faXmark} style={{color: "#62656a", height: "2em"}} />
                    </button>
                </div>

                <div className={openedCard.title}>
                    {title}
                </div>

                <div className={openedCard.ownersWrap}>
                    
                    <div className={openedCard.owner}>
                        {owner_avatar!=null ? <img src={owner_avatar} alt="owner_avatar" className={openedCard.ownerPhoto}/> : <div className={openedCard.ownerPhoto}></div>}
                        <div>Owner</div>
                    </div>

                    <div className={openedCard.coOwners}>
                        {co_owner_avatars!=null && co_owner_avatars[0]!=null ? <img src={co_owner_avatars[0]} alt="owner_avatar1" className={openedCard.image1}/> : <div className={openedCard.image1}></div>}
                        {co_owner_avatars!=null && co_owner_avatars[1]!=null? <img src={co_owner_avatars[1]} alt="owner_avatar2" className={openedCard.image2}/> : <div className={openedCard.image2}></div>}
                        {co_owner_avatars!=null && co_owner_avatars[2]!=null? <img src={co_owner_avatars[2]} alt="owner_avatar3" className={openedCard.image3}/> : <div className={openedCard.image3}></div>}
                        {owner_avatar!=null ? <div>Co-Owner</div> : <div >Co-Owner</div>}
                    </div>

                </div>

                <div className={openedCard.description}>
                    {description}
                </div>

                <div className={openedCard.addComment}>
                    <input type="password" className={openedCard.inputComment} name = 'password' placeholder={'Agregar comentario...'} title="Enter your password"></input>

                    <button className={openedCard.sendButton}>
                        <img src="/send/favicon.ico" style={{backgroundColor:'#eaeaea'}}></img>
                    </button>    
                    
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