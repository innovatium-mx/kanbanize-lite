import ColumnTitle from './ColumnTitle';
import {useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router'
import Dynamicboard from '../styles/Dynamicboard.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCircleArrowLeft, faCircleArrowRight} from '@fortawesome/free-solid-svg-icons';
import {urlCloud} from '../constants'
import {column, card} from '../types/types';


const cookieCutter= require('cookie-cutter');

type selection = {
    user_id: number | null,
    checked: boolean
}

type user = {
    user_id: number | null,
    username: string,
    realname: string,
    avatar: string
}


type CardsWorkflowProps = {
    data: Array<column>,
    users: Array<user>,
    workflow_name: string,
    updateCurrentCard: any,
    displayModal: any,
    moveCards: any,
    goBack : boolean,
    applyInsertEffect : (val:boolean) => void
}

type showButtons = {
    left: boolean,
    right: boolean
};

const CardsWorkflow = ({data, users, workflow_name, updateCurrentCard, displayModal, moveCards, goBack, applyInsertEffect} : CardsWorkflowProps) => {
    const router = useRouter();
    const [index, setIndex] = useState<number>(0);
    const [buttons, setButtons] = useState<showButtons>({left: false, right: true});
    const [color, setColor] = useState<string>('#9e9e9e');
    const [activities, setActivities] = useState<Array<card> | null>([]);
    const [filtered, setFiltered] = useState<Array<card> | null>([]);
    const [selected, setSelected] = useState<Array<selection>>([]);
    const columns = data;

    const ActivityCard = dynamic(import('../components/ActivityCard'), {ssr:false});
    const [cardIndex, setCardIndex] = useState(0);
    const [ getToBacklog, setGetToBacklog] = useState<boolean>(false);

    
    useEffect(()=>{
        setGetToBacklog(goBack);
    }, [goBack])

    useEffect(()=>{
        setAllSelected(users);
    }, [users]);

    useEffect(()=>{
        setFilteredActivities(data, index, selected);
    }, [data, index, selected]);

    useEffect(()=>{
        setActivities(filtered);
    }, [filtered]);

    useEffect(()=>{
        if(getToBacklog){
            setIndex(0);
            applyInsertEffect(false);
            setButtons({left: false, right: true})
            if(columns[0].color===""){
                setColor('#9e9e9e');
            }
            else{
                setColor('#'+columns[0].color);
            }
        }
    })

    const setAllSelected = (u : Array<user>) => {
        const usersselection : Array<selection> = [];
        u.map((element: user) =>{
            usersselection.push({user_id: element.user_id, checked: true});
        })
        setSelected(usersselection);
        setFiltered(data[index].cards);
    }

    const setFilteredActivities = (d: Array<column>, i: number, s:Array<selection>) =>{ 
        const filteredData :  Array<card> = [];
        d[i]?.cards?.map((element: any) => {
                const found = s.find(item => item.user_id == element.owner_user_id);
                if(found !== undefined && found.checked){
                    filteredData.push(element);
                }
        })
        setFiltered(filteredData)
    }

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

    const retrieveIndex = (cardIndex: number) =>{
        setCardIndex(cardIndex);
        const curr = activities!=null ? activities.find(item => item.card_id === cardIndex) : [];

        updateCurrentCard(curr);

    }

    const handleLeftClick = async (card_id : number) => {
        const apikey = cookieCutter.get('apikey');
        const host = cookieCutter.get('host');
        const formData = JSON.stringify({
            "column_id": data[index - 1].column_id,
        });
        const response = await  fetch(urlCloud+`moveCard/${host}/${card_id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "apikey": apikey
            },
            body: formData
        })
        if(response.ok) {
            const data : any = await response.json();
            if(data.error){
                cookieCutter.set('apikey', '', { expires: new Date(0) })
                cookieCutter.set('host', '', { expires: new Date(0) })
                cookieCutter.set('email', '', { expires: new Date(0) })
                cookieCutter.set('userid', '', { expires: new Date(0) }) 
                router.replace({pathname: '/'});
            }
            else {
                const cardIndex = activities ? activities.findIndex((ele : card )=> ele.card_id === card_id) : -1;
                moveCards(index, cardIndex, index -1);
                setIndex(index-1);
                if(index-1 === 0){
                    setButtons({left: false, right: true})
                }
                else if(index-1 === data.length-1){
                    setButtons({left: true, right: false})
                }
                else{
                    setButtons({left: true, right: true})
                }
        
                if(columns[index-1].color === ''){
                    setColor('#9e9e9e');
                }
                else{
                    setColor('#'+columns[index-1].color);
                }
            }
        }
        else {
            cookieCutter.set('apikey', '', { expires: new Date(0) })
            cookieCutter.set('host', '', { expires: new Date(0) })
            cookieCutter.set('email', '', { expires: new Date(0) })
            cookieCutter.set('userid', '', { expires: new Date(0) })
            router.replace({pathname: '/'});
        }
    };

    const handleRightClick =  async (card_id : number) => {
        const apikey = cookieCutter.get('apikey');
        const host = cookieCutter.get('host');
        const formData = JSON.stringify({
            "column_id": data[index + 1].column_id,
        });
        const response = await  fetch(urlCloud+`moveCard/${host}/${card_id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "apikey": apikey
            },
            body: formData
        })
        if(response.ok) {
            const data : any = await response.json();
            if(data.error){
                cookieCutter.set('apikey', '', { expires: new Date(0) })
                cookieCutter.set('host', '', { expires: new Date(0) })
                cookieCutter.set('email', '', { expires: new Date(0) })
                cookieCutter.set('userid', '', { expires: new Date(0) })
                router.replace({pathname: '/'});
            }
            else{
                const cardIndex = activities ? activities.findIndex((ele : card )=> ele.card_id === card_id) : -1;
                moveCards(index, cardIndex, index + 1)
                setIndex(index+1);
                if(index+1 === 0){
                    setButtons({left: false, right: true})
                }
                else if(index+1 === data.length-1){
                    setButtons({left: true, right: false})
                }
                else{
                    setButtons({left: true, right: true})
                }
        
                if(columns[index+1].color === ''){
                    setColor('#9e9e9e');
                }
                else{
                    setColor('#'+columns[index+1].color);
                }
            }
        }
        else {
            cookieCutter.set('apikey', '', { expires: new Date(0) })
            cookieCutter.set('host', '', { expires: new Date(0) })
            cookieCutter.set('email', '', { expires: new Date(0) })
            cookieCutter.set('userid', '', { expires: new Date(0) })
            router.replace({pathname: '/'});
        }
    };



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
                <ColumnTitle name={data[index].name} left={buttons.left} right={buttons.right} color={color} returnResponse={returnResponse} parent_column_id={data[index].parent_column_id} workflow_name={workflow_name} users={users} selected={selected} setFilter={setFilter}/>
                <div className={Dynamicboard.grid}>
                    { activities != null && activities.map((element: any) =>
                        <div key={element.key} className={Dynamicboard.cardContainer}>
                            <div className={Dynamicboard.buttons} />
                            <ActivityCard card_id={element.card_id}  color={element.color} owner_avatar={element.owner_avatar} title={element.title} owner_username={element.owner_username} co_owner_usernames={element.co_owner_usernames} co_owner_avatars={element.co_owner_avatars} description={element.description} retrieveIndex={retrieveIndex} displayModal={displayModal}/>
                            <div className={Dynamicboard.buttons} onClick={() => handleRightClick(element.card_id)}>
                                { !element.is_blocked && buttons.right &&
                                    <FontAwesomeIcon icon={faCircleArrowRight} style={{color: "#000000"}} />
                                }
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}


export default CardsWorkflow;