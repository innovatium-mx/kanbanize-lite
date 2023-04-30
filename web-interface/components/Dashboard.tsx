import boardStyle from '../styles/Board.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from "next/router";

export type boardCard = {
    board_id: number,
    workspace_id: number,
    is_archived: number,
    name: string, 
    description: string,
    index: number
}

const DashBoard = ({board_id, workspace_id, is_archived, name, description, index}: boardCard) => {

    //const forceUpdate = useForceUpdate();
    const router = useRouter();
    const colorsArray = Array(('E6186A'), ('43AF4A'), ('2666BE'),('F48A32'));
    const [cardColor, setCardColor] = useState('');



    
    const HandleColorUpdate = (index : any) =>{
        //cardColor = "#" + colorsArray[Math.floor(Math.random()*colorsArray.length)];
        var newIndex=0;
  
        if(index === 0){newIndex = 0;}
        else if(index%4 === 0){newIndex = 0;}
        else if(index%5 === 0 || index === 1){newIndex = 1;}
        else if(index%6 === 0 || index === 2){newIndex = 2;}
        else{
            newIndex = 3;
        }

        useEffect(()=>{
            setCardColor(colorsArray[newIndex]);
        })

        //return {backgroundColor: `cardColor`};
        return cardColor;
    }

    const handleClick = () => {
        router.replace({pathname: 'board/[board_id]', query: { board_id: board_id}});
    };

    return(
        <div className={boardStyle.boardCard} onClick={() => handleClick()}>
            <header className={boardStyle.topCard} style={{backgroundColor: "#" + HandleColorUpdate(index)}}>{board_id}</header>
            <div>{name.toUpperCase()}</div>
            <div></div>
            <div>{description}</div>
        </div>
    )
}

export default DashBoard;