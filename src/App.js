import React from "react";
import Home from "./Home";
import StepForm from "./stepform_component/StepForm";
import stepformContent from "./stepform_component/stepform2.json";
import Nav from "./navigation";
import { BrowserRouter as Router, Route } from "react-router-dom";

const fields = stepformContent.attachment.payload.fields;

export default props => {
  return (
    <Router>
      <Nav />

      <Route path="/" exact component={Home} />
      <Route
        path="/stepform"
        exact
        render={() => (
          <StepForm
            fields={fields}
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
  );
};
