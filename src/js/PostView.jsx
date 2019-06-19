import React from 'react';

//回应控件
function PostView(props) {
  return null;
}

//发串窗,缓存也保管
function PostForm(props) {
  return (
    <div className="postform">
      <textarea className="postform-content" />
      <ToolBar />
    </div>
  )
}

function ToolBar(props) {

}
export { PostView };