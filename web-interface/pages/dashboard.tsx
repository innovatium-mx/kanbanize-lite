import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import type { GetServerSideProps } from 'next'
import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import authRoute from '../components/authRoute';
import dynamic from 'next/dynamic';
import Dashboard from '../components/Dashboard'
import { boardCard } from '../types/types';
import { urlCloud } from '../constants'
import dashboard from '../styles/Dashboards.module.css';
import Image from 'next/image';

import Cookies from 'cookies'
import Sidebar from '../components/Sidebar';

//import Navbar from '../components/Navbar';
const cookieCutter = require('cookie-cutter');

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
  data: Array<Data>
  _nextI18Next: NextJsI18NConfig
}


const MyBoards = (props: PropsResponse) => {

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

  const workspaces = props.data;

  const handleChange = (event: any) => {
    setValue(event.target.value);
    getBoards(event.target.value);

  };

  useEffect(() => {
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
  })


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
            <Image src={"/LogoKanbanize.png"} width={64} height={36} />
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
  const response = await fetch(urlCloud + `workSpaces/${host}`, {
    method: "GET",
    headers: {
      "apikey": apikey
    },
  })

  if (response.ok) {
    const data: any = await response.json();
    if (!data.error) {
      return {
        props: {
          ...(await serverSideTranslations(locale ?? 'en', [
            'common'
          ])),
          data
        }
      }
    }
    else {
      cookies.set('apikey');
      cookies.set('host');
      cookies.set('email');
      cookies.set('userid');
      cookies.set('avatar');
      cookies.set('username');
      cookies.set('workspace')

      return {
        redirect: {
          permanent: false,
          destination: "/",
        },
        props: {
          ...(await serverSideTranslations(locale ?? 'en', [
            'common'
          ]))
        }
      }
    }

  }
  else {
    cookies.set('apikey');
    cookies.set('host');
    cookies.set('email');
    cookies.set('userid');
    cookies.set('avatar');
    cookies.set('username');
    cookies.set('workspace')

    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
      props: {
        ...(await serverSideTranslations(locale ?? 'en', [
          'common'
        ]))
      }
    }
  }

}
export default authRoute(MyBoards);