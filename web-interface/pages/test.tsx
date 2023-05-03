import dynamic from "next/dynamic";


const test = () =>{

    const ActivityCard = dynamic(import('../components/ActivityCard'),{ssr:false});
    const OpenedActivityCard = dynamic(import('../components/OpenedActivityCard'),{ssr:false});


    return(
        <>
            {/*<ActivityCard color={"#AF0020"} owner_avatar={""} title={"T2.HU10.- Crear componente de sidebar con Perfil, organización, idioma, link a workspaces y cerrar sesión."} owner_username={""}/>*/}
            {/*<OpenedActivityCard title={"T2.HU10.- Crear componente de sidebar con Perfil, organización, idioma, link a workspaces y cerrar sesión."} owner={""} owner_avatar={"https://s3.amazonaws.com/kanbamne/attachments/university6y/avatar_80x80_10.jpg"} co_owners={[]} co_owners_avatars={[]} comments={[]} comments_dates={[]} description={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in "}/>*/}
            {/*<OpenedActivityCard title={"ma, link a workspaces y cerrar sesión."} owner={""} owner_avatar={"https://s3.amazonaws.com/kanbamne/attachments/university6y/avatar_80x80_10.jpg"} co_owners={[]} co_owners_avatars={[]} comments={[]} comments_dates={[]}/>*/}
            {/*<OpenedActivityCard title={"T2.HU10.- Crear componente de sidebar con Perfil, organización, idioma, link a workspaces y cerrar sesión."} owner={""} owner_avatar={"https://s3.amazonaws.com/kanbamne/attachments/university6y/avatar_80x80_10.jpg"} co_owners={[]} co_owners_avatars={[]} comments={[]} comments_dates={[]} description={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in "}/>*/}

        </>
    )
    
}

export default test;