import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Formik, Form, Field } from 'formik';
import Dropzone from 'react-dropzone';
import { DataStore } from './MainPage';
import { postThread } from '../api/api';
import { Thumb } from './3rd-party/Thumb';
import '../css/PostView.scss'

function PostView(props) {
  return (
    <div className="post-view">
      <DebugTool />
      <PostForm forumList={props.forumList} />
      这里是版规
      <ToolBar />
    </div>
  )
}

function DebugTool(props) {
  return null;
}

//发串窗,缓存也保管
function PostForm(props) {
  const forumInfo = useContext(DataStore).forumInfo;
  const [postInfo, setPostInfo] = useState({ mode: null, msg: null, showId: null });

  useEffect(() => {
    //console.log(postInfo);
    switch (forumInfo.mode) {
      case 'f': {
        setPostInfo({ mode: 'fid', msg: '发串模式', showId: props.forumList[forumInfo.id].name });
        return
      }
      case 't': {
        setPostInfo({ mode: 'resto', msg: '回应模式', showId: `No.${forumInfo.id}` });
        return
      }
    }
  }, [forumInfo]);

  const PostItem = props => {
    return (
      <div className="post-item">
        {props.label && <label htmlFor={props.name}>{props.label}</label>}
        <Field {...props} />
      </div>)
  }

  return (
    <Formik
      initialValues={{
        [postInfo.mode]: forumInfo.id,
        name: '',
        email: '',
        title: '',
        content: '',
        image: null,
        water: true,
        isManager: false
      }}
      enableReinitialize={true}
      isInitialValid={false}
      validate={values => {
        let errors = {};
        if (!values.image && values.content === '') {
          console.log('content empty');
          errors.content = '内容不能为空';
        }
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        let formData = new FormData();
        for (let key in values) {
          formData.append(key, values[key]);
        }
        //调试代码
        for (let pair of formData.entries()) {
          console.log(`${pair[0]}: [${pair[1]}]`);
        }
        setTimeout(setSubmitting(false), 1000);
      }}
    >
      {({ isSubmitting, setFieldValue, errors }) => {
        return (
          <Form className="post-form">
            {`${postInfo.msg} ${postInfo.showId}`}
            <PostItem type="text" name="name" label="名称" />
            <PostItem type="email" name="email" label="E-mail" />
            <PostItem type="text" name="title" label="标题" />
            <PostItem type="text" name="content" component="textarea" label="正文" />
            {errors.content && <div id="feedback">{errors.content}</div>}
            <PostItem type="checkbox" name="water" label="水印" />
            <Dropzone
              accept="image/*"
              multiple={false}
              noKeyboard={true}
              onDropAccepted={file => {
                //console.log(file);
                setFieldValue('image', file)
              }}
            >
              {({ getRootProps, getInputProps, acceptedFiles }) => (
                <section>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>Drag 'n' drop some files here, or click to select files</p>
                  </div>
                  {acceptedFiles[0] && <Thumb file={acceptedFiles[0]} />}
                </section>

              )}
            </Dropzone>
            <button type="submit" disabled={isSubmitting}>
              提交
          </button>
          </Form>
        )
      }
      }
    </Formik>
  )
}

function ToolBar(props) {
  return null;
}

export { PostView };