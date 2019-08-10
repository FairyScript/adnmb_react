import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import '../css/LeftSideBar.scss';

function LeftSideBar(props) {
  return (
    <div className="left-side-bar">
      <ForumList list={props.forumList} />
    </div>
  )
}

//板块组列表
function ForumList({ list }) {
  const [active, setActive] = useState(0);

  //空的就返回loading
  if (list === undefined) {
    return <ul>forumList is Enpty</ul>
  }

  let c = [];
  list.map(item => {
    return <Link to={`/f/${item.name}`} key={item.id}>{item.name}</Link>
    /* return (
    <li
      
      key={item.id}
      className={item.id === active ? "active-forum forum-item" : "forum-item"}
      onClick={() => {
        setActive(item.id);
      }}
      //解析板块名称，时间线特殊解析
      dangerouslySetInnerHTML={{ __html: (item.showName === '' || item.name === '时间线') ? item.name : item.showName }}
    />) */
  });
  return <ul className="forum-group">{c}</ul>
}

export { LeftSideBar };