import { css } from "@emotion/react";
import { useMount, useSessionStorageState } from "ahooks";
import { Button } from "antd";
import { useHistory } from "react-router";
import { getForumList } from "../api/api";

/**
 * 欢迎页
 */
const WelcomePage: React.FC = () => {
  const [forumList, setList] = useSessionStorageState<ForumList>('forumList')
  useMount(async () => {
    if (!forumList) {
      const list = await getForumList()
      setList(list)
    }
  })
  const history = useHistory()


  return (
    <div>
      <h1>Welcome ADNMB React!</h1>
      <ForumListStatus ok={Boolean(forumList)} />
      <Button
        type="primary"
        onClick={()=>history.push('/f/综合版1')}
      >前往综合1</Button>
    </div>
  );
}

export default WelcomePage

const ForumListStatus: React.FC<{ ok: boolean }> = ({ ok }) => {
  return (
    <div>
      ForumList: <span css={css`color:${ok ? 'green' : 'red'};`} >{ok ? 'OK!' : 'Loading...'}</span>
    </div>
  );
}