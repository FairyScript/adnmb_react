import React from 'react';
import {useState} from 'react';



//板块组
function ForumGroup(props) {
  let c = props.content.forums.map(list => {
    
    return (
    <li 
      key={list.id}
      dangerouslySetInnerHTML={{ __html: (list.showName === '' || list.name === '时间线') ? list.name : list.showName}}
    />)
  })

    return (
      <ul>{props.content.name}{c}</ul>
    )

}

//板块组列表
function ForumList(props) {
  console.log(props);
  if(props.list === undefined) {
    return <ul>Loading...</ul>
  }
  return (
    props.list.map(group => {
      return <ForumGroup key={group.id} content={group}/>
    })
  )

}

//Left SideBar
function LeftSideBar(props) {
  const list = props.forumList;
  //console.log(`LSB ${list}`)
  return <ForumList list={list}/>
}

export {LeftSideBar};