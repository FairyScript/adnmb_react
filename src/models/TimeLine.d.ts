declare type TimeLineItem = TimeLineThreadItem[]

declare interface TimeLineThreadItem extends MainThreadItem{
  fid: string
}