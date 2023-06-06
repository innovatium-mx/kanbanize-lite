import activity from '../styles/Activity.module.css';

export type ActivityProps = {
    card_id : number,
    title : string,
    color : string
}


const Activity = ({card_id, title, color}: ActivityProps) =>{

    return (

        <>
            <div className={activity.activity}>
                <div className={activity.idContainer}  style={{backgroundColor:'#'+color}}>
                    <span>ID: {card_id} </span>
                </div>

                <div className={activity.title}>
                    <span>{title}</span>

                </div>

            </div>

        </>
    )

}

export default Activity;