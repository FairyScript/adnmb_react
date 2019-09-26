import React, { useContext } from 'react';
import {DataStore} from './MainPage';
import '../css/LeftSideBar.scss';

function LeftSideBar(props) {
  return (
    <div className="left-side-bar">
      <ForumList {...props} />
    </div>
  )
}

//板块组列表
function ForumList({ match }) {
  const {forumList,history,activeForum} = useContext(DataStore);

  //console.log(forumList);
  //空的就返回loading
  if (!forumList) {
    return <ul>forumList is Enpty</ul>
  }

  let c = [];
  c = forumList.map(item => {
    //return <li key={item.id}><Link to={`/f/${item.name}`}>{item.name}</Link></li>
    return (
    <li
      key={item.id}
      className={item.name === activeForum ? "active-forum forum-item" : "forum-item"}
      onClick={() => {
        window.scrollTo(0, 0);
        history.push(`/f/${item.name}`);
      }}
      //解析板块名称，时间线特殊解析
      dangerouslySetInnerHTML={{ __html: (item.showName === '' || item.name === '时间线') ? item.name : item.showName }}
    />)
  });
  return (
    <ul className="forum-group">{c}</ul>
    )
}

export { LeftSideBar };