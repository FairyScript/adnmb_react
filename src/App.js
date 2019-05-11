/* * * * * * * * *
 * A岛黎明版(使用React构建)
 * Developed by Sharin in 2019
 * //////WARNING//////
 * 工地英语
 * 辣鸡代码
 * 令人迷惑的注释
 */

import React from 'react';
import {useState,useEffect} from 'react';
import {getForumList} from './api/api'
import {LeftSideBar} from './js/LeftSideBar';
import {ThreadView} from './js/ThreadView';
import './css/App.scss';

function MainPage() {
  //Hook
  const [forumId,setForum] = useState(-1);//时间线
  const [threadId,setThread] = useState(0);//串号
  const [forumList,setForumList] = useState();

  useEffect(() => {
    async function fetchData() {
      let res = await getForumList();
      if(res.ok) {
        console.log(res.json);
        setForumList(res.json);
      }
    }
    fetchData();
  },[]);
  return (
    <>
      <LeftSideBar className="LeftSideBar" forumList={forumList} />
      <ThreadView className="ThreadView" id={} page={}/>
    </>
  )
}
//
function App() {
  return (
    <MainPage className="MainPage"/>
  )
}

export default App;
