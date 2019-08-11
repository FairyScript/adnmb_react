import React, { useState, useEffect, useContext } from 'react';
import { Formik, Form, Field } from 'formik';
import Dropzone from 'react-dropzone';
import _ from 'lodash';
import Cookies from 'universal-cookie';
import { DataStore } from './MainPage';
import { postThread } from '../api/api';
import { Thumb } from './Thumb';
import '../css/PostView.scss'

function PostView(props) {
  return (
    <div className="post-view">
      <DebugTool />
      <PostForm {...props} />
      {/*版规没想好，等API更新吧 */}
      <ToolBar />
    </div>
  )
}

function DebugTool(props) {
  return null;
}

function PostItem(props) {
  return (
    <div className="post-item">
      {props.label && <label htmlFor={props.name}>{props.label}</label>}
      <Field {...props} />
    </div>
  )
}
//发串窗,缓存也保管
function PostForm({match}) {
  const {forumList,location} = useContext(DataStore);
  const rid = new URLSearchParams(location).get('r');
  const cookie = new Cookies();
  const {mode,id} = match.params;
  let postInfo = { mode: null, msg: null, id: null };

  switch (mode) {
    case 'f': {
      postInfo = { mode: 'fid', msg: '发串模式', id: forumList.find(e => e.name === id).id};
      break
    }
    case 't': {
      postInfo = { mode: 'resto', msg: '回应模式', id };
      break
    }
  }

  return (
    <Formik
      initialValues={{
        [postInfo.mode]: postInfo.id,
        name: undefined,
        email: undefined,
        title: undefined,
        content: undefined,
        image: null,
        water: true,
        isManager: false
      }}
      enableReinitialize={true}
      isInitialValid={false}
      validate={values => {
        let errors = {};
        if (values[postInfo.mode] === '-1') {
          errors.content = '时间线不能发串';
        }
        if (!values.image && !values.content) {
          errors.content = '内容不能为空';
        }
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        let formData = new FormData();
        for (let key in values) {
          if (values[key]) formData.append(key, values[key]);
        }

        console.log(values);
        for (let pair of formData.entries()) {
          console.log(`${pair[0]}: [${pair[1]}]`);
        }
        /* postThread(formData).then(res => {
          if(res.ok) {
            console.log('发串成功!');
          } else {
            console.error(res.message);
          }
        }); */
        setTimeout(setSubmitting(false), 1000);
      }}
    >
      {({ isSubmitting, setFieldValue, values, errors }) => (
        <Form className="post-form">
          {`${postInfo.msg} ${id}`}
          <PostItem name="name" label="名称" />
          <PostItem type="email" name="email" label="E-mail" />
          <PostItem name="title" label="标题" />
          <PostItem name="content" component="textarea" placehodler={'输入正文...'/**因为版规似乎是私有的,先这样 */} label="正文" />
          {errors.content && <div id="feedback">{errors.content}</div>}
          <PostItem type="checkbox" name="water" checked={values.water} label="水印" />
          {cookie.get('admin') && <PostItem type="checkbox" name="isManager" checked={values.isManager} label="红名" />}
          <Dropzone
            accept="image/*"
            multiple={false}
            noKeyboard={true}
            onDropAccepted={files => {
              //console.log(files);
              setFieldValue('image', files[0])
            }}
          >
            {({ getRootProps, getInputProps }) => (
              <section>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <p>Drag 'n' drop some files here, or click to select files</p>
                </div>
              </section>
            )}
          </Dropzone>
          {values.image && <Thumb file={values.image} />}
          <button type="submit" disabled={isSubmitting}>
            提交
          </button>
        </Form>
      )

      }
    </Formik>
  )
}

function ToolBar(props) {
  return null;
}

export { PostView };