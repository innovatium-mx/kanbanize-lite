import { useRouter } from "next/router";
import {urlCloud} from '../constants'
import {useEffect, useState } from "react";

const authRoute = (Component : any) => {
  return (props : any) => {
    const router = useRouter();
    const [authenticated, setAuthenticated] = useState(false);      
    useEffect(() => {
      const checkToken = () => {
        const token = localStorage.getItem("apikey");
        if (!token) 
        {
          router.push('/');
        } 
        else 
        {
          setAuthenticated(true);
        }
      }
      checkToken();
    }, []);
  
    if (authenticated) {
      return <Component {...props}/>;
    } else {
      return null;
    }
  }
};

authRoute.displayName = 'authRoute';
export default authRoute;
