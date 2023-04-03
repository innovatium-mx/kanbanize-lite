import languageDrop from '../styles/Dropdown.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faGlobe } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from 'reactstrap'


const LanguageButton = () => {
    const [dropdown, setDropdown]=useState(false);
    const openCloseDropdown = () => {
        setDropdown(!dropdown);
    }


    return(
        <>
        <label className={languageDrop.labelContainer}>
            <FontAwesomeIcon icon={faGlobe} className={languageDrop.iconStyle}/>
            <div>
                <Dropdown isOpen={dropdown} toggle={openCloseDropdown}  >
                    <DropdownToggle caret className={languageDrop.buttonStyle}> Language </DropdownToggle>

                    <DropdownMenu>
                        <DropdownItem hreflang='en'>English</DropdownItem>
                        <DropdownItem hreflang='es'>Español</DropdownItem>
                    </DropdownMenu>

                </Dropdown>
            </div>
        </label>
        </>
    )



}

export default LanguageButton;


