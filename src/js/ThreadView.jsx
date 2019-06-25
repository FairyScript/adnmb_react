import React, { useState, useEffect, useContext } from 'react';
import { path, getForum, getThread, getRef, getParent } from '../api/api';
import Zmage from 'react-zmage';
import ReactHtmlParser from 'react-html-parser';
import { DataStore } from './MainPage';
import '../css/ThreadView.scss';

var forumList = {};

function ThreadView(props) {
  const forumInfo = useContext(DataStore).forumInfo;
  forumList = props.forumList;
  return (
    <div className="thread-view">
      <ThreadPage mode={forumInfo.mode} page={forumInfo.page} />
      <ThreadList mode={forumInfo.mode} id={forumInfo.id} page={forumInfo.page} />
    </div>
  );
}

//正文列表
function ThreadList(props) {
  const [content, setContent] = useState(null);

  useEffect(() => {
    async function fetchData() {
      if (props.id === 0) return null;
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

  return content;
}

//串内容组件
function ThreadContent(props) {
  const [pos,setPos] = useState({x: 0, y: 0});
  const [display,setDisplay] = useState('none');
  const _style = {
    display,
    position: 'fixed',
    left: pos.x,
    top: pos.y,
    background: 'red'
  }
  return (
    <div className="thread-content">
      <ThreadInfo content={props.content} />
      <ThreadMain content={props.content} />
      {props.content.remainReplys && <div className="remain-replys">有 {props.content.remainReplys} 篇回应被折叠</div>}
      <div className="thread-replys">
        {props.content.replys.map(content => {
          return (
            <div className="thread-reply-item" key={content.id}>
              <ThreadInfo content={content} />
              <ThreadMain content={content} action={{setPos,setDisplay}}/>
            </div>
          )
        })}
      </div>
      <div className="thread-preview" style={_style}>
        {`X:${pos.x} Y:${pos.y}`}
      </div>
    </div>
  )
}

//
function ThreadInfo(props) {
  const dispatch = useContext(DataStore).dispatch;
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
      <span
        className="h-threads-info-id"
        onClick={() => {
          getParent({ id: props.content.id }).then(res => {
            if (res.ok) {
              dispatch({ type: 'changeThread', id: res.id });
            }
          })
        }}
      >
        No.{props.content.id}
      </span>
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
  const transform = (node, index) => {
    if (/>>No\.\d+/.test(node.data)) {
      let rid = node.data.match(/>>No\.(\d+)/);
      return (
        <span
          className="reply-number"
          key={index}
          onMouseEnter={() => {props.action.setDisplay('block')}}
          onMouseLeave={() => {props.action.setDisplay('none')}}
          onMouseMove={e => {
            props.action.setPos({
              x: e.clientX + 20,
              y: e.clientY - 30
            });
            //console.log(pos);
            //实际工作代码,注释
            /* const res = await getRef({ id: rid[1] });
            if (res.ok) {
              const json = res.json;
              return (
                <div className="quicklook-ref">
                  <ThreadInfo content={props.content} />
                  <ThreadMain content={props.content} />
                </div>
                
              )
            } */
          }}
          onDoubleClick={() => { console.log(rid[1]) }}
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

//页数控件
function ThreadPage(props) {
  //页数按钮组件
  function PageItem(props) {
    return (
      <button className="thread-page-button" onClick={props.click}>
        {props.content}
      </button>
    )
  }

  const dispatch = useContext(DataStore).dispatch;

  return (
    <div className="thread-page">
      {props.page > 1 && <PageItem content="上一页" click={() => dispatch({ type: 'changePage', page: props.page - 1 })} />}
      <PageItem content="下一页" click={() => dispatch({ type: 'changePage', page: props.page + 1 })} />
    </div>
  )
}


export { ThreadView };