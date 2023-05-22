import floatbutton from '../styles/FloatButton.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons';


const FloatButton = () =>{



    return(

        <>
        
            <div className={floatbutton.buttonContainer}>
                <button className={floatbutton.FloatButton}>
                    <FontAwesomeIcon icon={faPlus} className={floatbutton.plus}/>
                </button>
            </div>
        
        
        
        </>
    
    )

}

export default FloatButton;