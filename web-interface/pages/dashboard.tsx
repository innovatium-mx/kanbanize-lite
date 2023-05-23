import { useTranslation} from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import type { GetServerSideProps} from 'next'
import { useState } from "react";
import { useRouter } from 'next/router'
import authRoute from '../components/authRoute';
import dynamic from 'next/dynamic';
import Dashboard from '../components/Dashboard'
import type { boardCard } from '../components/Dashboard';
import {urlCloud} from '../constants'
import dashboard from '../styles/Dashboards.module.css';

import Cookies from 'cookies'
import Sidebar from '../components/Sidebar';

//import Navbar from '../components/Navbar';
const cookieCutter= require('cookie-cutter');

type Props = {}

interface Data {
  workspace_id: number,
  type: number,
  is_archived: number,
  name: string,
  boards: Array<boardCard> | null
}

  type NextJsI18NConfig = {
    defaultLocale: string
    domains?: {
      defaultLocale: string
      domain: string
      http?: true
      locales?: string[]
    }[]
    localeDetection?: false
    locales: string[]
  }

  interface PropsResponse {
    data : Array<Data>
    _nextI18Next : NextJsI18NConfig
  }


const MyBoards = ( props: PropsResponse) => {

  if (typeof window !== 'undefined') {
    document.documentElement.style.setProperty('--dropdowncolor-', 'white');
    document.documentElement.style.setProperty('--dropdown-bg-', '#2666BE');
  }

    const [dropdown, setDropdown]=useState(false);
    const openCloseDropdown = () => {
        setDropdown(!dropdown);
    }

    const Navbar = dynamic(import('../components/Navbar'), { ssr: false });

    const router = useRouter();
    const [value, setValue] = useState(0);
    const [boards, setBoards] = useState<Array<boardCard> | null>([]);

    const {t} = useTranslation('common');
    const LanguageDropdown = dynamic(import('../components/LanguageDropdown'),{ssr:false});
    const InterfaceDropdown= dynamic(import('../components/InterfaceDropdown'), {ssr:false});

    const workspaces = props.data;

    const handleChange = (event : any) => {
      setValue(event.target.value);
      getBoards(event.target.value);
      
    };


    const getBoards = async (workspace_id : number) => {
      const workspaceSelected = workspaces.find(item => item.workspace_id === workspace_id);
      workspaceSelected !== undefined && setBoards(workspaceSelected.boards);
    }

    return (
        <>
          <Navbar data={workspaces} _nextI18Next={{
          defaultLocale: '',
          domains: undefined,
          localeDetection: undefined,
          locales: []
        }}/>

          <div className={dashboard.topBar}>
              <div className={dashboard.dropdownFragment}>
                <InterfaceDropdown  data={workspaces} name={"WORKSPACE"} getData={getBoards}/>
              </div>
              
              {/*<div className={dashboard.languageDropdown}>
                <LanguageDropdown/>
               </div> */}

              <div className='sidebar'>
                <Sidebar/>
              </div>
                
                
          </div>
          

            <div className={dashboard.grid}>
              {/*<div className={dashboard.title}>{t("myBoards.myBoards")}</div>*/}

              {boards !== null && boards.map((element: any, index)=> 
                    <Dashboard key={element.key} board_id={element.board_id} workspace_id={element.workspace_id} is_archived={element.is_archived} name={element.name} description={element.description} index={index} />
              )}

            </div>
 
        </>
    )
}

  export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res, locale }) => {
    const cookies = new Cookies(req, res)
    const apikey : any = cookies.get('apikey');
    const host = cookies.get('host');
    const response = await  fetch(urlCloud+`workSpaces/${host}`, {
            method: "GET",
            headers: {
                "apikey": apikey
            },
    })
    
    if(response.ok){
      const data: any = await response.json();
      if(!data.error){
        return {
          props: {
            ...(await serverSideTranslations(locale ?? 'en', [
              'common'
            ])),
            data}
        }
      }
      else{
        cookies.set('apikey');
        cookies.set('host');
        cookies.set('email');
        cookies.set('userid');

        return {
          redirect: {
            permanent: false,
            destination: "/",
          },
          props: {
            ...(await serverSideTranslations(locale ?? 'en', [
              'common'
            ]))}
        }
      }
      
    }
    else{
      cookies.set('apikey');
      cookies.set('host');
      cookies.set('email');
      cookies.set('userid');

      return {
        redirect: {
          permanent: false,
          destination: "/",
        },
        props: {
          ...(await serverSideTranslations(locale ?? 'en', [
            'common'
          ]))}
      }
    }
    
  }
export default authRoute(MyBoards);