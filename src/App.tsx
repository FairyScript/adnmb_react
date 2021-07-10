import { css, Global } from '@emotion/react'
import { useEffect } from 'react'
import { Route, BrowserRouter, Switch, Redirect } from 'react-router-dom'
import { getForumList } from './api/api'
import NotFoundPage from './views/404Page'
import MainView from './views/MainView'
import WelcomePage from './views/WelcomePage'

const App: React.FC = () => {

  return (
    <BrowserRouter>
      <Global styles={css`
        html,body {
          margin: 0;
        }
      `} />
      <Switch>
        <Route exact path="/">
          <Redirect to="/Forum" />
        </Route>
        <Route exact path="/Forum" >
          <WelcomePage />
        </Route>
        <Route path="/:type/:id" >
          <MainView />
        </Route>
        <Route>
          <NotFoundPage />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}

export default App