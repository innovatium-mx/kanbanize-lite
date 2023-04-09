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
        const host = localStorage.getItem("host"); 

        if (!token) 
        {
          router.push('/');
        } 
        else 
        {
          fetch(urlCloud + 'checkToken/' + host, {
            method: "GET",
            headers: {
              "apikey": token,
            },
          })
          .then((response) => response.json())
          .then((data) => {
          if(!data.error){
              setAuthenticated(true);
          }
          else
          {
            localStorage.removeItem("token");
            router.push('/');
          }
          })
        .catch((error) => {
            console.log(error);
            localStorage.removeItem("token");
            router.push('/');
          });
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
export default authRoute;