// pages/board/[board_id].ts
import { useRouter } from "next/router";

export default function Board() {
  const router = useRouter();
  const query = router.query;
  const uid = query.board_id;

  return (
    <div style={{ padding: 40 }}>
      <h1>Board</h1>
      <h2>Board Id: {uid}</h2>
    </div>
  );
};