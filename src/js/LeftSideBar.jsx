import React, { useState, useContext } from 'react';
import { DataDispatch } from './MainPage';
import '../css/LeftSideBar.scss';

//板块组
function ForumGroup(props) {
  //use Context
  const dispatch = useContext(DataDispatch);

  let c = props.content.forums.map(list => {
    return (
      <li
        key={list.id}
        className={list.id === props.active ? "ActiveForum" : "ForumName"}
        onClick={() => {
          dispatch({ type: 'changeForum', id: list.id });
          props.setActive(list.id);
        }}
        //解析板块名称，时间线特殊解析
        dangerouslySetInnerHTML={{ __html: (list.showName === '' || list.name === '时间线') ? list.name : list.showName }}
      />)
  })

  return (
    <ul className="forum-group">{props.content.name}{c}</ul>
  )

}

//板块组列表
function ForumList(props) {
  //State Hook
  const [activeForum, setActiveForum] = useState(0);

  if (props.list === undefined) {
    return <ul>Loading...</ul>
  }
  return (
    <div className="forum-list">
      {
        props.list.map(group => {
          return (
            <ForumGroup
              key={group.id}
              content={group}
              active={activeForum}
              setActive={setActiveForum}
            />
          )
        })
      }
    </div>
  )

}

function LeftSideBar(props) {
  const list = props.forumList;
  //console.log(`LSB ${list}`)
  return (
    <div className="left-side-bar">
      <ForumList list={list} />
    </div>
  )
}

export { LeftSideBar };