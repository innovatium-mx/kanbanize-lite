

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
};

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
};

const CardsWorkflow = ({data} : Array<column>) => {

    console.log(data);
    return(
        <h2>Tipo 0</h2>
    )
}


export default CardsWorkflow;