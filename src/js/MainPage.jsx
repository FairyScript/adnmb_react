import React, { useState, useEffect, useReducer, useCallback } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import {collection} from 'lodash';
import { parse } from 'query-string';
import { getForumList, getUrl } from '../api/api';
import { Loading } from './Loading';
import { LeftSideBar } from './LeftSideBar';
import { ThreadView } from './ThreadView';
import { PostView } from './PostView';
import '../css/MainPage.scss';
import { ErrorPage } from './404';

//const DataStore = React.createContext(null);

//A岛主视图
function MainPage(props) {

  //Hook
  const [forumList, setForumList] = useState();
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
      //对于传入URL，无法正确解析所对应的板块
    }
    fetchData();
  }, []);

  return (
    loading ?
      <Loading />
      :
      <Router>
        <Route path="/:mode/:id" render={({ match, location, history }) => {
          let forumInfo = {};
          let parsed = parse(location.search);
          switch(match.params.mode) {
            case 'f': {
              let fid = collection.find(forumList,{name: match.params.id});
              fid ?
                forumInfo = {
                  mode: 'f',
                  id: fid,
                  ...parsed
                }
                : history.replace('/404');
            }
            case 't': {
              forumInfo = {
                ...match.params,
                ...parsed
              }
            }
          }
          return (
            <div className="main-page">
              <LeftSideBar forumList={forumList} {...forumInfo} />
              <MainPage forumList={forumList} {...forumInfo} />
              <PostView forumList={forumList} {...forumInfo} />
            </div>
          )
        }} />
        <Route path="/404" exact component={ErrorPage} />
      </Router>


  )
}
export { MainPage };
