import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import columntitle from '../styles/ColumnTitle.module.css';

type ColumnTitleProps = {
    name: string,
    left: boolean,
    right: boolean,
    color: string,
    returnResponse: any,
}

const ColumnTitle = ({name, left, right, color, returnResponse} : ColumnTitleProps) => {
    console.log(color);
    const handleLeftClick = () => {
        returnResponse(-1);
    }

    const handleRightClick = () => {
        returnResponse(1);
    }

    return(
        <>
                <label className={columntitle.container} style={{ backgroundColor: color }}>
                    { left && 
                        <FontAwesomeIcon className={columntitle.leftright} onClick={() => handleLeftClick()} icon={faAngleLeft} size="xl"/>
                    }
                        <span className={columntitle.title}>{name}</span>
                    { right && 
                        <FontAwesomeIcon className={columntitle.leftright} onClick={() => handleRightClick()} icon={faAngleRight} size="xl"/>
                    }
                </label >
        </>
    )
}


export default ColumnTitle;