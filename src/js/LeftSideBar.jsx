import React, { useState } from 'react';
import '../css/LeftSideBar.scss';

function LeftSideBar(props) {
  return (
    <div className="left-side-bar">
      <ForumList list={props.forumList} push={props.history.push} />
    </div>
  )
}

//板块组列表
function ForumList({ list, push }) {
  const [active, setActive] = useState(forumInfo.id);

  //空的就返回loading
  if (list === undefined) {
    return <ul>forumList is Enpty</ul>
  }

  let c = [];
  for (let key in list) {
    let sort = list[key].sort;
    c[sort] = (
      <li
        key={key}
        className={key === active ? "active-forum forum-item" : "forum-item"}
        onClick={() => {
          history.push(`/f/${forumList[id].name}`);
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