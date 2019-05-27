import React from "react";
import Home from "./Home";
import StepForm from "./containers/StepFormContainer";

import Nav from "./navigation";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "./store/configureStore";

const store = configureStore();

export default props => {
  return (
    <Provider store={store}>
      <Router basename="/react-components">
        <Nav />

        <Route path="/" exact component={Home} />
        <Route
          path="/stepform"
          exact
          render={() => (
            <StepForm
              primaryColor="darkblue"
              step={true}
              scrollBottom={() => {
                window.scrollTo(0, document.body.scrollHeight);
              }}
              sendTextMessage={message => {
                alert(JSON.stringify(message));
              }}
            />
          )}
        />
      </Router>
    </Provider>
  );
};
