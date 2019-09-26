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

function PostView({ match }) {
  return (
    <div className="post-view">
      <DebugTool />
      <PostForm key={match.params.id} {...match.params} />
      {/*版规没想好，等API更新吧 */}
      <ToolBar />
    </div>
  )
}

function DebugTool() {
  return null;
}

function PostForm({ mode, id }) {
  const { forumList, history } = useContext(DataStore);
  //Form
  const initState = {
    [postInfo.mode]: postInfo.id,
    water: true,
    admin: false
  };

  const [formState, { text, email, textarea, select, label }] = useFormState(initState, {
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
      values[key] && formData.append(key, values[key]);
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
      history.replace(history.location.pathname + history.location.search);
    }); */
  }, []);

  const validate = useCallback(values => {
    const errors = {}
    if (values.fid === '-1') {
      errors.content = '时间线不可以';
    }
    return errors
  }, []);

  //构造resto/fid
  let postInfo = {};
  switch (mode) {
    case 'f': {
      postInfo = { mode: 'fid', msg: '发串模式', id: forumList.find(e => e.name === id).id };
      break
    }
    case 't': {
      postInfo = { mode: 'resto', msg: '回应模式', id };
      break
    }
  }

  return (
    <div id="post-form" {...getRootProps()}>
      <input {...getInputProps()} />{/** DropZone 图片组件 */}

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

      <button onClick={formState.reset} />
      {formState.values.image && <Thumb file={formState.values.image} />}
      {<pre>{JSON.stringify(formState.values, 0, 2)}</pre>}
    </div>
  )

}

/**
 * 工具栏
 * - 饼干选择器
 */
function ToolBar() {
  //Cookie Switch
  const [activeCookie, setActiveCookie] = useState(cookies.get('userhash'));
  const handleChange = useCallback(({ value }) => {
    setActiveCookie(value)
    cookies.set('userhash', value);
    console.log('Select Cookie:', value);
  }, []);

  const storage = window.localStorage;
  let cookieJar = [];
  if (storage.cookie) {
    cookieJar = JSON.parse(storage.cookie)
  } else if (activeCookie) {
    cookieJar = [{ label: '当前饼干', value: activeCookie }];
    storage.cookie = JSON.stringify(cookieJar);
  };

  return (
    <div className="tool-bar">
      <div className="cookie-switch">
        <label>饼干</label>
        <Select
          className="cookie-select"
          defaultValue={cookieJar.find(e => e.value === activeCookie)}
          isDisabled={!activeCookie}
          onChange={handleChange}
          options={cookieJar}
        />
        <button className="get-cookie">获取饼干</button>
      </div>

    </div>
  );
}

export { PostView };