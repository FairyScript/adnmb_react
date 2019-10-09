import React, { useContext, useCallback, useState } from 'react';
import { useFormState } from 'react-use-form-state';
import { useDropzone } from 'react-dropzone';
import Cookies from 'universal-cookie';
import Select from 'react-select';
import { DataStore } from './MainPage';
import { postThread } from '../api/api';
import { Thumb } from './Thumb';
import '../css/PostView.scss'

const cookies = new Cookies();
const storage = window.localStorage;

function PostView({ match }) {
  const { mode, id } = match.params;
  const { forumList, history } = useContext(DataStore);
  const reFresh = () => history.replace(history.location.pathname + history.location.search);
  //构造resto/fid
  let postInfo = {};
  switch (mode) {
    case 'f': {
      postInfo = { mode: 'fid', msg: '发串模式', id: forumList.find(e => e.name === id).id };
      break
    }
    case 't': {
      postInfo = { mode: 'resto', msg: '回应模式', id: id };
      break
    }
    default: postInfo = { mode: 'error', msg: '未知的mode' }
  }
  return (
    <div className="post-view">
      <DebugTool />
      <ToolBar />
      {postInfo.mode !== 'error' && postInfo.id !== '-1' && <PostForm key={match.params.id} postInfo={postInfo} reFresh={reFresh} />}
      {/*版规没想好，等API更新吧 */}
    </div>
  )
}

function DebugTool() {
  return null;
}

function PostForm({ postInfo, reFresh }) {

  const initState = {
    [postInfo.mode]: postInfo.id,
    water: true,
    admin: false
  };

  const [formState, { text, email, textarea, checkbox, label, raw }] = useFormState(initState, {
    withIds: true
  });

  //DropZone
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    multiple: false,
    noKeyboard: true,
    noClick: true,
    onDropAccepted: files => formState.setField('image', files[0])
  });

  //Callback提交函数
  const onSubmit = useCallback(async values => {
    //构造formData
    let formData = new FormData();
    for (let key in values) {
      values[key] && formData.set(key, values[key]);
    }
    //console.log(values);
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: [${pair[1]}]`);
    }
    /* postThread(formData).then(res => {
      if (res.ok) {
        console.log('发串成功!');
        //form.reset();
      } else {
        console.error(res.message);
      }
      reFresh();
    }); */
  }, []);

  return (
    <div id="post-form" {...getRootProps()}>
      <input {...getInputProps()} />{/** DropZone 图片组件 */}
      <input {...raw(postInfo.mode)} type="hidden" />
      <div className="post-item">
        <label {...label('name')}>名称</label>
        <input {...text('name')} />
      </div>

      <div className="post-item">
        <label {...email('email')}>E-mail</label>
        <input {...text('email')} />
      </div>

      <div className="post-item">
        <label {...label('title')}>标题</label>
        <input {...text('title')} />
      </div>

      <div className="post-item">
        <label {...label('content')}>正文</label>
        <input {...textarea('content')} />
      </div>
      <div className="post-item">
        <label {...label('water')}>水印</label>
        <input {...checkbox('water')} />
        {cookies.get('admin') && //红名检测,更加建议用classname方式
          <>
            <label {...label('isManager')}>红名</label>
            <input {...checkbox('isManager')} />
          </>
        }
      </div>
      <button onClick={formState.reset} >清空</button>
      <button
        onClick={() => onSubmit(formState.values)}
        disabled={
          !formState.validity.content &&
          !formState.validity.image
        }
      >发送</button>
      {formState.values.image && <Thumb file={formState.values.image} />}
      {/*<pre>{JSON.stringify(formState, 0, 2)}</pre>*/}
    </div>
  )

}

/**
 * 工具栏
 * - 饼干选择器
 */
function ToolBar() {
  //Cookie Switch
  //const [cookieJar, setCookieJar] = useState(storage.cookieJar);
  const handleChange = useCallback(({ value }) => {
    storage.activeCookie = value;
    cookies.set('userhash', value);
    console.log('Select Cookie:', value);
  }, []);

  let cookieJar = storage.cookieJar;
  let select;
  if (!cookieJar) {//storage为空
    let optText;
    cookies.get('userhash') ? optText = '当前饼干' : optText = '没有饼干';
    select = <Select isDisabled={true} options={{value: '', label: optText }} />;//buggy
  } else {
    cookieJar = JSON.parse(cookieJar);
    let activeCookie = cookies.get('userhash');
    select = (
      <Select
        className="cookie-select"
        defaultValue={cookieJar.find(e => e.value === activeCookie)}
        onChange={handleChange}
        options={cookieJar}
      />
    );
  }

  return (
    <div className="tool-bar">
      <div className="cookie-switch">
        <label>饼干</label>
          {select}
        <button className="get-cookie">获取饼干</button>
      </div>

    </div>
  );
}

export { PostView };