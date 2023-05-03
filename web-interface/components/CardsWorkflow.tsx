import ColumnTitle from './ColumnTitle';
import {useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import Dynamicboard from '../styles/Dynamicboard.module.css';
import { response } from 'express';

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
    "position": number
};

type column = {
    "column_id": number,
    "section": number,
    "parent_column_id": number,
    "position": number,
    "name": string,
    "description": string,
    "color": string,
    "limit": number,
    "cards_per_row": number,
    "flow_type": number,
    "card_ordering": string | null,
    "cards": Array<card>  | null
};

type CardsWorkflowProps = {
    data: Array<column>
}

type showButtons = {
    left: boolean,
    right: boolean
};

const CardsWorkflow = ({data} : CardsWorkflowProps) => {

    const [index, setIndex] = useState<number>(0);
    const [buttons, setButtons] = useState<showButtons>({left: false, right: true});
    const [color, setColor] = useState<string>('#9e9e9e');
    const [activities, setActivities] = useState<Array<card> | null>([]);
    
    const ActivityCard = dynamic(import('../components/ActivityCard'), {ssr:false});

    useEffect(()=>{
        setActivities(data[index].cards) 
    }, [data, index]);


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

        console.log()
    };

    return(
        <>
            <div>
                <ColumnTitle name={data[index].name} left={buttons.left} right={buttons.right} color={color} returnResponse={returnResponse}/>
                <div className={Dynamicboard.grid}>
                    { activities != null && activities.map((element: any) =>
                        <ActivityCard key={element.key} color={element.color} owner_avatar={element.owner_avatar} title={element.title} owner_username={element.owner_username}/>
                    )}
                </div>
            </div>
        </>
    )
}


export default CardsWorkflow;