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
    const handleLeftClick = () => {
        returnResponse(-1);
    }

    const handleRightClick = () => {
        returnResponse(1);
    }

    return(
        <>
            <div className={columntitle.container} style={{ backgroundColor: color }}>
                <label className={columntitle.innercontainer}>
                    <label className={columntitle.buttons} onClick={() => handleLeftClick()}>
                        { left && 
                            <FontAwesomeIcon  icon={faAngleLeft} size="xl"/>
                        }
                    </label>
                    <label className={columntitle.title}>{name}</label>
                    <label className={columntitle.buttons} onClick={() => handleRightClick()}>
                        { right && 
                            <FontAwesomeIcon icon={faAngleRight} size="xl"/>
                        }
                    </label>
                </label>
            </div >
        </>
    )
}

export default ColumnTitle;