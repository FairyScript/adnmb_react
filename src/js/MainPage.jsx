import React, { useState, useEffect, useReducer, useMemo } from 'react';
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
    let page = 1;
    if (action.page) {
      page = action.page;
    }
    switch (action.type) {
      case 'changeForum': {
        return { ...state, mode: 'f', id: Number(action.id), page };//id强制类型转换为Number
      }
      case 'changeThread': {
        return { ...state, mode: 't', id: Number(action.id), page };
      }
      case 'changePage': {
        return { ...state, page };
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
      }

      if (url.page && url.page !== 1) {
        tempInfo.page = url.page;
      }
      dispatch(tempInfo);
      /**对于传入URL，无法正确解析所对应的板块
       * 需要API支持
       */
    }
    fetchData();
  }, []);

  return (
    <div className="main-page">
      <DataStore.Provider value={{ forumInfo, dispatch }}>
        {/**暂时没有办法获取到初始的active forum，切换高亮的逻辑应在子组件内实现 */}
        <LeftSideBar forumList={forumList} />
        {forumInfo.id !== 0 && (<><ThreadView forumList={forumList} />
          <PostView message={forumList[forumInfo.id].msg} /></>)}
      </DataStore.Provider>
    </div>

  )
}

export { MainPage, DataStore };
