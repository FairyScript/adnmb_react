import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getForum } from "../api/api";
import { useForumList } from "../utils/updateForumList";

const ThreadView: React.FC = () => {
  const { type, id } = useParams<{ type: string, id: string }>()

  return (
    <div>
      <div>{type}/{id}</div>
      <ThreadList />
    </div>
  );
}

export default ThreadView

const ThreadList: React.FC = () => {
  const [, forumMap] = useForumList()
  const { type, id } = useParams<{ type: string, id: string }>()
  const [threads, setT] = useState<MainThreadItem[]>([])

  console.log(forumMap);
  
  useEffect(() => {
    if (type && id) {
      switch (type) {
        case 'f': {
          getForum(forumMap!.nameMap[id]).then(res => {
            setT(res)
          })
        }
      }
    }
  }, [type, id])
  return (
    <div>
      {threads.map(t => <ThreadItem key={t.id} data={t} />)}
    </div>
  );
}

const ThreadItem: React.FC<{ data: MainThreadItem }> = ({ data }) => {
  return (
    <div>
      {data.content}
    </div>
  );
}