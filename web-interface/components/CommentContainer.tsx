import Comment from './Comment';
import openedCard from '../styles/OpenedActivityCard.module.css';
import {useRef, useEffect} from 'react';
import { CommentContainerProps } from '../types/types';



const CommentContainer = ({commentsArray, justSent, arrowDown, color} : CommentContainerProps) =>{
    const bottomRef = useRef<null | HTMLDivElement>(null);

    useEffect(()=>{
        bottomRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [justSent, arrowDown])

    return(
        <>
            <div className={openedCard.commentsContainer}>
                {commentsArray.map((element: any, index)=> 
                    <Comment key={element.key} text={element.text} last_modified={element.last_modified} avatar={element.author.avatar} color={color} username={element.author.username} attachments={element.attachments}/>
                )} 
            </div>
        </>
    )

}

export default CommentContainer;