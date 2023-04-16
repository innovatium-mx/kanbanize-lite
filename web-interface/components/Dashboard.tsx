export type boardCard = {
    board_id: number,
    workspace_id: number,
    is_archived: number,
    name: string, 
    description: string
}

const DashBoard = ({board_id, workspace_id, is_archived, name, description}: boardCard) => {

    return(
        <div>
            <div>{name}</div>
            <div>{board_id}</div>
            <div>{description}</div>
        </div>
    )
}

export default DashBoard;