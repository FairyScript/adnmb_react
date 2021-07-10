declare interface ThreadItemBase {
  id: string
  img: string
  ext: string
  now: Date
  userid: string
  name: string
  email: string
  title: string
  content: string
  sage: boolean
  admin: string
  status: string
  bannedip: boolean
  cookieValid: boolean
}

declare interface MainThreadItem extends ThreadItemBase {
  remainReplys?: number
  replyCount: number
  replys: ThreadItemBase[]
}