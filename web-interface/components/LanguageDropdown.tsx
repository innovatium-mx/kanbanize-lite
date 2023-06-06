import languageDrop from '../styles/Dropdown.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faGlobe } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from 'reactstrap'
import { useRouter } from 'next/router'
import {useTranslation} from 'next-i18next';

export interface LanguageDropdownProps {
    color : boolean,
}

const LanguageButton = ({color} : LanguageDropdownProps) => {

    const router = useRouter();
    const {t} = useTranslation('common');

    if(color) {
        document.documentElement.style.setProperty('--dropdowncolor-', 'white');
        document.documentElement.style.setProperty('--dropdown-bg-', '#2666BE');
    }
    else {
        document.documentElement.style.setProperty('--dropdowncolor-', 'black');
        document.documentElement.style.setProperty('--dropdown-bg-', '');
    }

    const onToggleLanguageClick = (newLocale: string) => {
        const { pathname, asPath, query } = router
        router.push({ pathname, query }, asPath, { locale: newLocale })
    }
    //

    const [dropdown, setDropdown]=useState(false);
    const openCloseDropdown = () => {
        setDropdown(!dropdown);
    }

    return(
        <>
        <div className={languageDrop.labelContainer}>
            <div className={languageDrop.iconStyle}>
                <FontAwesomeIcon icon={faGlobe}/>
            </div>
            <div>
                <Dropdown isOpen={dropdown} toggle={openCloseDropdown}>
                    <DropdownToggle caret className={languageDrop.buttonStyle}>{t('button.language')}</DropdownToggle>

                    <DropdownMenu className={languageDrop.menuStyle} end={true}>
                        <DropdownItem hreflang='en' onClick={() => onToggleLanguageClick('en')}>English</DropdownItem>
                        <DropdownItem hreflang='es' onClick={() => onToggleLanguageClick('es')}>Español</DropdownItem>
                    </DropdownMenu>

                </Dropdown>
            </div>
        </div>
        </>
    )
}
export default LanguageButton;


