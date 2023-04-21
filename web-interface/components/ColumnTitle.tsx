import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';

type ColumnTitleProps = {
    name: string,
    left: boolean,
    right: boolean, 
    returnResponse: any,
}

const ColumnTitle = ({name, left, right, returnResponse} : ColumnTitleProps) => {

    const handleLeftClick = () => {
        returnResponse(-1);
    }

    const handleRightClick = () => {
        returnResponse(1);
    }

    return(
        <>
            <div>
                { left && 
                    <FontAwesomeIcon onClick={() => handleLeftClick()} icon={faAngleLeft} size="xl"/>
                }
                    <h2>{name}</h2>
                { right && 
                    <FontAwesomeIcon onClick={() => handleRightClick()} icon={faAngleRight} size="xl"/>
                }
            </div>
        </>
    )
}


export default ColumnTitle;