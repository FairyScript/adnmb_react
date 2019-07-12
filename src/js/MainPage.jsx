import React, { useState, useEffect, useReducer, useCallback } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { parse } from 'query-string';
import { getForumList, getUrl } from '../api/api';
import { Loading } from './Loading';
import { LeftSideBar } from './LeftSideBar';
import { ThreadView } from './ThreadView';
import { PostView } from './PostView';
import '../css/MainPage.scss';

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
          let parsed = parse(location.search);
          return (
            <div className="main-page">
              <LeftSideBar forumList={forumList} history={history} />
              <MainPage {...match.params} {...parsed} />
              <PostView {...match.params} />
            </div>
          )

        }} />
      </Router>


  )
}
export { MainPage };
