import dynamic from 'next/dynamic';
import actCard from '../styles/Activitycard.module.css';
import Image from 'next/image';
import pSBC from '../helpers/lightenColor';
import adjustColor from '../helpers/lightenColor';

const ActivityCard = () =>{

    //const color =  '#ff0000'; // red
    const color =  adjustColor('#ff0000',-70); // red

    const lightenedColor = adjustColor(color, 70);

    if (typeof window !== 'undefined') {
        document.documentElement.style.setProperty('--primary-gradient-', color);
        document.documentElement.style.setProperty('--secondary-gradient-', lightenedColor);
    }

    console.log(color);
    console.log(lightenedColor);

    return(
        <>
            <div className={actCard.boardCard}>
                <div className={actCard.text}>T2.HU10.- Crear componente de sidebar con Perfil, organización, idioma, link a workspaces y cerrar sesión.T2.HU10.- Crear componente de sidebar con Perfil, organización, idioma, link a workspaces y cerrar sesión.T2.HU10.- Crear componente de sidebar con Perfil, organización, idioma, link a workspaces y cerrar sesión.T2.HU10.- Crear componente de sidebar con Perfil, organización, idioma, link a workspaces y cerrar sesión.T2.HU10.- Crear componente de sidebar con Perfil, organización, idioma, link a workspaces y cerrar sesión.T2.HU10.- Crear componente de sidebar con Perfil, organización, idioma, link a workspaces y cerrar sesión.T2.HU10.- Crear componente de sidebar con Perfil, organización, idioma, link a workspaces y cerrar sesión.</div>
                <Image src={''} alt="src" className={actCard.photo}/>
            </div>

        
        </>
    )


}

export default ActivityCard;
