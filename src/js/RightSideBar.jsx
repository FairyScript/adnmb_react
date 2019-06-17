import React from 'react';
import { PostView } from './PostView';

function DebugTool(props) {
  return null;
}
function RightSideBar(props) {
  return (
    <div className="RightSideBar" >
      <DebugTool />
      <PostView />
    </div>
  )
}

export { RightSideBar };