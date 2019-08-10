import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import _ from 'lodash';
import { parse } from 'query-string';
import { getForumList, getUrl } from '../api/api';
import { Loading } from './Loading';
import { LeftSideBar } from './LeftSideBar';
import { ThreadView } from './ThreadView';
//import { PostView } from './PostView';
import '../css/MainPage.scss';
import { ErrorPage } from './404';

const DataStore = React.createContext(null);

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
      if (res.ok) {
        //使用lodash索引
        //不再使用sort
        let list = _.flatMap(res.json, g => {
          return g.forums;
        });
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
        <Route path="/" exact render={() => <Redirect to="/f/时间线" />} />
        <Route path="/:mode/:id" render={({ match, location, history }) => {
          return (
            <DataStore.Provider value={{forumList}}>
              <div className="main-page">
                <LeftSideBar match={match} history={history} />
                <ThreadView match={match} location={location} />
                {/*<PostView {...forumInfo} /> */}
              </div>
            </DataStore.Provider>

          )
        }} />
        <Route path="/404" exact component={ErrorPage} />
      </Router>


  )
}
export { MainPage, DataStore };
