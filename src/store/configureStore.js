import { createStore, applyMiddleware } from "redux";
import rootReducer from "../reducers/rootReducer";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";
import createCLILogger from "redux-cli-logger";

const logger =
  process.env.NODE_ENV === "test" ? createCLILogger({}) : createLogger();

export default function configureStore() {
  return createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(thunk, logger),
  );
}
