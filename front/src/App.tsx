import React, { Component } from 'react';
import './App.scss';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Header from './components/Header'
import Mails from './Mails';
import Mail from './Mail';
import Tokens from './Tokens';
import Domains from './Domains';
import Actions from './Actions';

export default class App extends Component {
  render() {
    return (
      <Router>
        <Header/>
        <Switch>
          <Route exact path="/" >
            <Redirect to="/mails" />
          </Route>
          <Route path="/mails" component={Mails} />
          <Route path="/mail/:id" component={Mail} />
          <Route path="/tokens" component={Tokens} />
          <Route path="/domains" component={Domains} />
          <Route path="/actions" component={Actions} />
        </Switch>
      </Router>
    )
  }
}
