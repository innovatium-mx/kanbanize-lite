import { OpenedInitiativeCardProps, Attachment, comment, Author } from "../types/types"
import openedCard from '../styles/OpenedActivityCard.module.css';
import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faXmark, faChevronDown, faPaperclip} from '@fortawesome/free-solid-svg-icons';
import adjustColor from '../helpers/lightenColor';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import CommentContainer from './CommentContainer';
import LinkedActivityContainer from './LinkedActivitiesContainer';
import axios from 'axios';
import {urlCloud} from '../constants';
import { TailSpin } from  'react-loader-spinner'
import Swal from 'sweetalert2';
const cookieCutter= require('cookie-cutter');


const OpenedInitiativeCard = ({title, owner, owner_avatar, co_owner_usernames, co_owner_avatars, description, setDisplayCard, color, card_id, comment_count, linked_cards, openedCardOwner, openedCardComments, openedCardAddComment, openedCardCoowner, openedCardActivities}: OpenedInitiativeCardProps) =>{

    const router = useRouter();

    const [openComments, setOpenComments] = useState<boolean>(false);
    const [openActivities, setOpenActivities] = useState<boolean>(false);


    const [arrowDown, setArrowDown] = useState<string>(openedCard.nonRotated);
    const [initiativeArrowDown, setInitiativeArrowDown] = useState<string>(openedCard.nonRotated)


    const [isExpanded, setIsExpanded] = useState('none');
    const [initiativeIsExpanded, setInitiativeIsExpanded] = useState('none');

    
    const [currCoBg1, setCurrCoBg1] = useState<string | undefined>('#ff0000');
    const [currCoBg2, setCurrCoBg2] = useState<string | undefined>('#ff0000');
    const [currCoBg3, setCurrCoBg3] = useState<string | undefined>('#ff0000');

    const [commentsArray, setCommentsArray] = useState<Array<comment | null>>([]);
    const [newComment, setNewComment] = useState<string>("");
    const [file, setFile] = useState<File | undefined>();
    const [hasFile, setHasFile] = useState<boolean>(false);
    const [preview, setPreview] = useState<string>("");

    const [justSent, setJustSent] = useState<string>('');
    const [arrowOpenedCounter, setArrowOpenedCounter] = useState<number>(0);
    const [firstOpen, setFirstOpen] = useState<boolean>(false);
    //change send icon to loading
    const [sending, setSending] = useState<boolean>(false);

    const windowHeight = useRef([window.innerHeight]);
    const componentRef = useRef<any>(null);
    const [openedCardHeight, setOpenedCardHeight] = useState({height:0})
    const [scrollClass, setScrollClass] = useState(openedCard.nonScroll);
    const [justResized, setJustResized] = useState<boolean>(false);

    const apikey = cookieCutter.get('apikey');
    const host = cookieCutter.get('host');
    const sessionUsername = cookieCutter.get('username');
    const sessionAvatar = cookieCutter.get('avatar');

    var today : Date = new Date();
    const[localCommentsCount, setLocalCommentsCount] = useState<number>(comment_count);

    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const tempFile = e.target.files[0];
            if(tempFile.size / 1024 > 15000){
                //e.target.value = null;
                setHasFile(false);
                Swal.fire({
                    icon: 'warning',
                    title: 'File size must not be greater than to 15MB',
                    showCloseButton: true
                })
                return;
            }
            else{
                setFile(tempFile);
                setHasFile(true);
                if( tempFile.type.indexOf( 'image/' ) > -1 ){
                    setPreview(URL.createObjectURL(tempFile));
                }
                else{
                    setPreview("/file.png");
                }
            }
        }
        else{
            Swal.fire({
                icon: 'error',
                title: 'There was an error uploading the file',
                showCloseButton: true
            })
            setHasFile(false);
            return;
        }
    };

    const getCurrentTime = () =>{
        let hours : string = (today.getHours().toString().length == 0 ? '0' + today.getHours().toString() : today.getHours().toString());
        let minutes : string = (today.getMinutes().toString().length == 0 ? '0' + today.getMinutes().toString() : today.getMinutes().toString());
        let seconds : string = (today.getSeconds().toString().length == 0 ? '0' + today.getSeconds().toString() : today.getSeconds().toString());

        const finalTime : string= hours + ":" + minutes + ":" + seconds;
        return finalTime;
    }


    useLayoutEffect(()=>{
        if(componentRef.current) {
            setOpenedCardHeight({height: componentRef.current.clientHeight})
        }
    },[])

    useLayoutEffect(()=>{
        if((openedCardHeight.height > windowHeight.current[0]) && justResized == false){
                setScrollClass(openedCard.scroll)
                document.documentElement.style.setProperty('--dynamic-opened-card-height-', (windowHeight.current[0]-50).toString() + 'px');
                document.documentElement.style.setProperty('--dynamic-scroll-', 'scroll');
            setJustResized(true);
        }
    })

    
    const pushComment = (text: string, last_modified: string, author: Author, attachment: Array<Attachment>) =>{
        var decoyCommentsArray : Array<comment | null> = ([]);
        decoyCommentsArray = commentsArray;

        const newComment : comment= {
            "text" : text,
            "last_modified" : last_modified,
            "author": author, 
            "attachments": attachment,
        }

        decoyCommentsArray.push(newComment);
        setCommentsArray(decoyCommentsArray);
    }

    const getComments = async ()=>{
        //get comments request
        const response = await fetch(`${urlCloud}comments/${host}/${card_id}`, {
            method: "GET",
            headers: {
                "apikey": apikey
            }
        })
        const data = await response.json();
        if(data.error){
             //error
            cookieCutter.set('apikey', '', { expires: new Date(0) })
            cookieCutter.set('host', '', { expires: new Date(0) })
            cookieCutter.set('email', '', { expires: new Date(0) })
            cookieCutter.set('userid', '', { expires: new Date(0) })
            cookieCutter.set('avatar', '', { expires: new Date(0) })
            cookieCutter.set('username', '', { expires: new Date(0) }) 
            cookieCutter.set('workspace', '', { expires: new Date(0) })
            router.replace({pathname: '/'});
            if(data.error === 429){
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
                    title: 'Muchas peticiones'
                    })
            }
            else if(data.error === 401){
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
                title: 'Token inválido'
                })
            }
            else {
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
        else{
            for(var x = 0; x<data.length; x++){
                pushComment(data[x].text, data[x].last_modified, data[x].author, data[x].attachments);
            }
            setArrowOpenedCounter(arrowOpenedCounter+1);
        }
    }

    const handleOpenComments = () =>{
        setOpenComments(!openComments);

        if(openComments){
            setArrowDown(openedCard.rotated);
            setFirstOpen(true);

            //fetch is done only if comment count > 0
            if(localCommentsCount>0){
                if(arrowOpenedCounter === 0){
                    getComments();
                }
                //renders comments component only if comments array isn't empty
                setIsExpanded('block');
            }
            else{
                setIsExpanded('none');
                setArrowDown(openedCard.nonRotated);
            }
                
        }
        else{
            setIsExpanded('none');
            setArrowDown(openedCard.nonRotated);
        }

    }

    const handleOpenActivities = () =>{
        setOpenActivities(!openActivities);

        if(openActivities){
            setInitiativeArrowDown(openedCard.rotated);

            if(linked_cards.length > 0){
                setInitiativeIsExpanded('block')
            }
            else{
                setInitiativeIsExpanded('none');
                setInitiativeArrowDown(openedCard.nonRotated);
            }

        }else{
            setInitiativeIsExpanded('none');
            setInitiativeArrowDown(openedCard.nonRotated);
        }
    }




    const handleNewComment = (e: {
        target: { value: React.SetStateAction<string> };
      }) =>{
        setNewComment(e.target.value);
    }


    const handleSend = async () =>{ //when send button is clicked, the comment is post

        if(newComment != "" || hasFile){

            const formData = new FormData();
            formData.append("text", newComment);
            const config = {
                headers: {
                    "apikey": apikey
                }
            }
            if(hasFile && file !== undefined){
                formData.append("file", file);
                formData.append("fileName", file.name);
            }


            try{
                const res = await axios.post(
                `${urlCloud}comments/${host}/${card_id}`,
                formData, config
                );

                setSending(false)

                const Toast = Swal.mixin({
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: false,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    },
                    willClose: () => {
                        clearInterval(1500)
                        }
                    })
                    
                Toast.fire({
                    icon: 'success',
                    title: 'Comment successfully sent'
                })




                const newAuthor: Author = {
                    "avatar": sessionAvatar,
                    "type" : "internal",
                    "username" : sessionUsername,
                    "value" : 0
                }

                const newAttachment: Array<Attachment> = [];

                if(res.data.attachment !== undefined){
                    newAttachment.push({
                        "id": 1,
                        "file_name": res.data.attachment.file_name,
                        "link" : res.data.attachment.link
                    })
                }

                if(firstOpen){
                    pushComment(newComment, getCurrentTime(), newAuthor, newAttachment);
                }
                setLocalCommentsCount(localCommentsCount+1);
                
            }
            catch(ex : any){
                setSending(false)
                cookieCutter.set('apikey', '', { expires: new Date(0) })
                cookieCutter.set('host', '', { expires: new Date(0) })
                cookieCutter.set('email', '', { expires: new Date(0) })
                cookieCutter.set('userid', '', { expires: new Date(0) })
                cookieCutter.set('avatar', '', { expires: new Date(0) })
                cookieCutter.set('username', '', { expires: new Date(0) }) 
                cookieCutter.set('workspace', '', { expires: new Date(0) })
                router.replace({pathname: '/'});
                if(ex.response.status === 429){
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
                    title: 'Muchas peticiones'
                    })
                }
                else if( ex.response.status  === 401){
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
                    title: 'Token inválido'
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
            
            
            //sets variable that rerenders comments component
            setHasFile(false);
            setJustSent('');
        }
        
        setNewComment("");

    }

    useLayoutEffect(()=>{
        document.documentElement.style.setProperty('--comments-display-', isExpanded);
        document.documentElement.style.setProperty('--activities-display-', initiativeIsExpanded);
    })

    const onCloseClick = () =>{
        setDisplayCard(false);
    }

    var letter = ''
    var letterBackground = ''

    //owner existance
    if(owner==undefined && owner_avatar==undefined){
        letter = 'N';
        letterBackground = '#505050';
    }
    else if(owner!=undefined && (owner_avatar=="" || owner_avatar==null)){
        letter = owner.charAt(0);
        letterBackground = '#' + color;
    }

    var letterCo : Array<string | undefined> = [undefined, undefined, undefined] 
    var letterCoBg : Array<string | undefined> = [undefined, undefined, undefined] 
    const grays : Array<string> = ['#6c6c6c','#929292','#cfcfcf'];

    if(co_owner_usernames!=null && co_owner_usernames!=undefined){

        for(var x = 0; x < co_owner_usernames.length; x++){
            //coOwner[x] existance
            if(co_owner_usernames!=null && co_owner_avatars!=null && (co_owner_avatars[x]===undefined || co_owner_avatars[x]===null || co_owner_avatars[x]==="")){ // coOwners exist, but don't have avatar
                letterCo[x]=co_owner_usernames[x]?.charAt(0);
                letterCoBg[x]=adjustColor('#' + color, 500*(x+0.7)/10);
            }
        }
    }

    for(var y=0; y < 3; y++){
        if(letterCo[y]==undefined || co_owner_usernames==null || co_owner_usernames==undefined){ // coOwners doesn't exist
            letterCo[y] = 'N';
            letterCoBg[y] = grays[y];
        }
    }

    useLayoutEffect(()=>{
        setCurrCoBg1(letterCoBg[0])
        setCurrCoBg2(letterCoBg[1])
        setCurrCoBg3(letterCoBg[2])
    })
    

    return(
        <>
            <div className={openedCard.modalBackground}>

                <div className={scrollClass} ref={componentRef}>

                    <div className={openedCard.Card}>
                        <div className={openedCard.close}>
                            <button className={openedCard.closeButton} onClick={() => onCloseClick()}>
                                <FontAwesomeIcon icon={faXmark} style={{color: "#62656a", height: "2em"}} />
                            </button>
                        </div>

                        <div className={openedCard.title}>
                            {title}
                        </div>

                        <div className={openedCard.ownersWrap}>
                            
                            <div className={openedCard.owner}>
                                {owner_avatar!="" && owner_avatar!=undefined && <img src={owner_avatar} alt="owner_avatar" className={openedCard.ownerPhoto}/> /*user exists and have photo*/} 
                                {owner==undefined && owner_avatar==undefined && <div className={openedCard.ownerPhoto} style={{backgroundColor:letterBackground}}><div className={openedCard.letter}>{letter}</div></div> /*user doesn't exis*/}
                                {owner!=null && (owner_avatar=="" || owner_avatar== null) && <div className={openedCard.ownerPhoto} style={{backgroundColor:letterBackground}}><div className={openedCard.letter}>{letter}</div></div> /*user exists, but doesn't have photo*/}

                                <div>{openedCardOwner}</div>
                            </div>


                            <div className={openedCard.coOwners}>

                                {co_owner_usernames!=null && co_owner_avatars!=null && (co_owner_avatars[0]!=null && co_owner_avatars[0]!=undefined && co_owner_avatars[0]!="") && <img src={co_owner_avatars[0]} alt="owner_avatar1" className={openedCard.image1}/>}
                                {/*coOwners exists, coOwner1 have photo*/}
                                {co_owner_usernames!=null && co_owner_avatars!=null && (co_owner_avatars[0]===null || co_owner_avatars[0]===undefined || co_owner_avatars[0]==="") && <div className={openedCard.image1} style={{backgroundColor:currCoBg1}}><div className={openedCard.letter}>{letterCo[0]}</div></div>}
                                {/*coOwners exists, coOwner1 doesn't have photo*/}
                                {co_owner_usernames==null && <div className={openedCard.image1} style={ {backgroundColor:currCoBg1}}><div className={openedCard.letter}>{letterCo[0]}</div></div>}
                                {/*coOwners doesn't exist*/}
                                
                                {co_owner_usernames!=null && co_owner_avatars!=null && (co_owner_avatars[1]!=null && co_owner_avatars[1]!=undefined && co_owner_avatars[1]!="") && <img src={co_owner_avatars[1]} alt="owner_avatar1" className={openedCard.image2}/>}
                                {/*coOwners exists, coOwner2 have photo*/}
                                {co_owner_usernames!=null && co_owner_avatars!=null && (co_owner_avatars[1]===null || co_owner_avatars[1]===undefined || co_owner_avatars[1]==="") && <div className={openedCard.image2} style={{backgroundColor:currCoBg2}}><div className={openedCard.letter}>{letterCo[1]}</div></div>}
                                {/*coOwners exists, coOwner2 doesn't have photo*/}
                                {co_owner_usernames==null && <div className={openedCard.image2} style={{backgroundColor:currCoBg2}}><div className={openedCard.letter}>{letterCo[1]}</div></div>}
                                {/*coOwners doesn't exist*/}

                                {co_owner_usernames!=null && co_owner_avatars!=null && (co_owner_avatars[2]!=null && co_owner_avatars[2]!=undefined && co_owner_avatars[2]!="") && <img src={co_owner_avatars[2]} alt="owner_avatar1" className={openedCard.image3}/>}
                                {/*coOwners exists, coOwner3 have photo*/}
                                {co_owner_usernames!=null && co_owner_avatars!=null && (co_owner_avatars[2]===null || co_owner_avatars[2]===undefined || co_owner_avatars[2]==="") && <div className={openedCard.image3} style={{backgroundColor:currCoBg3}}><div className={openedCard.letter}>{letterCo[2]}</div></div>}
                                {/*coOwners exists, coOwner3 doesn't have photo*/}
                                {co_owner_usernames==null && <div className={openedCard.image3} style={{backgroundColor:currCoBg3}}><div className={openedCard.letter}>{letterCo[2]}</div></div>}
                                {/*coOwners doesn't exist*/}

                                {<div  style={{paddingTop:'4em'}}>{openedCardCoowner}</div>}

                            </div>

                        </div>

                        <div className={openedCard.description}>
                            {<div dangerouslySetInnerHTML={{ __html: description }} />}
                        </div>

                        <div className={openedCard.addComment}>

                            <div className={openedCard.cameraIcon}>
                                <label htmlFor="file-input">
                                    {
                                        !hasFile ? 
                                        <FontAwesomeIcon icon={faPaperclip} style={{color:'gray', transform: `rotate(-45deg)`}}/> :
                                        <div className={openedCard.fileContainer}>
                                            <div>
                                                <img className={openedCard.preview} src={preview} alt="Your image" />
                                            </div>
                                            <div className={openedCard.fileName}>
                                                {file !== undefined ? file.name : ""}
                                            </div>
                                        </div>
                                    }
                                </label>
                                <input type="file" id="file-input" name="file" onChange={handleChange} />
                            </div>

                            <input type="text" className={openedCard.inputComment} name = 'addComment' placeholder={openedCardAddComment} onChange={handleNewComment} value={newComment}></input>

                            <button className={openedCard.sendButton} onClick={()=>{handleSend(); setSending(true)}}>
                            {sending ? <TailSpin
                                        height="30"
                                        width="30"
                                        color="#2666BE"
                                        ariaLabel="tail-spin-loading"
                                        radius="1"
                                        wrapperStyle={{}}
                                        wrapperClass=""
                                        visible={true}
                                        />
                                        : <img src="/send/blue_send_button.png" className={openedCard.send} />}
                            
                        </button>     
                            
                        </div>

                        <div className={openedCard.line}></div>

                        <div className={openedCard.commentsWrap}>
                            <div className={openedCard.commentsText}>
                                {openedCardComments} <span style={{fontWeight:'600'}}> {"(" + localCommentsCount + ")"} </span>
                            </div>

                            <button onClick={()=>{handleOpenComments()}} className={openedCard.arrowButton}>
                                <FontAwesomeIcon icon={faChevronDown} className={arrowDown}/>
                            </button>
                        </div>

                        <CommentContainer commentsArray={commentsArray} justSent={justSent} arrowDown={arrowDown} color={color}/>

                        <div className={openedCard.line}></div>

                        <div className={openedCard.commentsWrap}>
                            <div className={openedCard.commentsText}>
                                {openedCardActivities} <span style={{fontWeight:'600'}}> {"(" + linked_cards.length + ")"} </span>
                            </div>

                            <button onClick={()=>{handleOpenActivities()}} className={openedCard.arrowButton}  style={{marginLeft:'0.5em'}}>
                                <FontAwesomeIcon icon={faChevronDown} className={initiativeArrowDown}/>
                            </button>
                        </div>

                        <LinkedActivityContainer linked_cards={linked_cards} color={color}/>


                    </div>

                </div>

            </div>
        </>
    )
}

export default OpenedInitiativeCard;