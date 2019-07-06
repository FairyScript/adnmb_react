import React, { useState, useContext } from 'react';
import { formik, Formik } from 'formik';
import { DataStore } from './MainPage';
import { postThread } from '../api/api';
import '../css/PostView.scss'
function DebugTool(props) {
  return null;
}

//发串窗,缓存也保管
function PostView(props) {
  const forumInfo = useContext(DataStore).forumInfo;
  const postForm = (
    <Formik 
      initialValues = {{
        water: true,
        isManager: false
      }}
      onSubmit = {(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 500);
      }}
    >
      {props => {
        const {
          values,
          touched,
          errors,
          dirty,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
          handleReset,
        } = props;
        return (
          <form onSubmit={handleSubmit}>
            <label htmlFor="post-name">
              名称
            </label>
            <input
              id="post-name"
              type="text"
              value={values.name}
              onChange={handleChange}
              className="post-item"
            />
            <label htmlFor="post-email">
              Email
            </label>
            <input
              id="post-email"
              type="text"
              value={values.email}
              onChange={handleChange}
              className="post-item"
            />
            <label htmlFor="post-title">
              标题
            </label>
            <input
              id="post-title"
              type="text"
              value={values.title}
              onChange={handleChange}
              className="post-item"
            />
            <label htmlFor="post-content">
              正文
            </label>
            <textarea
              id="post-content"
              type="text"
              value={values.content}
              onChange={handleChange}
              className="post-item"
            />
            <label>上传图片</label>
            <input
              id="post-water"
              type="checkbox"
              checked={values.water}
              onChange={handleChange}
              className="post-item"
            />添加水印
            <input
              id="post-title"
              type="checkbox"
              checked={values.water}
              onChange={handleChange}
              className="post-item"
            />
            <button type="submit" disabled={isSubmitting}>
              提交
            </button>
          </form>
        )
      }}
    </Formik>
  )

  return (
    <div className="post-form">
      {postForm}
      这里是版规
    </div>
  )
}

function ToolBar(props) {
  return null;
}

export { PostView };