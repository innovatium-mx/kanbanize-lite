import { comment } from '../components/OpenedActivityCard';
import Comment from './Comment';
import openedCard from '../styles/OpenedActivityCard.module.css';
import {useRef, useEffect} from 'react';

export type CommentContainerProps = {
    "commentsArray" : Array<comment | null>,
    "justSent" : string,
    "arrowDown" : any
}

const CommentContainer = ({commentsArray, justSent, arrowDown} : CommentContainerProps) =>{
    const bottomRef = useRef<null | HTMLDivElement>(null);

    // scrolls to the bottom of the component
    useEffect(()=>{
        console.log('KITI');
        bottomRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [justSent, arrowDown])

    return(
        <>
            <div className={openedCard.commentsContainer}>
                {commentsArray.map((element: any, index)=> 
                    <Comment key={element.key} text={element.text} last_modified={element.last_modified} avatar={element.author.avatar}/>
                )} 
            </div>
        </>
    )

}

export default CommentContainer;