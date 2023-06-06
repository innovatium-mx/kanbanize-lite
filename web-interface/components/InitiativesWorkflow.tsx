import { useState, useEffect } from 'react';
import {column, user, card, selection} from '../types/types';
import ColumnTitle from './ColumnTitle';
import ClosedInitiativeCard from './ClosedInitiativeCard';
import DynamicBoard from '../styles/Dynamicboard.module.css';

const cookieCutter= require('cookie-cutter');

type InitiativesWorkflowProps = {
    data: Array<column>,
    users: Array<user>,
    workflow_name: string,
    showInitiativeModal : (value:boolean) =>void,
    updateCurrentInitiativeCard : any
}

type showButtons = {
    left: boolean,
    right: boolean
};

const InitiativesWorkflow = ({data, users, workflow_name, showInitiativeModal, updateCurrentInitiativeCard} : InitiativesWorkflowProps) =>{

    const [index, setIndex] = useState<number>(0);
    const [buttons, setButtons] = useState<showButtons>({left: false, right: true});
    const [color, setColor] = useState<string>('#9e9e9e');
    const [filtered, setFiltered] = useState<Array<card> | null>([]);
    const [selected, setSelected] = useState<Array<selection>>([]);
    const [initiatives, setInitiatives] = useState<Array<card> | null>([]);
    const [initiativeIndex, setInitiativeIndex] = useState<number>();


    useEffect(() => {
        setIndex(0);
        setButtons({left: false, right: true});
        if(data[0].color === ''){
            setColor('#9e9e9e');
        }
        else{
            setColor('#'+data[0].color);
        }
    }, [data])
    

    useEffect(()=>{
        setAllSelected(users);
    }, [users]);

    useEffect(()=>{
        setFilteredInitiatives(data, index, selected);
    }, [data, index, selected]);

    useEffect(()=>{
        setInitiatives(filtered);
    }, [filtered]);



    const setFilter = (temp : Array<selection>) =>{
        setSelected(temp);
        const filteredData :  Array<card> = [];
        data[index]?.cards?.map((element: any) => {
            const found = temp.find(item => item.user_id == element.owner_user_id);
            if(found !== undefined && found.checked){
                filteredData.push(element);
            }
        })
        setFiltered(filteredData)
    }

    const setAllSelected = (u : Array<user>) => {
        const usersselection : Array<selection> = [];
        u.map((element: user) =>{
            usersselection.push({user_id: element.user_id, checked: true});
        })
        setSelected(usersselection);
        setFiltered(data[index].cards);
    }

    const setFilteredInitiatives = (d: Array<column>, i: number, s:Array<selection>) =>{ 
        const filteredData :  Array<card> = [];
        d[i]?.cards?.map((element: any) => {
                const found = s.find(item => item.user_id == element.owner_user_id);
                if(found !== undefined && found.checked){
                    filteredData.push(element);
                }
        })
        setFiltered(filteredData)
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

    const retrieveIndex = (cardIndex: number) =>{
        setInitiativeIndex(cardIndex);
        const curr = initiatives!=null ? initiatives.find(item => item.card_id === cardIndex) : [];

        updateCurrentInitiativeCard(curr);
    }

    return(
        <>
            <div style={{position: 'fixed', paddingTop:'5.6em', width:'100%', zIndex:'1'}}>
                <ColumnTitle name={data[index].name} left={buttons.left} right={buttons.right} color={color} returnResponse={returnResponse} parent_column_id={data[index].parent_column_id} workflow_name={workflow_name} users={users} selected={selected} setFilter={setFilter}/>
            </div>
        
            <div className={DynamicBoard.grid}>
                {   
                    initiatives!=null && initiatives.map((element:any)=>
                    <div className={DynamicBoard.cardContainer} key={element.key}>
                        <div className={DynamicBoard.buttons} />
                        <ClosedInitiativeCard card_id={element.card_id} color={element.color} owner_avatar={element.owner_avatar} owner_username={element.owner_username} title={element.title} lane_name={element.lane_name} lane_color={element.lane_color} child_complete={element.child_card_stats.finished_bottom_child_card_size_sum} child_total={element.child_card_stats.child_card_size_sum} showInitiativeModal = {showInitiativeModal} retrieveIndex = {retrieveIndex}/>
                    </div>
                    )
                }
            </div>
        
        
        </>

    )
}

export default InitiativesWorkflow;