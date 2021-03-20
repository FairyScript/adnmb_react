import axios from "axios"
import path from 'path-browserify'

const URL_BASE = '/api'

export async function getForumList(): Promise<ForumList> {
  try {
    const res = await axios.get<ForumList>(path.join(URL_BASE,'getForumList'))
    const result = res.data.map(group=>{
      group.sort = Number(group.sort)
      group.forums = group.forums.map(item=>{
        item.sort = Number(item.sort)
        if(item.showName === '') item.showName = undefined
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