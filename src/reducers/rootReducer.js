import { combineReducers } from "redux";
import fields from "./fieldsReducer";

const rootReducer = combineReducers({
  fields,
});

export default rootReducer;
