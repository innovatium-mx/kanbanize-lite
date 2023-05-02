import dynamic from 'next/dynamic';
import actCard from '../styles/Activitycard.module.css';
import Image from 'next/image';
import adjustColor from '../helpers/lightenColor';
import { Console } from 'console';

export type ActivityCardProps = {
    "color": string,
    "owner_avatar": string | null,
    "title": string,
    "owner_username": string | null,
}


const ActivityCard = ({color, owner_avatar, title, owner_username} : ActivityCardProps) =>{

    const newColor = '#' + color;
    const boardCardColor = adjustColor(newColor, 175);

    /*
    if (typeof window !== 'undefined') {
        document.documentElement.style.setProperty('--boardCard-color-', boardCardColor);
        document.documentElement.style.setProperty('--card-color-', newColor);
        document.documentElement.style.setProperty('--bottom-card-color-', newColor);
    }*/

    var nonPhoto;
    var letter = '';
    var letterBackground = '';

    if(owner_username === null || owner_username === undefined){
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
        <>
            <div className={actCard.boardCard} style={{backgroundColor:boardCardColor}}>
                <div className={actCard.text}>{title}</div>
                    <div className={actCard.imageSection}>
                        {owner_avatar !=  null ? <img src={owner_avatar} alt="" className={actCard.photo}/> : <div className={actCard.wrap}><div className={nonPhoto} style={{background:letterBackground}}> <div className={actCard.letter}>{letter}</div> </div></div>}
                        {/*owner_username != undefined && <div className={actCard.name}>{owner_username}</div>*/}

                    </div>
            </div>
            <footer className={actCard.bottom} style={{backgroundColor:newColor}}></footer>
        
        </>
    )


}

export default ActivityCard;
