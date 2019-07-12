import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from "react-router-dom";
import Zmage from 'react-zmage';
import ReactHtmlParser from 'react-html-parser';
import { path, getForum, getThread, getRef, getParent } from '../api/api';
//import { DataStore } from './MainPage';
import '../css/ThreadView.scss';

var collection = require('lodash');

var forumList = {};

function ThreadView(props) {
  const [content, setContent] = useState(null);

  useEffect(() => {
    async function fetchData() {
      if (props.mode === 'f') {
        let res = await getForum({ id: props.id, page: props.page });
        if (res.ok) {
          //console.log(res.json);
          const list = res.json.map(content => <ThreadContent key={content.id} content={content} />)
          setContent(list);
        }
      }

      if (props.mode === 't') {
        let res = await getThread({ id: props.id, pages: props.page });
        if (res.ok) {
          setContent(<ThreadContent content={res.json} />)
        }
        console.log('thread update');
      }
    }
    fetchData();
  }, [props])
  return (
    <div className="thread-view">
      <div className="thread-list">
      {content}
      </div>
      <ThreadPage {...props} />
    </div>
  );
}

//串内容组件
function ThreadContent(props) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [display, setDisplay] = useState('none');
  const [replyContent, setContent] = useState();
  const _style = {
    display,
    position: 'fixed',
    minWidth: 100,
    minHeight: 50,
    left: pos.x,
    top: pos.y,
  }
  return (
    <div className="thread-content">
      <ThreadInfo content={props.content} />
      <ThreadMain content={props.content} action={{ setPos, setDisplay, setContent }} />
      {props.content.sage === '1' && <div className="message-sage">本串已被SAGE</div>}
      {props.content.remainReplys && <div className="remain-replys">有 {props.content.remainReplys} 篇回应被折叠</div>/* TODO: 这里可以考虑使用伪元素 */}

      <div className="thread-replys">
        {props.content.replys.map(content => {
          return (
            <div className="thread-reply-item" key={content.id}>
              <ThreadInfo content={content} />
              <ThreadMain content={content} action={{ setPos, setDisplay, setContent }} />
            </div>
          )
        })}
      </div>

      <div className="thread-preview" style={_style}>
        {replyContent}
      </div>
    </div>
  )
}

//
function ThreadInfo(props) {
  return (
    <div className="thread-info">
      <span className="h-threads-info-title">{props.content.title} </span>
      <span className="h-threads-info-name">{props.content.name} </span>
      <span className="h-threads-info-time">{props.content.now} </span>
      <span className={`h-threads-info-name${Number(props.content.admin) === 1 ? ' admin-name' : ''}`}>{props.content.userid}</span>
      {'fid' in props.content &&
        <span className="h-threads-info-fid">
          [{forumList[props.content.fid].name}]
        </span>
      }
      {withRouter(<span
        className="h-threads-info-id"
        onClick={({ history }) => {
          getParent(props.content.id).then(res => {
            if (res.ok) {
              history.push(`/t/${res.id}`);
            }
          })
        }}
      >
        No.{props.content.id}
      </span>
      )}
    </div>
  )
}

//正文内容
function ThreadMain(props) {
  //捕获引用串号
  /**
   * TODO:
   * 已知问题:
   * 当回应与正文之间没有分隔符时,无法正常解析
   * 有机会再修,初步想法是在他们之间插入一个空格丢回去重新parse
   */
  const dispatch = useContext(DataStore).dispatch;

  const transform = (node, index) => {
    if (/>>No\.\d+/.test(node.data)) {
      let rid = node.data.match(/>>No\.(\d+)/);
      return withRouter(
        <span
          className="reply-number"
          key={index}
          onMouseEnter={() => {
            props.action.setDisplay('block');
            getReply(rid[1]).then(component => {
              //console.log(json);
              props.action.setContent(component);
            });
          }}
          onMouseLeave={() => {
            props.action.setDisplay('none');
            props.action.setContent(null);//清空state
          }}
          onMouseMove={e => {
            props.action.setPos({
              x: e.clientX + 20,
              y: e.clientY - 30
            });
          }}
          onDoubleClick={({ history }) => {
            getParent(props.content.id).then(res => {
              if (res.ok) {
                history.push(`/t/${res.id}`);
              }
            })
          }}
        >
          {rid[0]}
        </span>
      )
    }
  }
  return (
    <div className="thread-main">
      {props.content.img !== '' &&
        <Zmage
          src={`${path.cdnPath}thumb/${props.content.img}${props.content.ext}`}
          alt={props.content.img}
          set={[{ src: `${path.cdnPath}image/${props.content.img}${props.content.ext}` }]}
        />}
      {ReactHtmlParser(props.content.content, { transform })}
    </div>
  )
}

//Ref获取和缓存
//使用了sessionStorage缓存获取到的串内容
//TODO 考虑移出组件文件
async function getReply(rid) {
  let storage = window.sessionStorage;
  let json = {};
  //console.log(rid,storage.rid);
  if (storage[rid] !== undefined) {
    json = JSON.parse(storage[rid]);
  } else {
    //console.log('缓存未命中');
    const res = await getRef(rid);
    if (res.ok) {
      if (res.json === 'thread不存在') return <div>{res.json}</div>
      json = res.json;
    } else {
      //异常情况下需要手动构建json
      return <div>Error!</div>
    }
    storage[rid] = JSON.stringify(res.json);
  }
  return (
    <>
      <ThreadInfo content={json} />
      <ThreadMain content={json} />
    </>
  )
}
//页数控件
function ThreadPage(props) {
  //页数按钮组件
  const PageItem = props => {

  }

  return (
    <div className="thread-page">
      {props.page > 1 && <PageItem content="上一页" click={() => dispatch({ type: 'changePage', page: props.page - 1 })} />}
      <PageItem content="下一页" click={() => dispatch({ type: 'changePage', page: props.page + 1 })} />
    </div>
  )
}


export { ThreadView };