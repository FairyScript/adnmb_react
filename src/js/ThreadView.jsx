import React, { useState, useEffect, useContext, useCallback } from 'react';
import Zmage from 'react-zmage';
import ReactHtmlParser from 'react-html-parser';
import { path, getForum, getThread, getRef, getParent } from '../api/api';
import { DataStore } from './MainPage';
import '../css/ThreadView.scss';

var forumList = {};

function ThreadView(props) {
  const [content, setContent] = useState(null);
  const [replyCount, setReplyCount] = useState();
  const { match, location } = props;
  const { mode, id } = match.params;
  forumList = useContext(DataStore).forumList;

  const params = new URLSearchParams(location.search);
  let page = params.get('page');
  if (!page) page = '1';
  useEffect(() => {
    async function fetchData() {
      if (mode === 'f') {
        const fid = forumList.find(e => e.name === id).id;
        const res = await getForum(fid,page);
        if (res.ok) {
          //console.log(res.json);
          const list = res.json.map(content => <ThreadContent key={content.id} content={content} />)
          setContent(list);
          setReplyCount(null);
        }
      }

      if (mode === 't') {
        const res = await getThread(id, page);
        if (res.ok) {
          setContent(<ThreadContent content={res.json} />);
          setReplyCount(res.json.replyCount);
        }
        console.log('thread update');
      }
    }
    fetchData();
  }, [props]);

  return (
    <div className="thread-view">
      <ThreadPage page={page} replyCount={replyCount} />
      <div className="thread-list">
        {content}
      </div>
    </div>
  );
}

//串内容组件
function ThreadContent(props) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [display, setDisplay] = useState(null);
  const [replyContent, setContent] = useState();
  const _style = {
    position: 'fixed',
    minWidth: 100,
    minHeight: 50,
    left: pos.x,
    top: pos.y,
  }
  const { content } = props;
  return (
    <div className="thread-content">
      <ThreadInfo content={content} />
      <ThreadMain content={content} action={{ setPos, setDisplay, setContent }} />
      {content.sage === '1' && <div className="message-sage">本串已被SAGE</div>}
      {content.remainReplys && <div className="remain-replys">有 {content.remainReplys} 篇回应被折叠</div>/* TODO: 这里可以考虑使用伪元素 */}

      <div className="thread-replys">
        {content.replys.map(content => {
          return (
            <div className="thread-reply-item" key={content.id}>
              <ThreadInfo content={content} />
              <ThreadMain content={content} action={{ setPos, setDisplay, setContent }} />
            </div>
          )
        })}
      </div>

      {display && <div className="thread-preview" style={_style}>{replyContent}</div>}
    </div>
  );
}

//
function ThreadInfo(props) {
  const history = useContext(DataStore).history;
  return (
    <div className="thread-info">
      <span className="h-threads-info-title">{props.content.title} </span>
      <span className="h-threads-info-name">{props.content.name} </span>
      <span className="h-threads-info-time">{props.content.now} </span>
      <span className={`h-threads-info-name${Number(props.content.admin) === 1 ? ' admin-name' : ''}`}>{props.content.userid}</span>
      {'fid' in props.content && <span className="h-threads-info-fid">[{forumList.find(e => e.id === props.content.fid).name}]</span>}
      <span
        className="h-threads-info-id"
        onClick={() => {
          getParent(props.content.id).then(res => {
            if (res.ok) history.push(`/t/${res.id}`);
          });
        }}>
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
  const history = useContext(DataStore).history;

  const transform = useCallback((node, index) => {
    if (/>>No\.\d+/.test(node.data)) {
      let rid = node.data.match(/>>No\.(\d+)/);
      return (
        <span
          key={index}
          className="reply-number"
          onMouseEnter={() => {
            //console.log('Mouse Enter');
            props.action.setDisplay(true);
            getReply(rid[1]).then(component => {
              //console.log(json);
              props.action.setContent(component);
            });
          }}
          onMouseLeave={() => {
            //console.log('Mouse Leave');
            props.action.setDisplay(null);
            props.action.setContent(null);//清空state
          }}
          onMouseMove={e => {
            props.action.setPos({
              x: e.clientX + 20,
              y: e.clientY - 30
            });
          }}
          onDoubleClick={() => {
            getParent(props.content.id).then(res => {
              if (res.ok) history.push(`/t/${res.id}`);
            });
          }}
        >
          {rid[0]}
        </span>
      )
    }
  },[])

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
function ThreadPage({ page }) {
  const {history} = useContext(DataStore);
  return (
    <>
    {page !== '1' && <button onClick={() => history.push({search: `?page=${Number(page)-1}`})}>上一页</button>}
    <button onClick={() => history.push({search: `?page=${Number(page)+1}`})}>下一页</button>
    </>
  )
}


export { ThreadView };