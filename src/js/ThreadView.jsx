import React,{useState,useEffect} from 'react';
import {getForum,getThread} from '../api/api';

/**
 * 
 * @param {String} props.mode 内容的类型，根据不同类型使用不同API
 * @param {Number} props.id 页面ID,串号和板块号
 * @param {Number} props.page 页数
 */
function ThreadView(props) {
  return (
    <div className="thread-view">
      <ThreadList mode={props.mode} id={props.id} page={props.page}/>
      <ThreadPage page={props.page}/>
    </div>
  );
}

//正文列表
function ThreadList(props) {
  const [content,setContent] = useState(null);

  useEffect(() => {
    async function fetchData() {
      if(props.id === 0) return null;
      if(props.mode === 'f') {
        let res = await getForum({id: props.id,page: props.page});
        if(res.ok) {
          console.log(res.json);
          const list = res.json.map(content => <ThreadContent key={content.id} content={content}/>)
          setContent(list);
        }
      }

      if(props.mode === 't') {
        let res = await getThread(props.id,props.page);
        if(res.ok) {
          setContent(<ThreadContent content={res.json}/>)
        }
      console.log('thread update');
      }
    }
    fetchData();
  },[props])

  return content;
}

//串内容组件
function ThreadContent(props) {
      return (
        <>
        <ThreadInfo content={props.content}/>
        <ThreadMain content={props.content}/>
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
    <span className="h-threads-info-userid">{props.content.userid} </span>
    <span className="h-threads-info-id">{props.content.id}</span>
    </div>
  )
}

//正文内容
function ThreadMain(props) {
  return (
    <>
    {props.content.img === '' && 
      //需要额外的图片控件
      <img className="h-threads-image"></img>
    }
    {/**dangerouslySetInnerHTML 并不安全！！！如有机会请自行解析HTML文本 */}
    <div dangerouslySetInnerHTML={{__html: props.content.content}} />
    </>
  )
}

//回应控件
function ThreadReply(props) {
  return props.content.map(content => {
    return (
      <>
      <ThreadInfo content={content}/>
      <ThreadMain content={content}/>
      </>
    ) 
  })
}

//页数控件
function ThreadPage(props) {
  return (
    null
  )
}


export {ThreadView};