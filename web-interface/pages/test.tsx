import dynamic from "next/dynamic";

const test = () =>{

    const ActivityCard = dynamic(import('../components/ActivityCard'),{ssr:false});

    return(
        <>
            <ActivityCard color={"#AF0020"} owner_avatar={"https://s3.amazonaws.com/kanbamne/attachments/university6y/avatar_80x80_10.jpg"} title={"T2.HU10.- Crear componente de sidebar con Perfil, organización, idioma, link a workspaces y cerrar sesión."} owner_username={'Mike'}/>
        </>
    )
    
}

export default test;