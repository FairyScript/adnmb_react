export class ForumMap {
  idMap: { [k: string]: string } = {}
  nameMap: { [k: string]: string } = {}

  set(id: string, name: string) {
    this.idMap[id] = name
    this.nameMap[name] = id
  }
  getId(name: string) {
    return this.nameMap[name]
  }
  getName(id: string) {
    return this.idMap[id]
  }

  constructor(data: [string, string][]) {
    data.forEach(i => this.set(i[0], i[1]))
  }
}

export type ForumList = ForumGroup[]

export interface ForumGroup {
  /**该板块组的 ID */
  id: string
  /**服务器的排序值， 越小优先级越高， 若为-1 则自动排序 */
  sort: number
  /**板块名 */
  name: string
  /**未知，值为 `n` */
  status: string
  forums: ForumItem[]
}

export interface ForumItem {
  id: string
  /**所属组的 id */
  fgroup: string
  /**排序值， 越小优先级越高 */
  sort: number
  /**板块名 */
  name: string
  /**板块名,优先显示（包含html） */
  showName?: string
  /**版规 */
  msg: string
  /**发言间隔时间 */
  interval: number
  createdAt: Date
  updateAt: Date
  /**未知，值为 `n` */
  status: string
}