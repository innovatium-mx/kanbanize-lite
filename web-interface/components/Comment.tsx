import comment from '../styles/Comment.module.css'

export type CommentProps = {
    "text" : string,
    "last_modified" : string,
    "avatar" : string
}

const Comment = ({text, last_modified, avatar}: CommentProps) =>{


    const position = last_modified.search('T');
    const finalDate = last_modified.slice(position+1, position+9);




    return (

        <>
            <div className={comment.comment}>
                <div className={comment.photoTimeWrap}>
                    <img src={avatar} alt="owner_avatar" className={comment.photo}/>
                    <span className={comment.time}>{finalDate}</span>
                </div>

                <div className={comment.text}>
                    {<div dangerouslySetInnerHTML={{ __html: text }} />}
                </div>

            </div>


        </>
    )

}

export default Comment;