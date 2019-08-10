import React, { useState, useEffect, useContext } from 'react';
import { Formik, Form, Field } from 'formik';
import Dropzone from 'react-dropzone';
//import { useCookies } from 'react-cookie';
//import { DataStore } from './MainPage';
import { postThread } from '../api/api';
import { Thumb } from './Thumb';
import '../css/PostView.scss'

function PostView(props) {
  return (
    <div className="post-view">
      <DebugTool />
      <PostForm forumList={props.forumList} />
      <div className="forum-message">这里是版规</div>
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
        if (values[postInfo.mode] === -1) {
          errors.content = '时间线不能发串';
        }
        if (!values.image && values.content === '') {
          console.log('content empty');
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
          {`${postInfo.msg} ${postInfo.showId}`}
          <PostItem name="name" label="名称" />
          <PostItem type="email" name="email" label="E-mail" />
          <PostItem name="title" label="标题" />
          <PostItem name="content" component="textarea" placehodler={'输入正文...'/**因为版规似乎是私有的,先这样 */} label="正文" />
          {errors.content && <div id="feedback">{errors.content}</div>}
          <PostItem type="checkbox" name="water" checked={values.water} label="水印" />
          <PostItem type="checkbox" name="isManager" checked={values.isManager} label="红名" />
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