import React from "react";
import Home from "./Home";
import StepForm from "./stepform_component/StepForm";
import stepformContent from "./stepform_component/stepform2.json";
import { BrowserRouter as Router, Route } from "react-router-dom";

const fields = stepformContent.attachment.payload.fields;

export default props => {
  return (
    <Router>
      <Route path="/" exact component={Home} />
      <Route
        path="/stepform"
        exact
        render={() => <StepForm fields={fields} />}
      />
    </Router>
  );
};
