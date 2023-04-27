import dynamic from "next/dynamic";

const test = () =>{

    const ActivityCard = dynamic(import('../components/ActivityCard'),{ssr:false});

    return(
        <>
            <ActivityCard color={"#AF0020"} owner_avatar={""} title={"T2.HU10.- Crear componente de sidebar con Perfil, organización, idioma, link a workspaces y cerrar sesión."} owner_username={""}/>
        </>
    )
    
}

export default test;