import { useRouter } from "next/router";
import { ReactComponentElement, useEffect, useState } from "react";

const authRoute = (Component : any) => {
  return (props : any) => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [authenticated, setAuthenticated] = useState(false);      
    useEffect(() => {
      const checkToken = async () => {
        const token = localStorage.getItem("token");

        if (!token) 
        {
          router.push("");
        } 
        else 
        {

        }
      }
      checkToken();
    }, []);
  
    /*if (authenticated) {
      return <Component {...props} user={user} />;
    } else {
      return null;
    }*/
  }
};  
export default authRoute;