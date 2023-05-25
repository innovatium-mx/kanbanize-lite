// pages/board/[board_id].tsx
import { useTranslation} from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import type { GetServerSideProps} from 'next'
import authRoute from '../../components/authRoute';
import CardsWorkflow from '../../components/CardsWorkflow';
import FloatButton from '../../components/FloatButton';
import {useEffect, useState, useLayoutEffect } from "react";
import dynamic from 'next/dynamic';
import {urlCloud} from '../../constants'
import dashboard from '../../styles/Dashboards.module.css';
import Cookies from 'cookies';
import {useRouter} from 'next/router';
import { workflow, card, } from '@/types/types';
import NewCardComponent from '../../components/NewCardComponent';

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
    data : Array<workflow> 
    _nextI18Next : NextJsI18NConfig
  }

const Board = ( props: PropsResponse) => {
  const router = useRouter();
  const {t} = useTranslation('common');
  const InterfaceDropdown = dynamic(import('../../components/InterfaceDropdown'), {ssr:false});
  const OpenedActivityCard = dynamic(import('../../components/OpenedActivityCard'), {ssr:false});

  const [currentCard, setCurrentCard] = useState<card>()
  const [displayCard, setDisplayCard] = useState<boolean>(false);
  
  const [insertCard, setInsertCard] = useState<boolean>(false);

  const activateInsertCard = (param: boolean) =>{
    setInsertCard(param);
  }

  const [workflow, setWorkflow] = useState<workflow>({
    "type": -1,
    "position": -1,
    "is_enabled": -1,
    "is_collapsible": -1,
    "name": "",
    "workflow_id": -1,
    "users" : [],
    "columns": [] 
  });


  const query = router.query;
  const board_id = query.board_id;
  const board = props.data;

  const getWorkflow = (workflowid : number) => {
    const temp = board.filter(function(item) { return item.workflow_id === workflowid; })[0];
    temp.users.push({user_id: null,
    username: "Not Assigned",
    realname: "None",
    avatar: "/None.jpg"
    })
    setWorkflow(temp);
  }

  const updateCurrentCard = (curr: card) =>{
    setCurrentCard(curr);
  }

  const moveCards = (current : number, cardIndex : number, destiny: number ) =>{
    
    const tempWorkflow = workflow;

    if(tempWorkflow!=null){

      if(tempWorkflow.columns[current].cards != null){
        tempWorkflow.columns[destiny].cards?.push(tempWorkflow.columns[current].cards[cardIndex]);
      }
      
      tempWorkflow.columns[current].cards?.splice(cardIndex, 1);
      setWorkflow(tempWorkflow)
  
    }
  }

  const showModal = (value: boolean) =>{
    setDisplayCard(value);
  }


  return (
    <>
    
    <div className={dashboard.modalWrap}>

        {displayCard && currentCard!=undefined && <OpenedActivityCard title={currentCard.title} owner={currentCard.owner_username} owner_avatar={currentCard.owner_avatar} co_owner_usernames={currentCard.co_owner_usernames} co_owner_avatars={currentCard.co_owner_avatars} description={currentCard.description} setDisplayCard={setDisplayCard} color={currentCard.color} card_id={currentCard.card_id} comment_count={currentCard.comment_count}/>}
    
    </div>
    
    <div className={dashboard.modalWrap}>

      {insertCard && <NewCardComponent owner_username='Mike' owner_avatar={"https://s3.amazonaws.com/kanbamne/attachments/university6y/avatar_80x80_10.jpg"} users={workflow.users}  activateInsertCard={activateInsertCard}/>}

    </div>

    <div className={dashboard.boardPageWrapScroll}>
        <div className={dashboard.topBar}>
            <div className={dashboard.dropdownFragment}>
              <InterfaceDropdown data={board} name={"WORKFLOW"} getData={getWorkflow}/>
            </div>
            <div className={dashboard.languageDropdown}>
            </div>
        </div>
      <div>
        { workflow.type === 0 && 
          <CardsWorkflow data={workflow.columns} users={workflow.users} workflow_name={workflow.name} updateCurrentCard={updateCurrentCard} displayModal={showModal} moveCards={moveCards}/>
        }

        {
          workflow.type === 0 && 
          <FloatButton activateInsertCard={activateInsertCard}/>
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