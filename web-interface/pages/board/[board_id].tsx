// pages/board/[board_id].tsx
import { useTranslation} from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import type { GetServerSideProps} from 'next'
import { useRouter } from "next/router";
import authRoute from '../../components/authRoute';
import {urlCloud} from '../../constants'
import Cookies from 'cookies'

type Props = {}

type card = {
  "card_id": number,
  "custom_id": number | null,
  "title": string,
  "owner_user_id": number | null,
  "owner_username": string | null,
  "owner_avatar": string | null,
  "type_id": number | null,
  "color": string,
  "section": number,
  "lane_id": number,
  "position": number
}

type column = {
  "column_id": number,
  "section": number,
  "parent_column_id": number,
  "position": number,
  "name": string,
  "description": string,
  "color": string,
  "limit": number,
  "cards_per_row": number,
  "flow_type": number,
  "card_ordering": string | null,
  "cards": Array<card> | null
}


type workflow = {
  "type": number,
  "position": number,
  "is_enabled": number,
  "is_collapsible": number,
  "name": string,
  "workflow_id": number,
  "columns": Array<column> | null
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
    data : Array<workflow>
    _nextI18Next : NextJsI18NConfig
  }

const Board = ( props: PropsResponse) => {
  const router = useRouter();
  const {t} = useTranslation('common');
  const query = router.query;
  const board_id = query.board_id;
  const board = props.data;
  console.log(board);

  return (
    <div style={{ padding: 40 }}>
      <h1>Board</h1>
      <h2>Board Id: {board_id}</h2>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const cookies = new Cookies(context.req, context.res)
  const apikey : any = cookies.get('apikey');
  const host = cookies.get('host');
  const { board_id } = context.query;
  const response = await  fetch(urlCloud+`boardDetails/${host}/${board_id}`, {
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
          ...(await serverSideTranslations(context.locale ?? 'en', [
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
          ...(await serverSideTranslations(context.locale ?? 'en', [
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
        ...(await serverSideTranslations(context.locale ?? 'en', [
          'common'
        ]))}
    }
  }
  
}

export default authRoute(Board);