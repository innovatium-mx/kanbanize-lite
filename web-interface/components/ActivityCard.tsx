import dynamic from 'next/dynamic';
import actCard from '../styles/Activitycard.module.css';
import Image from 'next/image';
import adjustColor from '../helpers/lightenColor';

export type ActivityCardProps = {
    "color": string,
    "owner_avatar": string | null,
    "title": string,
    "owner_username": string | null,
}


const ActivityCard = ({color, owner_avatar, title, owner_username} : ActivityCardProps) =>{

    const darkenedColor =  adjustColor(color,-90); // red
    const lightenedColor = adjustColor(darkenedColor, 90);
    const boardCardColor = adjustColor(color, 160);

    if (typeof window !== 'undefined') {
        document.documentElement.style.setProperty('--primary-gradient-', darkenedColor);
        document.documentElement.style.setProperty('--secondary-gradient-', lightenedColor);
        document.documentElement.style.setProperty('--card-color-', color);
        document.documentElement.style.setProperty('--boardCard-color-', boardCardColor);
    }

    var nonPhoto;
    var letter = '';

    if(owner_username === null){
        nonPhoto = actCard.noPhoto_noUser;
        letter = 'N';
    }
    else{
        nonPhoto = actCard.noPhoto_user;
        letter = owner_username.charAt(0);
    }

    return(
        <>
            <div className={actCard.boardCard}>
                <div className={actCard.text}>{title}</div>
                    <div className={actCard.imageSection}>
                    {owner_avatar !=  null ? <img src={owner_avatar} alt="" className={actCard.photo}/> : <div className={actCard.wrap}><div className={nonPhoto}> <div className={actCard.letter}>{letter}</div> </div></div>}
                    {owner_username}
                    </div>
            </div>
            

        
        </>
    )


}

export default ActivityCard;
