import Main from './pages/Main'
import World from './pages/World'

import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';


function App() {
  return (
    <Router>
      <Switch>
        <Route component={Main} exact path='/'/>
        <Route component={World} exact path='/World'/>
      </Switch>
    </Router>
  );
}

export default App;
