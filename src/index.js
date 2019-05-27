import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

String.prototype.toProperCase = function(opt_lowerCaseTheRest) {
  return (opt_lowerCaseTheRest ? this.toLowerCase() : this).replace(
    /(^|[\s\xA0])[^\s\xA0]/g,
    function(s) {
      return s.toUpperCase();
    },
  );
};

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
