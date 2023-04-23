import dynamic from "next/dynamic";

const test = () =>{

    const ActivityCard = dynamic(import('../components/ActivityCard'),{ssr:false});

    return(
        <>
            <ActivityCard/>
        </>
    )


}

export default test;