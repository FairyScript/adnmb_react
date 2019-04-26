##组件树

```
App
+-- MainPage
|   |
|   +-- LeftSideBar 
|   |   +-- ForumListBox 
|   |   |   +-- ForumList 
|   |
|   +-- ThreadView 
|   |   +-- ThreadList 
|   |   |   +-- ThreadContent
|   |   |       +-- ThreadMain
|   |   |       |   +-- ThreadInfo
|   |   |       |   +-- ThreadText
|   |   |       |   +-- ThreadAction
|   |   |       +-- ThreadReply
|   |   |           +-- ThreadInfo
|   |   |           +-- ThreadText
|   |   |           +-- ThreadAction
|   |   +-- ThreadPage 
|   |
|   
+-- DashBoard
```

> App 最顶层的组件，负责保管URL/主题等全局参数 获取`URL传入`
> MainPage 主视图 保管板块/串号信息，cookie信息，板块列表信息；获取`getForumList`数据
>> LeftSideBar 左侧边栏，继承板块列表信息
>> ThreadView 串浏览列表 容器 获取`showf thread`数据
> DashBoard 用户中心，负责保管登录信息