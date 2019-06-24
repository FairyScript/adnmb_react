import React, { useState, useContext } from 'react';
import { DataStore } from './MainPage';
import '../css/LeftSideBar.scss';

function LeftSideBar(props) {
  //console.log(`LSB ${list}`)
  return (
    <div className="left-side-bar">
      <ForumList list={props.forumList} />
    </div>
  )
}

//板块组列表
function ForumList(props) {
  //use Context
  const dispatch = useContext(DataStore).dispatch;
  const forumInfo = useContext(DataStore).forumInfo;

  const [active, setActive] = useState(forumInfo.id);

  const list = props.list;
  //空的就返回loading
  if (list === undefined) {
    return <ul>Loading...</ul>
  }

  let c = [];
  for (let key in list) {
    let sort = list[key].sort;
    c[sort] = (
      <li
        key={key}
        className={key === active ? "active-forum forum-item" : "forum-item"}
        onClick={() => {
          dispatch({ type: 'changeForum', id: key });
          setActive(key);
        }}
        //解析板块名称，时间线特殊解析
        dangerouslySetInnerHTML={{ __html: (list[key].showName === '' || list[key].name === '时间线') ? list[key].name : list[key].showName }}
      />
    );
  }

  return <ul className="forum-group">{c}</ul>
}

export { LeftSideBar };