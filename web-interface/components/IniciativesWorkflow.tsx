import { useState } from 'react';
import {column, user, card, selection} from '../types/types';
import ColumnTitle from './ColumnTitle';


const cookieCutter= require('cookie-cutter');

type IniciativesWorkflowProps = {
    data: Array<column>,
    users: Array<user>,
    workflow_name: string,
}

type showButtons = {
    left: boolean,
    right: boolean
};

const IniciativesWorkflow = ({data, users, workflow_name} : IniciativesWorkflowProps) =>{
    const [index, setIndex] = useState<number>(0);
    const [buttons, setButtons] = useState<showButtons>({left: false, right: true});
    const [color, setColor] = useState<string>('#9e9e9e');
    const [filtered, setFiltered] = useState<Array<card> | null>([]);
    const [selected, setSelected] = useState<Array<selection>>([]);

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
            <div style={{position: 'fixed', paddingTop:'5.6em', width:'100%', zIndex:'1'}}>
                <ColumnTitle name={data[index].name} left={buttons.left} right={buttons.right} color={color} returnResponse={returnResponse} parent_column_id={data[index].parent_column_id} workflow_name={workflow_name} users={users}/>
            </div>
        
        
        
        </>

    )
}

export default IniciativesWorkflow;