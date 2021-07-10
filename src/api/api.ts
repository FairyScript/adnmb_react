import axios from "axios"
import path from 'path-browserify'
import { ForumList } from "../models/ForumList"

const URL_BASE = '/api'

export async function getForumList(): Promise<ForumList> {
  try {
    const res = await axios.get<ForumList>(path.join(URL_BASE, 'getForumList'))
    const result = res.data.map(group => {
      group.sort = Number(group.sort)
      group.forums = group.forums.map(item => {
        item.sort = Number(item.sort)
        if (item.showName === '') item.showName = undefined
        item.interval = Number(item.interval)
        item.createdAt = new Date(item.createdAt)
        item.updateAt = new Date(item.updateAt)

        return item
      })

      return group
    })

    return result

  } catch (error) {
    console.error(error)
    throw error
  }
}

/**
 * @param 
 */
export async function getForum(id: string, page: number = 1) {
  try {
    const res = await axios.get<ShowfResult>(path.join(URL_BASE, 'showf'), {
      params: {
        id,
        page,
      }
    })

    console.log(id,page,res.data);
    if(typeof res.data !== 'object'){
      throw new Error(res.data)
    }

    return res.data.map(f => {
      const r = processThread(f)
      r.replys = r.replys.map(i => processThread(i))

      return r
    })

    function processThread<T extends ThreadItemBase>(item: T) {
      item.now = new Date(item.now)
      item.sage = (item.sage as unknown) !== '0'

      return item
    }



  } catch (error) {
    console.error(error)
    throw error
  }
}