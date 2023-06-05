import initCard from '../styles/Initiativecard.module.css';
import actCard from '../styles/Activitycard.module.css'
import { InitiativeCardProps } from '@/types/types';


const InitiativeCard = ({card_id, color, owner_avatar, title, owner_username, retrieveIndex, displayModal, lane_name, lane_color, child_complete=0, child_total=1} : InitiativeCardProps) =>{

    const newColor = '#' + color;

    const completeness = Math.round(child_complete/child_total);


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
            <div className={initCard.card} onClick={()=> handleClick()}>
                <div className={initCard.tags}>
                    <div>
                        <span className={initCard.tag}>{completeness}%</span>
                        <div className={actCard.lane} style={{ backgroundColor: `#${lane_color}` }}>{lane_name}</div>
                    </div>
                    <span className={initCard.owner}>
                        {(owner_avatar !=  null &&  owner_avatar!="") ? <img src={owner_avatar} alt="" className={actCard.photo}/> : <div className={actCard.wrap}><div className={nonPhoto} style={{background:letterBackground}}> <div className={actCard.letter}>{letter}</div> </div></div>}
                    </span>
                </div>
                <div className={initCard.line}></div>
                <p>{title}</p>
            </div>
        </div>    
    )


}

export default InitiativeCard;