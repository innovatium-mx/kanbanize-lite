import { useRouter } from "next/router";
import {urlCloud} from '../constants'
import {useEffect, useState } from "react";
import Swal from 'sweetalert2'
const cookieCutter= require('cookie-cutter');
import { deleteCookie } from 'cookies-next';

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
            title: 'Error',
            text: 'ID 2003'
          })
          deleteCookie('apikey', { path: '/'});
          deleteCookie('host', { path: '/' });
          deleteCookie('email', { path: '/'});
          deleteCookie('userid', { path: '/'});
          deleteCookie('avatar', { path: '/'});
          deleteCookie('username', { path: '/'});
          deleteCookie('workspace', { path: '/'});

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
