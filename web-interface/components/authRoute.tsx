import { useRouter } from "next/router";
import {urlCloud} from '../constants'
import {useEffect, useState } from "react";
import Swal from 'sweetalert2'
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
          const Toast = Swal.mixin({
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: false,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
         })
                      
          Toast.fire({
            icon: 'error',
            title: 'Tienes que hacer login!'
          })
          cookieCutter.set('apikey', '', { expires: new Date(0) })
          cookieCutter.set('host', '', { expires: new Date(0) })
          cookieCutter.set('email', '', { expires: new Date(0) })
          cookieCutter.set('userid', '', { expires: new Date(0) })
          cookieCutter.set('avatar', '', { expires: new Date(0) })
          cookieCutter.set('username', '', { expires: new Date(0) }) 
          cookieCutter.set('workspace', '', { expires: new Date(0) })

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

export default authRoute;
