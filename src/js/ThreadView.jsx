import React, { useState, useEffect, useContext } from 'react';
import { path, getForum, getThread } from '../api/api';
import Zmage from 'react-zmage';
import { DataStore } from './MainPage';
import '../css/ThreadView.scss';
/**
 * 
 * @param {String} props.mode 内容的类型，根据不同类型使用不同API
 * @param {Number} props.id 页面ID,串号和板块号
 * @param {Number} props.page 页数
 */
function ThreadView() {
  const forumInfo = useContext(DataStore).forumInfo;
  return (
    <div className="thread-view">
      <ThreadList mode={forumInfo.mode} id={forumInfo.id} page={forumInfo.page} />
      <ThreadPage page={forumInfo.page} />
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
          console.log(res.json);
          const list = res.json.map(content => <ThreadContent key={content.id} content={content} />)
          setContent(list);
        }
      }

      if (props.mode === 't') {
        let res = await getThread(props.id, props.page);
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
  return (
    <div className="thread-content">
      <ThreadItem content={props.content} />
      <ThreadReply content={props.content.replys} />
    </div>
  )
}



//回应控件
function ThreadReply(props) {
  return (
    <div className="thread-replys">
      {props.content.map(content => {
        return (
          <div className="thread-reply-item" key={content.id}>
            <ThreadInfo content={content} />
            <ThreadMain content={content} />
          </div>
        )
      })}
    </div>
  )
}

function ThreadItem(props) {
  return (
    <>
      <ThreadInfo content={props.content} />
      <ThreadMain content={props.content} />
    </>
  )
}
//
function ThreadInfo(props) {
  return (
    <div className="thread-info">
      <span className="h-threads-info-title">{props.content.title} </span>
      <span className="h-threads-info-name">{props.content.name} </span>
      <span className="h-threads-info-time">{props.content.now} </span>
      <span className={`h-threads-info-name${props.content.admin === '1' ? ' admin-name' : ''}`}>{props.content.userid} </span>
      <span className="h-threads-info-id">No.{props.content.id}</span>
    </div>
  )
}

//正文内容
function ThreadMain(props) {
  return (
    <div className="thread-main">
      {props.content.img !== '' &&
        <Zmage
          src={`${path.cdnPath}thumb/${props.content.img}${props.content.ext}`}
          alt={props.content.img}
          set={[{ src: `${path.cdnPath}image/${props.content.img}${props.content.ext}` }]}
        />}
      {/**dangerouslySetInnerHTML 并不安全！！！如有机会请自行解析HTML文本 */}
      <div dangerouslySetInnerHTML={{ __html: props.content.content }} />
    </div>
  )
}

//页数控件
function ThreadPage(props) {
  return (
    <div className="thread-page">

    </div>
  )
}


export { ThreadView };