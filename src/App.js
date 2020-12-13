import US from './pages/US'
import World from './pages/World'
import Landing from './pages/Landing';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';



function App() {
  return (
    <Router>
      <Switch>
        <Route component={Landing} exact path='/'/>
        <Route component={US} exact path ='/US'/>
        <Route component={World} exact path='/World'/>
      </Switch>
    </Router>
  );
}

export default App;
