import React, { useContext } from 'react';
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
      initialValues={{
        resto: '',
        isManager: false,
        name: '',
        email: '',
        title: '',
        content: '',
        water: true,
        image: undefined
      }}
      onSubmit={((values, { setSubmitting }) => {
        setTimeout(() => {
          let body = new FormData();
          for (let k in values) {
            body.append(k, values[k]);
          }
          console.log(body);
        }, 1000);
      })}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        /* and other goodies */
      }) => (
        <form onSubmit={handleSubmit}>
          {`回应: ${values.resto}`}
          <input
            type="name"
            name="name"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.name}
          />
          <input
            type="email"
            name="email"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.email}
          />
          <textarea
            type="content"
            name="content"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.content}
          />
          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </form>
        )}
    </Formik>);

  return (
    <div className="post-view">
      <div className="postform">
        {postForm}
        <ToolBar />
      </div>
      {/* <div
          className="forum-message"
          dangerouslySetInnerHTML={{ __html:  }}
        /> */}
    </div>
  )
}

function ToolBar(props) {
  return null;
}

export { PostView };