import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import type { GetServerSideProps } from 'next'
import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import authRoute from '../components/authRoute';
import dynamic from 'next/dynamic';
import Dashboard from '../components/Dashboard'
import { boardCard, ErrorResponse, workSpace } from '../types/types';
import { urlCloud } from '../constants'
import dashboard from '../styles/Dashboards.module.css';
import Image from 'next/image';
import Swal from 'sweetalert2'

import Cookies from 'cookies'
import Sidebar from '../components/Sidebar';
import Link from 'next/link';

//import Navbar from '../components/Navbar';
const cookieCutter = require('cookie-cutter');
import { deleteCookie } from 'cookies-next';

type Props = {}

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
  data: Array<workSpace> | ErrorResponse
  _nextI18Next: NextJsI18NConfig
}


const MyBoards = (props: PropsResponse) => {
  const [pageLoaded, setPageLoaded] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const workspaceNumber = cookieCutter.get('workspace');
  const openCloseDropdown = () => {
    setDropdown(!dropdown);
  }

  const router = useRouter();
  const [value, setValue] = useState(0);
  const [boards, setBoards] = useState<Array<boardCard> | null>([]);

  const { t } = useTranslation('common');
  const LanguageDropdown = dynamic(import('../components/LanguageDropdown'), { ssr: false });
  const InterfaceDropdown = dynamic(import('../components/InterfaceDropdown'), { ssr: false });
  const requests = t('SWAL.requests');
  const invalid = t('SWAL.apikey');

  const workspaces = props.data as workSpace[];

  useEffect(() => {
    if("error" in props.data){
      deleteCookie('apikey', { path: '/'});
      deleteCookie('host', { path: '/' });
      deleteCookie('email', { path: '/'});
      deleteCookie('userid', { path: '/'});
      deleteCookie('avatar', { path: '/'});
      deleteCookie('username', { path: '/'});
      deleteCookie('workspace', { path: '/'});
      router.replace({pathname: '/'});
      if(props.data.error === 429){
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
          title: requests
        })
      }
      else if(props.data.error === 401){
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
          title: invalid
        })
      }
      else{
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
          title: 'Error'
        })
      }
    }
    else{
      setPageLoaded(true);
    }
  }, [invalid, props.data, requests, router])
  

  const handleChange = (event: any) => {
    setValue(event.target.value);
    getBoards(event.target.value);

  };

  useEffect(() => {
    if(pageLoaded){
      if(workspaceNumber !== undefined){
      setBoards(workspaces[workspaceNumber].boards)
      setWorkspaceName(workspaces[workspaceNumber].name)
      }
      else{
        const now = new Date();
        cookieCutter.set('workspace', 0, { expires: new Date(now.getTime() + 24 * 60 * 60 * 1000 * 7)})
        setBoards(workspaces[0].boards)
        setWorkspaceName(workspaces[0].name)
      }
    }
  },[pageLoaded, workspaceNumber])


  const getBoards = async (workspace_id: number) => {
    const workspaceIndex = workspaces.findIndex(item => item.workspace_id === workspace_id);
    const workspaceSelected = workspaces[workspaceIndex];
    const now = new Date();
    cookieCutter.set('workspace', workspaceIndex, { expires: new Date(now.getTime() + 24 * 60 * 60 * 1000 * 7)})
    workspaceSelected !== undefined && setBoards(workspaceSelected.boards);
    workspaceSelected !== undefined && setWorkspaceName(workspaceSelected.name);
  }

  return (
    <>
      <div className={dashboard.topBar} style={{position:'fixed', zIndex:'2'}}>
        <div className={dashboard.left}>
          <div>
            <Link href={'/dashboard'}>
              <Image src={"/logo.svg"} width={64} height={36} />
            </Link>
          </div>
          <div className={dashboard.dropdownFragment}>
            <InterfaceDropdown data={workspaces} name={t('dashboard.workspaces')} getData={getBoards} />
          </div>
        </div>
        <div className={dashboard.menu}>
          <Sidebar workspaces={t('sidebar.workspaces')} LogOut={t('sidebar.logout')} confirmlogout={t('sidebar.confirmlogout')} cancellogout={t('sidebar.cancellogout')} loggedout={t('sidebar.loggedout')} />
        </div>
      </div>


      <div className={dashboard.grid} style={{paddingTop:'2.7em'}}>
        {<div className={dashboard.title} style={{paddingTop:'2em'}}>{workspaceName}</div>}

        {boards !== null && boards !== undefined && boards.map((element: any, index) =>
          <Dashboard key={element.key} board_id={element.board_id} name={element.name} description={element.description} index={index} />
        )}

      </div>

    </>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res, locale }) => {
    const cookies = new Cookies(req, res)
    const apikey: any = cookies.get('apikey');
    const host = cookies.get('host');
    const response = await fetch(urlCloud + `workSpaces/${host !== undefined ? host : 'noHost'}`, {
      method: "GET",
      headers: {
        "apikey": apikey
      },
    });

    const data: any = await response.json();
    return {
      props: {
        ...(await serverSideTranslations(locale ?? 'en', [
          'common'
        ])),
        data
      }
    }
}
export default authRoute(MyBoards);