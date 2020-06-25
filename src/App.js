import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import Home from './components/Home';
import About from './components/About';
import Navbar from './components/Navbar';
import AllBooks from './components/AllBooks';
import Operations from './components/Operations';
import { Login } from './components/Login/index';
import OperationUser from './components/Operations/User';

const BookContent = React.lazy(() => import('./components/BookContent'));

function App() {
  const LoginContainer = () => (
    <div>
      <Route exact path="/" component={Login} />
    </div>
  )

  const DefaultContainer = () => (
    <div>
      <div>
        <Navbar />
        <Route path="/home" exact component={Home} />
        <Route path="/books" exact component={AllBooks} />
        <Route path="/books/:BookId" exact component={BookContent} />
        <Route path="/operations" exact component={Operations} />
        <Route path="/operations/user" exact component={OperationUser} />
        <Route path="/about" exact component={About} />
      </div>
    </div>
  )

  return (
    <div>
      <Router>
        <React.Suspense fallback={"loading  ....."}>
          <Switch>
            <Route exact path="/" component={LoginContainer} />
            <Route component={DefaultContainer} />
          </Switch>
        </React.Suspense>
      </Router>
      {/* <Router>
        <Navbar />
        <React.Suspense fallback={"loading  ....."}>
          <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/home" exact component={Home} />
            <Route path="/books" exact component={AllBooks} />
            <Route path="/books/:BookId" exact component={BookContent} />
            <Route path="/operations" exact component={Operations} />
            <Route path="/about" exact component={About} />
          </Switch>
        </React.Suspense>
      </Router> */}
    </div>
  );
}

export default App;
