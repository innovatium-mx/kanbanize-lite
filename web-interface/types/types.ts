export type card = {
    "card_id": number,
    "custom_id": number | null,
    "title": string,
    "owner_user_id": number | null,
    "owner_username": string | undefined,
    "owner_avatar": string | null,
    "type_id": number | null,
    "color": string,
    "section": number,
    "lane_id": number,
    "position": number,
    "co_owner_usernames" : Array<string | undefined> | null,
    "co_owner_avatars" : Array<string | undefined > | null,
    "description" : string,
    "comment_count" : number,
    "lane_name" : string,
    "lane_color" : string,
    "linked_cards" : Array<linkedCards>
};


export type lane = {
    "lane_id": number,
    "workflow_id": number,
    "parent_lane_id": number | null,
    "position": number,
    "name": string,
    "description": string,
    "color": string
}

export type column = {
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
    "cards": Array<card>,
    "order": number
}



export type parent_columns = {
    parent_id: number,
    parent_name: string,
    parent_section: number,
    parent_position: number,
} 

export type ActivityCardProps = {
    "card_id": number,
    "color": string,
    "owner_avatar": string | null,
    "title": string, 
    "owner_username": string | null,
    "retrieveIndex" : any,
    "displayModal": any,
    "lane_name": string,
    "lane_color": string
}

export type workSpace ={
    "workspace_id": number,
    "type": number,
    "is_archived": number,
    "name": string,
}


export type workflow = {
    "type": number,
    "position": number,
    "is_enabled": number,
    "is_collapsible": number,
    "name": string,
    "workflow_id": number,
    "users": Array<user>,
    "columns": Array<column>,
    "lanes": Array<lane>
}

export type newCard = {
    "users" : Array<user>,
    "activateInsertCard" : any,
    "color" :  string,
    "selected" : any,
    "lane_id" : number,
    "column_id" : number,
    "updateSelected" : any,
    "position" : number,
    "insertCardUpdate" : (newCard: card) => void,
    "applyInsertEffect" : (val: boolean) => void,
    "updateCurrentCard" : (curr:card) => void,
    "lane_name" : string,
    "lane_color" : string,
    "newCardTitle": string,
    "newCardDescription": string,
    "newCardOwner": string,
    "newCardCoowner": string,
    "newCardCreate": string
}

export type OpenedActivityCardProps = {
    "title" : string,
    "owner" : string | undefined,
    "owner_avatar" : string | null,
    "co_owner_usernames"  : Array<string | undefined> | null,
    "co_owner_avatars" : Array<string | undefined> | null,
    "description": string,
    "setDisplayCard": any,
    "color": string,
    "card_id" : number,
    "comment_count" : number,
    "openedCardOwner": string,
    "openedCardCoowner": string,
    "openedCardAddComment": string,
    "openedCardComments": string,
}

export type linkedCards = {
    "card_id" : number,
    "link_type" : string,
    "title" : string
}



export type OpenedInitiativeCardProps = {
    "title" : string,
    "owner" : string | undefined,
    "owner_avatar" : string | null,
    "co_owner_usernames"  : Array<string | undefined> | null,
    "co_owner_avatars" : Array<string | undefined> | null,
    "description": string,
    "setDisplayCard": any,
    "color": string,
    "card_id" : number,
    "comment_count" : number,
    "linked_cards" : Array<linkedCards>,
    "openedCardOwner": string,
    "openedCardCoowner": string,
    "openedCardAddComment": string,
    "openedCardComments": string,
    "openedCardActivities" : string
}





export type Author = {
    "type" : string,
    "value" : number,
    "avatar" : string | null,
    "username" : string | undefined
}

export type Attachment = {
    "id": number,
    "file_name": string,
    "link": string
}

export type comment = {
    "text": string,
    "last_modified": string,
    "author": Author,
    "attachments" : Array<Attachment>
}

export type CommentProps = {
    "text" : string,
    "last_modified" : string,
    "avatar" : string | null,
    "color" : string,
    "username" : string | undefined,
    "attachments" : Array<Attachment>
}

export type CommentContainerProps = {
    "commentsArray" : Array<comment | null>,
    "justSent" : string,
    "arrowDown" : any,
    "color" : string
}

export type boardCard = {
    "board_id": number,
    "name": string, 
    "description": string,
    "index": number
}

export type ColumnTitleProps = {
    name: string,
    left: boolean,
    right: boolean,
    color: string,
    returnResponse: any,
    parent_column_id: Array<parent_columns> | null,
    workflow_name: string,
    users: Array<user>,
    selected: Array<selection>,
    setFilter: any,
    filterSelectAll: string
}

export type croppedUser = {
    "user_id" : number,
    "avatar" : string | undefined,
    "username" : string | undefined
}

export type selection = {
    user_id: number | null,
    checked: boolean
}

export type user = {
    user_id: number | null,
    username: string,
    realname: string,
    avatar: string
}

export type InitiativeCardProps = {
    "card_id": number,
    "color": string,
    "owner_avatar": string | null,
    "title": string, 
    "owner_username": string | undefined,
    "lane_name": string,
    "lane_color": string
    "child_complete": number,
    "child_total": number,
    "showInitiativeModal" : (value:boolean) => void,
    "retrieveIndex" : any
}

export interface FilterProps {
    users : Array<user>,
    selected: Array<selection>,
    setFilter: any,
    filterSelectAll : string
}

export interface AddCoOwners{
    users : Array<user>,
    selected: Array<selection>,
    setNewSelection: any,
    updateAvatars : any,
    avatarsList: Array<croppedUser>
}

export interface DropdownProps {
    data : Array<workSpace | workflow>
    getData : any
    name : string
}

export type NextJsI18NConfig = {
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

export interface NavBarData {
    workspace_id: number,
    type: number,
    is_archived: number,
    name: string,
    boards: Array<boardCard> | null
}

export type LoaderProps = {
    msgLoader : string
}

export type Error = {
    error: number
}