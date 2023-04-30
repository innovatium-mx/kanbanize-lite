import { useRouter } from "next/navigation";
import {urlCloud} from '../constants'
import {useEffect, useState } from "react";
const cookieCutter= require('cookie-cutter');

const authRoute = (Component : any) => {
  // eslint-disable-next-line react/display-name
  return (props : any) => {
    const router = useRouter();
    const [authenticated, setAuthenticated] = useState(false);      
    useEffect(() => {
      const checkToken = () => {
        const token = cookieCutter.get('apikey');
        if (!token) 
        {
          router.replace({pathname: '/'});
        } 
        else 
        {
          setAuthenticated(true);
        }
      }
      checkToken();
    }, [router]);
  
    if (authenticated) {
      return <Component {...props}/>;
    } else {
      return null;
    }
  }
};

authRoute.displayName = 'authRoute';
export default authRoute;
