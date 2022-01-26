import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { LobbyPage, RoomPage } from './pages'

function App() {
  return (
    <Router>
      <RecoilRoot>
        <Switch>
          <Route exact path='/' component={LobbyPage} />
          <Route path='/room/:roomId' component={RoomPage} />
        </Switch>
      </RecoilRoot>
    </Router>
  )
}

export default App
