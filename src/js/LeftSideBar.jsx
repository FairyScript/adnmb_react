import React from 'react';

//Left SideBar
function LeftSideBar(props) {
    return <ForumListBox list={props.detail}/>
  }
  //板块列表
  function ForumListBox(props) {
    console.log(props.list);
    const groupList = props.list.map(group => {
      return (
        <ul>
          <li key={group.id}>
            {group.name}
            <ul><ForumList list={group.forums}/></ul>
          </li>
        </ul>
      )
    });
    return groupList;
  }
  
  //板块组列表
  function ForumList(props) {
    return (
      props.list.map(detail => {
        if(detail.showName === '') {detail.showName = detail.name}
        return (
          <li key={detail.id}>
            {detail.showName}
          </li>
        )
      })
    );
  }
export default LeftSideBar;