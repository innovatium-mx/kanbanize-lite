import loader from '../styles/Loading.module.css';
import { RotatingSquare } from  'react-loader-spinner'

const Loader = () => {

    return (
        <div className={loader.container} >
        <RotatingSquare
        height="200"
        width="200"
        color="#4fa94d"
        ariaLabel="rotating-square-loading"
        strokeWidth="4"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />

      </div>
    )
   
}

export default Loader;



