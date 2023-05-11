import ColumnTitle from './ColumnTitle';
import {useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import Dynamicboard from '../styles/Dynamicboard.module.css';
import { response } from 'express';

type parent_columns = {
    parent_id: number,
    parent_name: string,
    parent_section: number,
    parent_position: number,
} 

type card = {
    "card_id": number,
    "custom_id": number | null,
    "title": string,
    "owner_user_id": number | null,
    "owner_username": string | null,
    "owner_avatar": string | null,
    "type_id": number | null,
    "color": string,
    "section": number,
    "lane_id": number,
    "position": number,
    "co_owner_usernames" : Array<string> | null,
    "co_owner_avatars" : Array<string> | null,
    "description" : string
};

type column = {
  "column_id": number,
  "workflow_id": number,
  "section": number,
  "parent_column_id": Array<parent_columns> | null ,
  "position": number,
  "name": string,
  "description": string,
  "color": string,
  "limit": number,
  "cards_per_row": number,
  "flow_type": number,
  "card_ordering": string | null,
  "cards": Array<card> | null,
  "order": number
}

type CardsWorkflowProps = {
    data: Array<column>,
    workflow_name: string,
    updateCurrentCard: any,
    displayModal: any
}

type showButtons = {
    left: boolean,
    right: boolean
};

const CardsWorkflow = ({data, workflow_name, updateCurrentCard, displayModal} : CardsWorkflowProps) => {
    const [index, setIndex] = useState<number>(0);
    const [buttons, setButtons] = useState<showButtons>({left: false, right: true});
    const [color, setColor] = useState<string>('#9e9e9e');
    const [activities, setActivities] = useState<Array<card> | null>([]);

    const ActivityCard = dynamic(import('../components/ActivityCard'), {ssr:false});
    const [cardIndex, setCardIndex] = useState(0);

    useEffect(()=>{
        setActivities(data[index].cards) 
    }, [data, index]);

    //console.log(data);



    const retrieveIndex = (cardIndex: number) =>{
        //retrieve cards index
        setCardIndex(cardIndex);
        console.log(cardIndex);
        const curr = activities!=null ? activities.find(item => item.card_id === cardIndex) : [];

        updateCurrentCard(curr);

    }




    const returnResponse = (response : number) =>   {
        setIndex(index+response);
        if(index+response === 0){
            setButtons({left: false, right: true})
        }
        else if(index+response === data.length-1){
            setButtons({left: true, right: false})
        }
        else{
            setButtons({left: true, right: true})
        }

        if(data[index+response].color === ''){
            setColor('#9e9e9e');
        }
        else{
            setColor('#'+data[index+response].color);
        }


    };

    return(
        <>
            

            <div className={Dynamicboard.workflowWrap}>
                <ColumnTitle name={data[index].name} left={buttons.left} right={buttons.right} color={color} returnResponse={returnResponse} parent_column_id={data[index].parent_column_id} workflow_name={workflow_name}/>
                <div className={Dynamicboard.grid}>
                    { activities != null && activities.map((element: any) =>
                        <ActivityCard key={element.key} card_id={element.card_id}  color={element.color} owner_avatar={element.owner_avatar} title={element.title} owner_username={element.owner_username} co_owner_usernames={element.co_owner_usernames} co_owner_avatars={element.co_owner_avatars} description={element.description} retrieveIndex={retrieveIndex} displayModal={displayModal}/>
                    )}
                </div>
            </div>
        </>
    )
}


export default CardsWorkflow;