/* * * * * * * * *
 * A岛黎明版(使用React构建)
 * Developed by Sharin in 2019
 * //////WARNING//////
 * 工地英语
 * 辣鸡代码
 * 令人迷惑的注释
 */

import React from 'react';
import { Router, Route, Link } from 'react-router-dom';
import LeftSideBar from './js/LeftSideBar';
import ThreadView from './js/ThreadView';
import './css/App.css';
import { request } from 'http';


//MainPage 主窗体视图
class MainPage extends React.Component {
  constructor(props) {
    super(props);
    /**
     * 初始化代码
     * forumID和threadID需要将URL解析的部分完成后一并完成
     */
    
    this.state = {
      forumId: 4,
      threadId: 0,
      page: 1
    }
  }

  changeForum = id => {
    this.setState({forumId: id});
  }

  changeThread = id => {
    this.setState({threadId: id});
  }
  
  render() {
    this.forumInfo = fetch('./data/getForumList.json')
    .then(res => res.json())
    .then(json => this.forumInfo = json);
    return (
      <div>
      <LeftSideBar className="left-side-bar" detail={this.forumInfo}/>
      <ThreadView
        forumId={this.state.forumId}
        changeForum={this.changeForum}
        forumPage={this.state.forumPage}
        changeThread={this.changeThread}
      />
      </div>
    )
  }
}
//
function App() {
  return (
    <Router>
      <Switch>
      <Route exact path="/" Component={MainPage} />
      <Route path="/" Component={MainPage} />
      </Switch>
    </Router>
  )
}

export default App;
