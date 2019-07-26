import React, { Fragment } from 'react';
import './App.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
// import NotFound from './components/Auth/NotFound';

const App = () => {
  return (
    <Router>
      <Fragment>
        <Navbar />
        <Route exact path="/" component={Landing} />
        <section className="container">
          <Switch>
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            {/* <Route exact path="/not-found" component={NotFound} />
            <Redirect to="/not-found" /> */}
          </Switch>
        </section>
      </Fragment>
    </Router>
  );
};

export default App;
