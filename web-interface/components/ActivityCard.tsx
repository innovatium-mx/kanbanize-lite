import actCard from '../styles/Activitycard.module.css';
import adjustColor from '../helpers/lightenColor';
import { Console } from 'console';
import dynamic from 'next/dynamic';
import { useState } from 'react';

export type ActivityCardProps = {
    "card_id": number,
    "color": string,
    "owner_avatar": string | null,
    "title": string, 
    "owner_username": string | null,
    "co_owner_usernames" : Array<string> | null,
    "co_owner_avatars" : Array<string> | null,
    "description" : string,
    "retrieveIndex" : any,
    "displayModal": any,
    "lane_name": string
}


const ActivityCard = ({card_id, color, owner_avatar, title, owner_username, co_owner_usernames, co_owner_avatars, description, retrieveIndex, displayModal, lane_name} : ActivityCardProps) =>{

    const newColor = '#' + color;
    const boardCardColor = adjustColor(newColor, 175);

    const handleClick = () =>{
        retrieveIndex(card_id);
        displayModal(true);
    }

    var nonPhoto;
    var letter = '';
    var letterBackground = '';

    if(owner_username === null || owner_username === undefined || owner_username === ""){
        nonPhoto = actCard.noPhoto_noUser;
        letter = 'N';
        letterBackground = 'gray';
    }
    else{
        nonPhoto = actCard.noPhoto_user;
        letter = owner_username.charAt(0);
        letterBackground = newColor;
    }

    return(
        <div>
            
            <div className={actCard.boardCard} style={{backgroundColor:boardCardColor}} onClick={()=> handleClick()}>
                <div className={actCard.lane}>{lane_name}</div>
                <div className={actCard.innerContainer}>
                    <div className={actCard.text}>{title}</div>
                    <div className={actCard.imageSection}>
                        {(owner_avatar !=  null &&  owner_avatar!="") ? <img src={owner_avatar} alt="" className={actCard.photo}/> : <div className={actCard.wrap}><div className={nonPhoto} style={{background:letterBackground}}> <div className={actCard.letter}>{letter}</div> </div></div>}
                    </div>
                </div> 
            </div>
            <footer className={actCard.bottom} style={{backgroundColor:newColor}}></footer>
        
        </div>
    )


}

export default ActivityCard;