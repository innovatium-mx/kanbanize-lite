import loading from '../styles/Loading.module.css';

const LoadingScreen = () => {
    return (
        <>
            <div  className={loading.container}>
                <img src="/loading.gif"/>
            </div>
        </>
    )
}

export default LoadingScreen;