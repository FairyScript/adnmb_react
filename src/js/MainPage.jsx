import React, { useState, useEffect, useReducer,useMemo } from 'react';
import { getForumList, getUrl } from '../api/api'
import { LeftSideBar } from './LeftSideBar';
import { ThreadView } from './ThreadView';
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
  const [forumList, setForumList] = useState();
  const [forumInfo, dispatch] = useReducer(reducer, defaultData);

  function reducer(state, action) {
    console.log(action);
    switch (action.type) {
      case 'changeForum': {
        return {...state, mode: 'f', id: action.id };
      }
      case 'changeThread': {
        return {...state, mode: 't', id: action.id };
      }
      case 'changePage': {
        return {...state, page: action.page };
      }
      default: {
        console.error(action);
      }
    }
  }


  //init
  useEffect(() => {
    async function fetchData() {
      //加载板块列表
      let res = await getForumList();
      if (res.ok) {
        //console.log(res.json);
        setForumList(res.json);
      }

      //解析URL
      let url = getUrl();
      //板块视图，根据板块名称获取对应的ID
      if (url.viewmode === 'f') {
        res.json.forEach(gruop => {
          gruop.forums.forEach(item => {
            if (item.name === url.id) {
              console.log('changeForum');
              dispatch({ type: 'changeForum', id: item.id })
            };
          })
        })
      } else {
        console.log('changeThread');
        dispatch({ type: 'changeThread', id: url.id });
      }

      if (url.page) {
        console.log('changePage');
        dispatch({ type: 'changePage', page: url.page });
      }

      /**对于传入URL，无法正确解析所对应的板块
       * 需要API支持
       */
    }

    fetchData();
  }, []);

  useEffect(() => {
    console.log(forumInfo);
  },[forumInfo]); 
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

export { MainPage, DataDispatch };
