import dynamic from "next/dynamic";
import NewCardComponent from "../components/NewCardComponent";


const test = () =>{

    const ActivityCard = dynamic(import('../components/ActivityCard'),{ssr:false});
    const OpenedActivityCard = dynamic(import('../components/OpenedActivityCard'),{ssr:false});
    const Comment = dynamic(import('../components/Comment'),{ssr:false});

    const InitCard = dynamic(import('../components/ClosedInitiativeCard'))


    return(
        <>
            {/*<ActivityCard color={"#AF0020"} owner_avatar={""} title={"T2.HU10.- Crear componente de sidebar con Perfil, organización, idioma, link a workspaces y cerrar sesión."} owner_username={""}/>*/}
            {/*<OpenedActivityCard title={"T2.HU10.- Crear componente de sidebar con Perfil, organización, idioma, link a workspaces y cerrar sesión."} owner={""} owner_avatar={"https://s3.amazonaws.com/kanbamne/attachments/university6y/avatar_80x80_10.jpg"} co_owners={[]} co_owners_avatars={[]} comments={[]} comments_dates={[]} description={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in "}/>*/}
            {/*<OpenedActivityCard title={"ma, link a workspaces y cerrar sesión."} owner={""} owner_avatar={"https://s3.amazonaws.com/kanbamne/attachments/university6y/avatar_80x80_10.jpg"} co_owners={[]} co_owners_avatars={[]} comments={[]} comments_dates={[]}/>*/}
            {/*<OpenedActivityCard title={"T2.HU10.- Crear componente de sidebar con Perfil, organización, idioma, link a workspaces y cerrar sesión."} owner={""} owner_avatar={"https://s3.amazonaws.com/kanbamne/attachments/university6y/avatar_80x80_10.jpg"} co_owner_usernames={[]} co_owner_avatars={[]}  description={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in "}/>*/}
            {/*<Comment text="Guardar selección de tablero y de workflow para que sea lo primero que se renderice." last_modified="2023-04-25T20:59:07+00:00" avatar="https://s3.amazonaws.com/kanbamne/attachments/university6y/avatar_80x80_8.jpg"/>*/}
            {
                /*<NewCardComponent/>*/
            }

            {}

            {/* <InitCard card_id={345} color={"#d59beb"} owner_avatar={null} title={"Test Initiative Card"} owner_username={"Georgees"} retrieveIndex={undefined} displayModal={undefined} lane_name={"This is a very long lane name"} lane_color={"e81c1c"} child_complete={5} child_total={20} /> */}

        </>
    )
    
}

export default test;