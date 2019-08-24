import React, { useContext, useCallback, useState } from 'react';
//import { Formik, Form, Field } from 'formik';
import { useForm, useField } from "react-final-form-hooks";
import { useDropzone } from 'react-dropzone';
import Cookies from 'universal-cookie';
import { DataStore } from './MainPage';
import {postThread} from '../api/api';
import { Thumb } from './Thumb';
import '../css/PostView.scss'

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

//form
function PostForm({ mode, id }) {
  const history = useContext(DataStore).history;

  const cookies = new Cookies();
  //Callback提交函数
  const onSubmit = useCallback(async values => {
    //构造formData
    let formData = new FormData();
    for (let key in values) {
      if (values[key]) formData.append(key, values[key]);
    }
    //console.log(values);
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: [${pair[1]}]`);
    }
    postThread(formData).then(res => {
      if (res.ok) {
        console.log('发串成功!');
        form.reset();
      } else {
        console.error(res.message);
      }
      history.replace(history.location.pathname+history.location.search);
    });

  }, []);
  const validate = useCallback(values => {
    const errors = {}
    if (values.fid === '-1') {
      errors.content = '时间线不可以';
    }

    return errors
  }, []);

  //Hooks
  //FinalForm使用了订阅机制
  //除手动输入之外的，需要用hook保持和赋值
  const [image, setImage] = useState(null);
  const { forumList } = useContext(DataStore);

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

  //FinalForm
  const { form, handleSubmit, values, pristine, submitting } = useForm({
    initialValues: {
      [postInfo.mode]: postInfo.id,
      water: true,
      admin: false
    },
    onSubmit,
    validate
  });
  const name = useField('name', form);
  const email = useField('email', form);
  const title = useField('title', form);
  const content = useField('content', form);
  const water = useField('water', form);
  const admin = useField('isManager', form);

  //DropZone
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    multiple: false,
    noKeyboard: true,
    noClick: true,
    onDropAccepted: files => setImage(files[0])
  });

  if (image) values.image = image;
  return (
    <>
      <form id="post-form" onSubmit={handleSubmit} {...getRootProps()}>
        <input {...getInputProps()} />{/**图片组件 */}
        <div className="post-info">
          {postInfo.msg}: {id}
        </div>
        <div className="post-item">
          <label>名称</label>
          <input type="text" {...name.input} placeholder="名称" />
        </div>
        <div className="post-item">
          <label>E-mail</label>
          <input type="text" {...email.input} placeholder="E-mail" />
        </div>
        <div className="post-item">
          <label>标题</label>
          <input type="text" {...title.input} placeholder="标题" />
        </div>
        <div className="post-item">
          <label>正文</label>
          <textarea {...content.input} placeholder="请输入正文..." />
          {content.meta.touched && content.meta.error && <span>{content.meta.error}</span>}
        </div>

        <div className="post-item checkboxs">
          <div>
            <label htmlFor="water">水印</label>
            <input type="checkbox" id={water.input.name} checked={water.input.value} {...water.input} />
          </div>
          {cookies.get('admin') && //红名检测,更加建议用classname方式
            <div className="h-tool">
              <label htmlFor="isManager">管理员</label>
              <input type="checkbox" id={admin.input.name} checked={admin.input.value} {...admin.input} />
            </div>}
        </div>

        <div className="post-item buttons">
          <button type="submit" disabled={submitting || (!values.content && !values.image)}> 发串 </button>
          <button
            type="button"
            onClick={() => {
              form.reset();
              setImage(null);//手动清空了image，因为没有对应的组件无法正确reset
            }}
            disabled={submitting || pristine}
          >
            清空
          </button>
        </div>

      </form>

      {values.image && <Thumb file={values.image} />}
      <pre>{JSON.stringify(values, 0, 2)}</pre>
    </>
  )
}

function ToolBar() {
  return null;
}

export { PostView };