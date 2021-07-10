import { css } from "@emotion/react";
import { Button } from "@material-ui/core";
import { useMount, useLocalStorageState } from "ahooks";
import { useHistory } from "react-router";
import { getForumList } from "../api/api";

/**
 * 欢迎页
 */
const WelcomePage: React.FC = () => {
  
  const history = useHistory()


  return (
    <div>
      <h1>Welcome ADNMB React!</h1>
      <ForumListStatus />
      <Button
        onClick={()=>history.push('/f/综合版1')}
      >前往综合1</Button>
    </div>
  );
}

export default WelcomePage


const ForumListStatus: React.FC = () => {
  const [forumList, setList] = useLocalStorageState<ForumList>('forumList')
  useMount(async () => {
    if (!forumList) {
      const list = await getForumList()
      setList(list)
    }
  })

  const ok = Boolean(forumList)

  return (
    <div>
      ForumList: <span css={css`color:${ok ? 'green' : 'red'};`} >{ok ? 'OK!' : 'Loading...'}</span>
    </div>
  );
}