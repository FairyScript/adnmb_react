declare interface ThreadItemBase {
  id: string
  img: string
  ext: string
  now: string
  userid: string
  name: string
  email: string
  title: string
  content: string
  sage: string
  admin: string
}

declare interface MainThreadItem extends ThreadItemBase {
  remainReplys: string
  replyCount: string
  replys: ThreadItemBase[]
}