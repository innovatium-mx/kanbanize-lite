import dropdown from '../styles/Dropdown.module.css'
import login from '../styles/Login.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faGlobe } from '@fortawesome/free-solid-svg-icons';


function LanguageButton() {



    return(

        <label className={dropdown.dropdown}>

            <button className={dropdown.dropdownButton}>ENG</button>

            <input type="checkbox" className={dropdown.dropdownInput} id="test"/>

                <ul className={dropdown.ddmenu}>
                    <li>English</li>
                    <li>Español</li>    
                </ul>
        </label>


    )



}

export default LanguageButton;


