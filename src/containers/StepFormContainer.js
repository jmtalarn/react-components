import { connect } from "react-redux";
import StepForm from "../stepform_component/StepForm";
export default connect(
  (state, props) => ({
    fields: state.fields,
  }),
  null,
)(StepForm);
