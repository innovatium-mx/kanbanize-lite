import activity from '../styles/Activity.module.css';
import isTooLight from '../helpers/isTooLight';
import {useEffect} from 'react';

export type ActivityProps = {
    card_id : number,
    title : string,
    color : string
}

const Activity = ({card_id, title, color}: ActivityProps) =>{

    const idColor : string = '#' + color;
    var idTextColor : string = ''; 
    
    (!isTooLight(idColor)? idTextColor = '#FFFFFF' : idTextColor = '#000000');

    return (

        <>
            <div className={activity.activity}>
                <div className={activity.idContainer}  style={{backgroundColor: idColor, color:idTextColor}}>
                    <span>ID: {card_id} </span>
                </div>

                <div className={activity.title}>
                    <span>{title}</span>

                </div>

            </div>

        </>
    )

}

export default Activity;