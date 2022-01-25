import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { GameRoom } from './components/Game/GameRoom'
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
