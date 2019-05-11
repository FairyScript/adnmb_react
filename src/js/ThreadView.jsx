import React from 'react';
//文章主体h-content


  
  //正文列表
  function ThreadList(props) {
    //const forumId = props.forumId;
    const forumJson = testData.showf;
    return (
      forumJson.map(content => {
        return (
          <>
          <ThreadContent content={content} />
          <ThreadReply content={content.replys}/>
          </>
        )
      })
    )
  }
  
  //串内容组件
  function ThreadContent(props) {
        return (
          <>
          <ThreadInfo detail={props.content}/>
          <ThreadMain detail={props.content}/>
          </>
        )
  }
  
  //
  function ThreadInfo(props) {
    return (
      <>
      <span className="h-threads-info-title">{props.detail.title} </span>
      <span className="h-threads-info-name">{props.detail.name} </span>
      <span className="h-threads-info-time">{props.detail.now} </span>
      <span className="h-threads-info-userid">{props.detail.userid} </span>
      <span className="h-threads-info-id">{props.detail.id}</span>
      </>
    )
  }
  
  //正文内容
  function ThreadMain(props) {
    return (
      <>
      {props.detail.img === '' && 
        //需要额外的图片控件
        <img className="h-threads-image"></img>
      }
      {/**dangerouslySetInnerHTML 并不安全！！！如有机会请自行解析HTML文本 */}
      <div dangerouslySetInnerHTML={{__html: props.detail.content}} />
      </>
    )
  }
  
  //回应控件
  function ThreadReply(props) {
    return props.content.map(detail => {
      return (
        <>
        <ThreadInfo detail={detail}/>
        <ThreadMain detail={detail}/>
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
  
  function ThreadView(props) {
    return (
      <>
        <ThreadList forumId={props.forumId}/>
        <ThreadPage page={props.forumPage}/>
      </>
    );
  }
export {ThreadView};