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
    "co_owner_usernames" : Array<string> | null,
    "co_owner_avatars" : Array<string> | null,
    "description" : string,
    "comment_count" : number
};

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
    "columns": Array<column>
}

export type newCard = {
    "owner_username" : string | undefined,
    "owner_avatar" : string | null,
    "users" : Array<user>,
    "activateInsertCard" : any
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

export interface FilterProps {
    users : Array<user>,
    selected: Array<selection>,
    setFilter: any
}

export interface AddCoOwners{
    users : Array<user>,
    selected: Array<selection>
}