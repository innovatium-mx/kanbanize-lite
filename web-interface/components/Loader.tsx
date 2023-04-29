import loader from '../styles/Loading.module.css';

const Loader= () => {
    return (
        <>
            <div  className={loader.container}>
                <img src="/loading.gif"/>
            </div>
        </>
    )
}

export default Loader;