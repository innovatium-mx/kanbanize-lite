import languageDrop from '../styles/Dropdown.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faGlobe } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from 'reactstrap'
import { useRouter } from 'next/router'

//
import {useTranslation} from 'next-i18next';

const LanguageButton = () => {

    //
    const router = useRouter();
    const {t} = useTranslation('common');

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
        <label className={languageDrop.labelContainer}>
            <FontAwesomeIcon icon={faGlobe} className={languageDrop.iconStyle}/>
            <div>
                <Dropdown isOpen={dropdown} toggle={openCloseDropdown}>
                    <DropdownToggle caret className={languageDrop.buttonStyle}>{t('button.language')}</DropdownToggle>

                    <DropdownMenu className={languageDrop.menuStyle}>
                        <DropdownItem hreflang='en' onClick={() => onToggleLanguageClick('en')}>English</DropdownItem>
                        <DropdownItem hreflang='es' onClick={() => onToggleLanguageClick('es')}>Español</DropdownItem>
                    </DropdownMenu>

                </Dropdown>
            </div>
        </label>
        </>
    )
}
export default LanguageButton;


