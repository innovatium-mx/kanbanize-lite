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
    "lane_color" : string
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
    "lane_color" : string
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
    "owner_username": string | null,
    "retrieveIndex" : any,
    "displayModal": any,
    "lane_name": string,
    "lane_color": string
    "child_complete": number,
    "child_total": number
}

export interface FilterProps {
    users : Array<user>,
    selected: Array<selection>,
    setFilter: any
}

export interface AddCoOwners{
    users : Array<user>,
    selected: Array<selection>,
    setNewSelection: any,
    updateAvatars : any,
    avatarsList: Array<croppedUser>
}