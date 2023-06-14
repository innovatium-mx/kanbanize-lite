import Comment from './Comment';
import openedCard from '../styles/OpenedActivityCard.module.css';
import {useRef, useEffect} from 'react';
import { linkedCards } from '../types/types';
import Activity from '../components/Activity';

export type LinkedActivitiesContainer = {
    linked_cards : Array<linkedCards>,
    color : string
}



const LinkedActivitiesContainer = ({linked_cards, color} : LinkedActivitiesContainer) =>{

    return(
        <>
            <div className={openedCard.activitiesContainer}>
                {linked_cards.map((element: any, index)=> 
                    <Activity key={element.key} card_id={element.card_id} title={element.title}color={color}/>
                )} 
            </div>
        </>
    )

}

export default LinkedActivitiesContainer;