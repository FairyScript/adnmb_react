import React from 'react';
import { PostView } from './PostView';
import { DebugTool } from './DebugTool';

function RightSideBar(props) {
  return (
    <div className="RightSideBar" >
      <DebugTool />
      <PostView />
    </div>
  )
}

export { RightSideBar };