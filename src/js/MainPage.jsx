import React, { useState, useEffect, useReducer, useCallback } from 'react';
import { getForumList, getUrl } from '../api/api'
import { LeftSideBar } from './LeftSideBar';
import { ThreadView } from './ThreadView';
import { PostView } from './PostView';
import '../css/MainPage.scss';

/**
 * @member {Object} forumInfo 串信息
 * @member {function} dispatch 操作函数
 */
const DataStore = React.createContext(null);

function reducer(state, action) {
  //console.log(action);
  console.log('state:', state,'action:',action);
  let page = action.page ? action.page : 1;
  switch (action.type) {
    case 'changeForum': {
      //window.history.pushState(state,null,`/f/${forumList[action.id].name}`);
      return { ...state, mode: 'f', id: Number(action.id), page };//id强制类型转换为Number
    }
    case 'changeThread': {
      //window.history.pushState(state,null,`/t/${action.id}`);
      return { ...state, mode: 't', id: Number(action.id), page };
    }
    case 'changePage': {
      //window.history.pushState(state,null,`?page=${page}`);
      return { ...state, page };
    }
    case 'popstate': {
      //console.log('state:',state,'action',action.state);
      return { ...action.state };
    }
    default: {
      console.error(action);
    }
  }
}

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
  const [loading, setLoading] = useState(true);
  const [forumInfo, dispatch] = useReducer(reducer, defaultData);

  //init
  useEffect(() => {
    async function fetchData() {
      //加载板块列表
      //暂且放弃了ForumGroup的使用
      //因为之后会增加自定义板块的功能
      let res = await getForumList();
      let list = {};
      if (res.ok) {
        //将板块ID作为key处理
        let sort = 0;
        res.json.forEach(group => {
          group.forums.forEach(item => {
            list[item.id] = item;
            list[item.id].sort = ++sort;
          })
        });
        //console.log(list);
        setForumList(list);
      }

      //解析URL
      const url = getUrl();
      let tempInfo = {};
      //板块视图，根据板块名称获取对应的ID
      switch (url.viewmode) {
        case 'f': {
          let fid;
          for (let e in list) {
            if (list[e].name === url.id) {
              fid = list[e].id;
            }
          }
          tempInfo = { type: 'changeForum', id: fid };
          break
        }
        case 't': {
          tempInfo = { type: 'changeThread', id: url.id };
          break
        }
        default: {
          console.log(`暂不支持的viewmode:${url.viewmode}`);
        }
      }

      if (url.page && url.page !== 1) {
        tempInfo.page = url.page;
      }
      dispatch(tempInfo);
      setLoading(false);
      /**对于传入URL，无法正确解析所对应的板块
       * 需要API支持
       */
    }
    fetchData();
  }, []);

  useEffect(() => {
    console.log('will set:',forumInfo);
    //window.history.pushState(state,null,`/f/${forumList[action.id].name}`);
  },[forumInfo])

  window.onpopstate = e => {
    console.log(e.state);
    //dispatch({ type: 'popstate', state: e.state });
  }

  return (
    <div className="main-page">
      <DataStore.Provider value={{ forumInfo, dispatch }}>
        {loading ?
          <h1>Loading...</h1>
          : (
          <>
            <LeftSideBar forumList={forumList} />
            <ThreadView forumList={forumList} />
            <PostView forumList={forumList} />
          </>
        )}
      </DataStore.Provider>
    </div>

  )
}

export { MainPage, DataStore };
