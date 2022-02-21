import React, { FC } from 'react';
import { HomePage, ClassificationPage, ResultsPage } from './pages';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import './App.css';

export const App: FC = () => {
  return (
    <Router>
        <Switch>
          <Route path="/" exact>
            <HomePage />
          </Route>
          <Route path="/classify" exact>
            <ClassificationPage/>
          </Route>
          <Route path="/results/:classificationId" exact>
            <ResultsPage/>
          </Route>
          <Route>
            Not Found :-P
          </Route>
        </Switch>
    </Router>
  )
}

export default App;
