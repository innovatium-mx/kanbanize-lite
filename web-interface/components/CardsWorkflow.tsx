import ColumnTitle from './ColumnTitle';
import {useEffect, useState, useLayoutEffect, useCallback, useRef } from "react";
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router'
import Dynamicboard from '../styles/Dynamicboard.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCircleArrowLeft, faCircleArrowRight} from '@fortawesome/free-solid-svg-icons';
import {urlCloud} from '../constants'
import {column, card, user, selection} from '../types/types';
import Swal from 'sweetalert2';


const cookieCutter= require('cookie-cutter');

type CardsWorkflowProps = {
    data: Array<column>,
    users: Array<user>,
    workflow_name: string,
    updateCurrentCard: any,
    displayModal: any,
    moveCards: any,
    goBack : boolean,
    applyInsertEffect : (val:boolean) => void,
    filterSelectAll : string,
    requests: string,
    invalid: string
}

type showButtons = {
    left: boolean,
    right: boolean
};

const CardsWorkflow = ({data, users, workflow_name, updateCurrentCard, displayModal, moveCards, goBack, applyInsertEffect, filterSelectAll, requests, invalid} : CardsWorkflowProps) => {
    const router = useRouter();
    const [index, setIndex] = useState<number>(0);
    const [buttons, setButtons] = useState<showButtons>({left: false, right: true});
    const [color, setColor] = useState<string>('#9e9e9e');
    const [activities, setActivities] = useState<Array<card> | null>([]);
    const [filtered, setFiltered] = useState<Array<card> | null>([...data[0].cards]);
    const [allFiltered, setAllFiltered] = useState<boolean>(true);
    const [filterUsers, setFilterUsers] = useState<Array<user>>(users);
    const allFilteredRef : any = useRef(null);
    allFilteredRef.current = allFiltered;

    const [selected, setSelected] = useState<Array<selection>>([]);
    const columns = data;

    const ActivityCard = dynamic(import('../components/ActivityCard'), {ssr:false});
    const [cardIndex, setCardIndex] = useState(0);
    const [ getToBacklog, setGetToBacklog] = useState<boolean>(false);
    const [filteredChanged, setFilteredChanged] = useState<boolean>(false);
    
    const [, updateState] = useState<{}>();
    const forceUpdate = useCallback(() => updateState({}), []);

    const [artificialKey, setArtificialKey] = useState<boolean>(false);
    const [selfFound, setSelfFound] = useState<boolean>(false);
    const userId = cookieCutter.get('userid');

    //console.log(filterUsers)

    useEffect(()=>{
        setFilterUsers(users);
        if(selected.length !== users.length){
            setAllSelected(users);
        }
    });


    useEffect(()=>{
        if(allFiltered)
        {
            setActivities(data[index].cards);
        }
            
        else{
            setActivities(filtered);
        }
    })


    useLayoutEffect(()=>{
        setActivities(filtered);
    },[filtered]);

    useEffect(()=>{
        setGetToBacklog(goBack);
    }, [goBack])

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
        setFilteredActivities(data, index, selected);
    }, [data, index, selected]);

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

    },[getToBacklog])

    const setAllSelected = (u : Array<user>) => {
        const usersselection : Array<selection> = [];
        u.map((element: user) =>{
            usersselection.push({user_id: element.user_id, checked: true});
        })
        setSelected(usersselection);
        setFiltered(data[index].cards);
        setFilteredChanged(false);

        setAllFiltered(true);
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

            if(found?.user_id == userId){
                setSelfFound(true);
                forceUpdate();
            }

        })
        setFiltered(filteredData)
        setFilteredChanged(true);

        if(filteredData.length === data[index].cards.length){
            setAllFiltered(true);
        }
        else if(selfFound){

            setAllFiltered(true);
            forceUpdate();

            setAllFiltered(false);
            setSelfFound(false);
        }
        else{
            setAllFiltered(false);
        }

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
        const moveData : any = await response.json();
        if(moveData.error){
            cookieCutter.set('apikey', '', { expires: new Date(0) })
            cookieCutter.set('host', '', { expires: new Date(0) })
            cookieCutter.set('email', '', { expires: new Date(0) })
            cookieCutter.set('userid', '', { expires: new Date(0) })
            cookieCutter.set('avatar', '', { expires: new Date(0) })
            cookieCutter.set('username', '', { expires: new Date(0) }) 
            cookieCutter.set('workspace', '', { expires: new Date(0) })
            router.replace({pathname: '/'});
            if(moveData.error === 429){
                const Toast = Swal.mixin({
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: false,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
                })             
                Toast.fire({
                icon: 'error',
                title: requests
                })
            }
            else if(moveData.error === 401){
                const Toast = Swal.mixin({
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: false,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
                })             
                Toast.fire({
                icon: 'error',
                title: invalid
                })
            }
            else{
                const Toast = Swal.mixin({
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: false,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
                })             
                Toast.fire({
                icon: 'error',
                title: 'Error'
                })
            }
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
        const moveData : any = await response.json();
        if(moveData.error){
            cookieCutter.set('apikey', '', { expires: new Date(0) })
            cookieCutter.set('host', '', { expires: new Date(0) })
            cookieCutter.set('email', '', { expires: new Date(0) })
            cookieCutter.set('userid', '', { expires: new Date(0) })
            cookieCutter.set('avatar', '', { expires: new Date(0) })
            cookieCutter.set('username', '', { expires: new Date(0) }) 
            cookieCutter.set('workspace', '', { expires: new Date(0) })
            router.replace({pathname: '/'});
            if(moveData.error === 429){
                const Toast = Swal.mixin({
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: false,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
                })             
                Toast.fire({
                icon: 'error',
                title: requests
                })
            }
            else if(moveData.error === 401){
                const Toast = Swal.mixin({
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: false,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
                })             
                Toast.fire({
                icon: 'error',
                title: invalid
                })
            }
            else{
                const Toast = Swal.mixin({
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: false,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
                })             
                Toast.fire({
                icon: 'error',
                title: 'Error'
                })
            }
        }
        else {
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
            
            <div>
                <div style={{position: 'fixed', paddingTop:'5.6em', width:'100%', zIndex:'1'}}>
                        <ColumnTitle filterSelectAll={filterSelectAll} name={data[index].name} left={buttons.left} right={buttons.right} color={color} returnResponse={returnResponse} parent_column_id={data[index].parent_column_id} workflow_name={workflow_name} users={filterUsers} selected={selected} setFilter={setFilter}/>
                    </div>
                    <div className={Dynamicboard.grid}>
                        { activities != null && activities.map((element: any) =>
                            <div className={Dynamicboard.cardContainer} key={element.key} >
                                <div className={Dynamicboard.buttons} />
                                <ActivityCard card_id={element.card_id}  color={element.color} owner_avatar={element.owner_avatar} title={element.title} owner_username={element.owner_username} retrieveIndex={retrieveIndex} displayModal={displayModal} lane_name={element.lane_name} lane_color={element.lane_color}/>
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