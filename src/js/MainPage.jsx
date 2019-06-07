import React,{useState,useEffect,useReducer} from 'react';
import {getForumList,getUrl} from '../api/api'
import {LeftSideBar} from './LeftSideBar';
import {ThreadView} from './ThreadView';
import '../css/App.scss';

//context
const DataDispatch = React.createContext(null);

//A岛主视图
function MainPage() {
  //默认state
  const defaultData = {
    mode: 'f',//类型
    id: 0,//串ID
    page: 1,//页码
  }

  

  //Hook
  const [forumList,setForumList] = useState();
  const [forumInfo,dispatch] = useReducer(reducer,defaultData);

  function reducer(state,action) {
    switch (action.type) {
      case 'changeForum': //更改板块
        return Object.assign(state,{mode: 'f',id: action.content});
      case 'changeThread':
        return Object.assign(state,{mode: 't',id: action.content});
      case 'changePage':
        return Object.assign(state,{page: action.content});
    }
  }


  //init
  useEffect(() => {
    async function fetchData() {
      //加载板块列表
      let res = await getForumList();
      if(res.ok) {
        //console.log(res.json);
        setForumList(res.json);
      }
      
      //解析URL
      let url = getUrl();
      //板块视图，根据板块名称获取对应的ID
      if(url.viewmode === 'f') {
        res.json.map(gruop => {
          gruop.forums.map(item => {
            if(item.name === url.tid) {
              console.log('changeForum');
              dispatch({type: 'changeForum',content: item.id})};
          })
        })
      } else {
        console.log('changeThread');
        dispatch({type: 'changeThread',content: url.tid});
      }
      
      if(url.page) {
        console.log('changePage');
        dispatch({type: 'changePage',content: url.page});
      }
      
      /**对于传入URL，无法正确解析所对应的板块
       * 需要API支持
       */
    }

    fetchData();
  },[]);
  
  return (
    <DataDispatch.Provider value={dispatch}>
      <LeftSideBar className="LeftSideBar" forumList={forumList} />
      <ThreadView 
        className="ThreadView" 
        mode={forumInfo.mode} 
        id={forumInfo.id} 
        page={forumInfo.page}
        />
    </DataDispatch.Provider>
  )
}

export {MainPage,DataDispatch};
