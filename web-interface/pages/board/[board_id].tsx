// pages/board/[board_id].tsx
import { useTranslation} from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import type { GetServerSideProps} from 'next'
import authRoute from '../../components/authRoute';
import CardsWorkflow from '../../components/CardsWorkflow';
import {useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import {urlCloud} from '../../constants'
import dashboard from '../../styles/Dashboards.module.css';
import Cookies from 'cookies';
import {useRouter} from 'next/router';

type Props = {}

type parent_columns = {
    parent_id: number,
    parent_name: string,
    parent_section: number,
    parent_position: number,
} 

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
  "position": number,
  "co_owner_usernames" : Array<string> | null,
  "co_owner_avatars" : Array<string> | null,
  "description" : string
}

type column = {
  "column_id": number,
  "workflow_id": number,
  "section": number,
  "parent_column_id": Array<parent_columns> | null ,
  "position": number,
  "name": string,
  "description": string,
  "color": string,
  "limit": number,
  "cards_per_row": number,
  "flow_type": number,
  "card_ordering": string | null,
  "cards": Array<card> ,
  "order": number
}


type workflow = {
  "type": number,
  "position": number,
  "is_enabled": number,
  "is_collapsible": number,
  "name": string,
  "workflow_id": number,
  "columns": Array<column>
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
  const InterfaceDropdown = dynamic(import('../../components/InterfaceDropdown'), {ssr:false});
  const OpenedActivityCard = dynamic(import('../../components/OpenedActivityCard'), {ssr:false});

  const [currentCard, setCurrentCard] = useState<card>()
  const [displayCard, setDisplayCard] = useState(false);


  const [workflow, setWorkflow] = useState<workflow>({
    "type": -1,
    "position": -1,
    "is_enabled": -1,
    "is_collapsible": -1,
    "name": "",
    "workflow_id": -1,
    "columns": [] 
  });


  const query = router.query;
  const board_id = query.board_id;
  const board = props.data;

  const getWorkflow = (workflowid : number) => {
    setWorkflow(board.filter(function(item) { return item.workflow_id === workflowid; })[0]);
  }

  const updateCurrentCard = (curr: card) =>{
    setCurrentCard(curr);
  }

  const moveCards = (current : number, cardIndex : number, destiny: number ) =>{
    const tempWorkflow = workflow;
    tempWorkflow.columns[destiny].cards.push(tempWorkflow.columns[current].cards[cardIndex]);
    tempWorkflow.columns[current].cards.splice(cardIndex, 1);
    setWorkflow(tempWorkflow)
  }

  const showModal = (value: boolean) =>{
    setDisplayCard(value);
  }

  /*
  console.log(cardIndex);
  console.log();

  if(workflow.type!=-1){
    console.log(workflow.columns[0].cards[0]);
  }
  else{
    console.log(workflow.columns[0]);
  }*/

  console.log(currentCard);
  console.log(displayCard);
  
  return (

    <>

    <div className={dashboard.modalWrap}>
        {/*displayCard && currentCard?.owner_avatar!= null && currentCard?.owner_username!=null  && <OpenedActivityCard title={currentCard.title} owner={currentCard.owner_username} owner_avatar={currentCard.owner_avatar} co_owner_usernames={currentCard.co_owner_usernames} co_owner_avatars={currentCard.co_owner_avatars} description={currentCard.description} setDisplayCard={setDisplayCard}/>*/}
        {/*<OpenedActivityCard title={"T2.HU10.- Crear componente de sidebar con Perfil, organización, idioma, link a workspaces y cerrar sesión."} owner={""} owner_avatar={"https://s3.amazonaws.com/kanbamne/attachments/university6y/avatar_80x80_10.jpg"} co_owner_usernames={[]} co_owner_avatars={[]}  description={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in "}/>*/}
    
        {displayCard && currentCard!=undefined && <OpenedActivityCard title={currentCard.title} owner={currentCard.owner_username} owner_avatar={currentCard.owner_avatar} co_owner_usernames={currentCard.co_owner_usernames} co_owner_avatars={currentCard.co_owner_avatars} description={currentCard.description} setDisplayCard={setDisplayCard} color={currentCard.color} card_id={currentCard.card_id}/>}
    
    </div>

    <div className={dashboard.boardPageWrap}>
        <div className={dashboard.topBar}>
            <div className={dashboard.dropdownFragment}>
              <InterfaceDropdown data={board} name={"WORKFLOW"} getData={getWorkflow}/>
            </div>
            <div className={dashboard.languageDropdown}>
            </div>
        </div>
      <div>
        { workflow.type === 0 && 
          <CardsWorkflow data={workflow.columns} workflow_name={workflow.name} updateCurrentCard={updateCurrentCard} displayModal={showModal} moveCards={moveCards}/>
        }
      </div>

    </div>
    </>
    
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