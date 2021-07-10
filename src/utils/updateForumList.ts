import { useLocalStorageState, useMount } from "ahooks"
import { getForumList } from "../api/api"
import { ForumList, ForumMap } from "../models/ForumList"

export function useForumList(): [ForumList?, ForumMap?] {
  const [forumList, setList] = useLocalStorageState<ForumList>('forumList')
  const [forumMap, setM] = useLocalStorageState<ForumMap>('forumMap')
  const [lastUpdate, setU] = useLocalStorageState<number>('lastUpdate')

  useMount(async () => {
    const now = Date.now()
    if (!lastUpdate || now - lastUpdate > 3600000) {
      setU(now)
      const list = await getForumList()
      setList(list)

      const map = list.flatMap(g => g.forums.map<[string, string]>(f => [f.id, f.name]))
      const forumMap = new ForumMap(map)
      setM(forumMap)
    }
  })

  return [forumList, new ForumMap(forumMap)]
}