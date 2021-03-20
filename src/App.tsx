import { Route, BrowserRouter, Switch, Redirect } from 'react-router-dom'
import NotFoundPage from './views/404Page'
import MainView from './views/MainView'
import WelcomePage from './views/WelcomePage'

const App: React.FC = () => {
  return (
    <BrowserRouter>
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