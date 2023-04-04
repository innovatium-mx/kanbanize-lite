import { useRouter } from "next/router";
import {urlLocal} from '../constants'
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
          fetch(urlLocal + '/checkToken/university6y', {
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