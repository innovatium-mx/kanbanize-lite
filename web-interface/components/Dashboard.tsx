import boardStyle from '../styles/Board.module.css';
import { useState, useEffect } from 'react';

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

    const colorsArray = Array(('E6186A'), ('43AF4A'), ('2666BE'),('F48A32'));
    const [cardColor, setCardColor] = useState('');
    console.log(index);



    
    const HandleColorUpdate = (index : any) =>{
        //cardColor = "#" + colorsArray[Math.floor(Math.random()*colorsArray.length)];
        var newIndex=0;
  
        if(index === 0){newIndex = 0;}
        else if(index%3 === 0){newIndex = 0;}
        else if(index%4 === 0 || index === 1){newIndex = 1;}
        else if(index%5 === 0 || index === 2){newIndex = 2;}
        else{
            newIndex = 3;
        }

        useEffect(()=>{
            setCardColor(colorsArray[newIndex]);
        }, [])

        console.log(cardColor);
        //return {backgroundColor: `cardColor`};
        return cardColor;
    }

    return(
        <div className={boardStyle.boardCard}>
            <header className={boardStyle.topCard} style={{backgroundColor: "#" + HandleColorUpdate(index)}}>{board_id}</header>
            <div>{name.toUpperCase()}</div>
            <div></div>
            <div>{description}</div>
        </div>
    )
}

export default DashBoard;