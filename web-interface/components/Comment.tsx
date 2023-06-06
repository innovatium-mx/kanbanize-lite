import comment from '../styles/Comment.module.css'
import { CommentProps } from '../types/types';

const Comment = ({text, last_modified, avatar, color, username, attachments}: CommentProps) =>{


    const position = last_modified.search('T');
    const finalDate = last_modified.slice(position+1, position+9);


    return (

        <>
            <div className={comment.comment}>
                <div className={comment.photoTimeWrap}>

                    {(avatar && avatar!="") && <img src={avatar} alt="owner_avatar" className={comment.photo}/>}
                    {(avatar === null || avatar == "") && <div className={comment.photo} style={{backgroundColor:'#'+color}}>
                        <div className={comment.letter}>
                            {username?.charAt(0)}    
                        </div>    
                    </div>}


                    <span className={comment.time}>{finalDate}</span>
                </div>

                <div className={comment.text}>
                    {<div dangerouslySetInnerHTML={{ __html: text }} />}
                </div>
                {attachments.map((element: any, index) =>
                    <div key={element.key} className={comment.attachments}>
                        <a href={element.link} dangerouslySetInnerHTML={{ __html: element.file_name }} />
                    </div>
                )}

            </div>

        </>
    )

}

export default Comment;