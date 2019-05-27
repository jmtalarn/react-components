import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import "./StepForm.css";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import Select, { components } from "react-select";
import countryList from "../data/countryCodes.json";

import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

const countryOptions = countryList.map(c => {
  return {
    value: c.code,
    label: `${c.name} (${c.dial_code})`,
    code: c.dial_code,
  };
});
const SingleValue = ({ children, ...props }) => (
  <components.SingleValue className="label" {...props}>
    {`+${
      children.split("+").length > 1
        ? children.split("+")[1].replace(")", " ")
        : ""
    }`}
  </components.SingleValue>
);
class StepForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tac: false,
      shown: 1,
      sent: false,
      fields: props.fields.reduce(
        (acc, curr) => ({ ...acc, [curr.key]: !!curr.value ? curr.value : "" }),
        {},
      ),
      errors: props.fields.reduce(
        (acc, curr) => ({ ...acc, [curr.key]: false }),
        {},
      ),
      isRequired: props.fields.reduce(
        (acc, curr) => ({
          ...acc,
          [curr.key]: curr.required === "false" ? false : true,
        }),
        {},
      ),
      types: props.fields.reduce(
        (acc, curr) => ({ ...acc, [curr.key]: curr.type }),
        {},
      ),
      done: props.fields.reduce(
        (acc, curr) => ({ ...acc, [curr.key]: false }),
        {},
      ),
      showCross: props.fields.reduce(
        (acc, curr) => ({ ...acc, [curr.key]: false }),
        {},
      ),
      length: props.fields.reduce(
        (acc, curr) => ({ ...acc, [curr.key]: curr.length || Infinity }),
        {},
      ),
      sendImmediate: props.fields.reduce(
        (acc, curr) => ({
          ...acc,
          [curr.key]:
            !!curr.immediate && curr.immediate.toLowerCase() === "true"
              ? true
              : false,
        }),
        {},
      ),
      country: null,
      custom: {
        dob: {
          date: "",
          month: "",
          year: "",
        },
      },
    };
    // event Binding
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.checkValid = this.checkValid.bind(this);
    this.checkFilled = this.checkFilled.bind(this);
    this.changeTac = this.changeTac.bind(this);
  }

  changeTac() {
    this.setState({
      tac: !this.state.tac,
    });
  }

  componentDidMount() {
    if (Array.isArray(this.props.fields)) {
      this.props.fields.forEach(field => {
        if (field.key === "dob" && field.value) {
          let date = field.value.split("/");
          if (date.length) {
            let newDob = { date: date[0], month: date[1], year: date[2] };
            this.setState({ custom: { ...this.state.custom, dob: newDob } });
          }
        } else if (field.type === "contact_num") {
          if (field.country) {
            let selectedCountry = countryOptions.filter(
              x => x.value === field.country.toUpperCase(),
            );
            this.setState({
              country:
                selectedCountry.length > 0
                  ? selectedCountry[0]
                  : countryOptions[0],
            });
          }
        }
      }, this);
    }
  }

  getDate() {
    const today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;
    return dd + "/" + mm + "/" + yyyy;
  }

  validateDate(dateString) {
    if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) return false;
    const parts = dateString.split("/");
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    const curDate = new Date();
    const curYear = parseInt(curDate.getFullYear(), 10);
    const curMonth = parseInt(curDate.getMonth() + 1, 10);
    const curDay = parseInt(curDate.getDate(), 10);
    if (
      year < 1000 ||
      year > curYear ||
      (year === curYear && month > curMonth) ||
      (year === curYear && month === curMonth && day > curDay) ||
      month === 0 ||
      month > 12
    )
      return false;
    let monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0))
      monthLength[1] = 29;
    return day > 0 && day <= monthLength[month - 1];
  }

  validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  validateName(Name) {
    return /^[a-z ,.'-]+(\s)[a-z ,.'-]+$/i.test(Name);
  }

  validateForm() {
    let errors = { ...this.state.errors };
    let showCross = { ...this.state.showCross };
    Object.keys(this.state.fields).forEach(key => {
      if (this.state.fields[key] !== "") {
        switch (this.state.types[key]) {
          case "email":
            if (!this.validateEmail(this.state.fields[key]))
              errors = { ...errors, [key]: true };
            else {
              showCross = { ...showCross, [key]: false };
              errors = { ...errors, [key]: false };
            }
            break;
          case "dob":
            if (!this.validateDate(this.state.fields[key]))
              errors = { ...errors, [key]: true };
            else {
              showCross = { ...showCross, [key]: false };
              errors = { ...errors, [key]: false };
            }
            break;
          case "contact_num":
            if (
              this.state.fields[key] &&
              isValidPhoneNumber(this.state.fields[key])
                ? true
                : false
            ) {
              showCross = { ...showCross, [key]: false };
              errors = { ...errors, [key]: false };
            } else {
              errors = { ...errors, [key]: true };
              this.setState({ done: { ...this.state.done, [key]: false } });
            }
            break;
          case "password":
          case "text":
            if (["patient_name", "patientName"].includes(key)) {
              if (this.validateName(this.state.fields[key])) {
                showCross = { ...showCross, [key]: false };
                errors = { ...errors, [key]: false };
              } else {
                errors = { ...errors, [key]: true };
              }
            } else if (this.state.fields[key] !== "")
              showCross = { ...showCross, [key]: false };
            break;
          default:
            break;
        }
      }
    });
    this.setState({ errors, showCross });
  }

  checkValid() {
    let valid = true;
    const keys = Object.keys(this.state.errors);
    for (let i = 0; i < keys.length; i++)
      if (this.state.errors[keys[i]]) valid = false;

    return valid;
  }

  findComponenetControl(querySelector) {
    let domNode = ReactDOM.findDOMNode(this);
    return domNode.querySelector(querySelector);
  }

  checkFilled() {
    let filled = true;
    const keys = Object.keys(this.state.errors);
    for (let i = 0; i < this.state.shown; i++)
      if (this.state.fields[keys[i]] === "") filled = false;
    return filled;
  }

  handleChange(e) {
    if (!this.state.sent) {
      if (
        !["dob", "contact_num"].includes(this.state.types[e.target.name]) ||
        !isNaN(e.target.value)
      ) {
        if (this.state.types[e.target.name] === "dob") {
          if (e.target.placeholder === "DD") {
            this.setState(
              {
                custom: {
                  ...this.state.custom,
                  dob: { ...this.state.custom.dob, date: e.target.value },
                },
                fields: {
                  ...this.state.fields,
                  [e.target.name]:
                    e.target.value +
                    "/" +
                    this.state.custom.dob.month +
                    "/" +
                    this.state.custom.dob.year,
                },
              },
              _ => this.validateForm(),
            );

            if (e.target.value.length > 1) {
              this.findComponenetControl("input[placeholder=MM]").focus();
            }
          }
          if (e.target.placeholder === "MM") {
            this.setState(
              {
                custom: {
                  ...this.state.custom,
                  dob: { ...this.state.custom.dob, month: e.target.value },
                },
                fields: {
                  ...this.state.fields,
                  [e.target.name]:
                    this.state.custom.dob.date +
                    "/" +
                    e.target.value +
                    "/" +
                    this.state.custom.dob.year,
                },
              },
              _ => this.validateForm(),
            );

            if (e.target.value.length > 1) {
              this.findComponenetControl("input[placeholder=YYYY]").focus();
            }
          }
          if (e.target.placeholder === "YYYY")
            this.setState(
              {
                custom: {
                  ...this.state.custom,
                  dob: { ...this.state.custom.dob, year: e.target.value },
                },
                fields: {
                  ...this.state.fields,
                  [e.target.name]:
                    this.state.custom.dob.date +
                    "/" +
                    this.state.custom.dob.month +
                    "/" +
                    e.target.value,
                },
              },
              () => {
                this.validateForm();
              },
            );
        } else if (e.target.value.length <= this.state.length[e.target.name])
          this.setState(
            {
              fields: {
                ...this.state.fields,
                [e.target.name]:
                  !!e.target.value &&
                  [
                    "patient_email",
                    "mobile_no",
                    "mobileNo",
                    "emailId",
                  ].includes(e.target.name) &&
                  typeof e.target.value === "string"
                    ? e.target.value.trim()
                    : ["patient_name", "patientName"].includes(e.target.name) &&
                      typeof e.target.value === "string"
                    ? e.target.value.toProperCase()
                    : e.target.value,
              },
            },
            () => this.validateForm(),
          );
        this.setState({ done: { ...this.state.done, [e.target.name]: false } });
      }
    }
  }

  handleClick(key) {
    if (!this.state.sent) {
      if (!this.state.errors[key] && this.state.fields[key] !== "")
        this.setState({
          done: { ...this.state.done, [key]: true },
          showCross: { ...this.state.showCross, [key]: false },
        });
      else
        this.setState({ showCross: { ...this.state.showCross, [key]: true } });
      if (
        this.checkValid() &&
        ((!this.checkFilled() && !this.state.isRequired[key]) ||
          this.checkFilled())
      ) {
        if (this.state.sendImmediate[key]) {
          this.props.sendTextMessage({ [key]: this.state.fields[key] });
          this.setState({ shown: this.state.shown + 1 });
        } else {
          if (this.state.shown < Object.keys(this.state.fields).length)
            this.setState({ shown: this.state.shown + 1 }, () => {
              this.props.scrollBottom();
            });
          else {
            this.props.sendTextMessage({
              ...this.state.fields,
              country: this.state.country,
            });
            this.setState({ sent: true });
          }
        }
      }
    }
  }

  handleKeyPress(e) {
    if (
      e.key === "Enter" &&
      this.state.types[e.target.name] !== "longtext" &&
      this.state.fields[e.target.name] &&
      !this.state.sent
    ) {
      this.handleClick(e.target.name);
    }
  }

  setErrorMessage = msg => {
    this.setState({
      err_msg: msg,
    });
  };

  render() {
    return (
      <div className="pk-step-form-container">
        <div
          className={`pk-step-form-card ${this.state.sent &&
            "pk-step-form-sent"}`}
          style={{ position: "relative" }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              backgroundColor: this.state.sent
                ? "#4EC794"
                : this.props.primaryColor,
              height: 5,
              width: this.state.sent
                ? "100%"
                : `calc(100% / ${this.props.fields.length} * ${this.state
                    .shown - 1})`,
              transition: "width 0.2s ease-in-out",
            }}
          />
          <div
            style={{
              paddingBottom: "10px",
              fontSize: "14px",
            }}
          >
            ( {this.state.shown} / {this.props.fields.length} )
          </div>
          {(this.props.step
            ? this.props.fields.slice(0, this.state.shown)
            : this.props.fields
          ).map(field => (
            <Fragment>
              {["dob"].includes(field.type) && (
                <div className="pk-step-form-field-title">
                  {field.placeholder}
                </div>
              )}
              <div className="pk-step-form-field">
                {field.type === "email" ? (
                  <input
                    autoFocus={true}
                    className={`pk-step-form-input ${this.state.showCross[
                      field.key
                    ] && "pk-step-form-error"}`}
                    name={field.key}
                    value={this.state.fields[field.key]}
                    onChange={this.handleChange}
                    onKeyPress={this.handleKeyPress}
                    type="text"
                    placeholder={field.placeholder}
                  />
                ) : field.type === "text" ? (
                  <div style={{ width: "100%" }}>
                    <input
                      autoFocus={true}
                      style={{ width: "100%" }}
                      className={`pk-step-form-input ${this.state.showCross[
                        field.key
                      ] && "pk-step-form-error"}`}
                      name={field.key}
                      value={this.state.fields[field.key]}
                      onChange={this.handleChange}
                      onKeyPress={this.handleKeyPress}
                      type="text"
                      placeholder={field.placeholder}
                    />
                    {["patient_name", "patientName"].includes(field.key) &&
                      this.state.showCross[field.key] && (
                        <div style={{ marginTop: "-7px" }}>
                          <small style={{ color: "red" }}>
                            Enter full name
                          </small>
                        </div>
                      )}
                  </div>
                ) : field.type === "dob" ? (
                  <div className="pk-step-form-date-container">
                    <input
                      autoComplete={false}
                      autoFocus={true}
                      className={`pk-step-form-input pk-step-form-date ${this
                        .state.showCross[field.key] && "pk-step-form-error"}`}
                      name={field.key}
                      value={this.state.custom.dob.date}
                      onChange={this.handleChange}
                      onKeyPress={this.handleKeyPress}
                      type="text"
                      placeholder={"DD"}
                    />{" "}
                    <span className="pk-step-form-date-seperator">/</span>
                    <input
                      autoComplete={false}
                      className={`pk-step-form-input pk-step-form-date ${this
                        .state.showCross[field.key] && "pk-step-form-error"}`}
                      name={field.key}
                      value={this.state.custom.dob.month}
                      onChange={this.handleChange}
                      onKeyPress={this.handleKeyPress}
                      type="text"
                      placeholder={"MM"}
                    />{" "}
                    <span className="pk-step-form-date-seperator">/</span>
                    <input
                      autoComplete={false}
                      className={`pk-step-form-input pk-step-form-date ${this
                        .state.showCross[field.key] && "pk-step-form-error"}`}
                      name={field.key}
                      value={this.state.custom.dob.year}
                      onChange={this.handleChange}
                      onKeyPress={this.handleKeyPress}
                      type="text"
                      placeholder={"YYYY"}
                    />{" "}
                    <span className="pk-step-form-date-seperator" />
                  </div>
                ) : field.type === "contact_num" ? (
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      paddingTop: "5px",
                    }}
                    className="pk-step-form-input"
                  >
                    {/* <div
                       className={`pk-step-form-input pk-step-form-select ${this
                        .state.showCross[field.key] && "pk-step-form-error"}`}
                        style={{width: "75px"}}
                    >
                    <SelectField
                      multiple={
                        !!field.multiple &&
                          field.multiple.toLowerCase() === "true"
                          ? true
                          : false
                      }
                      value={this.state.country}
                      style={{
                        fontFamily: "'Muli', sans-serif",
                        height: 37,
                        boxShadow: "0 0 1px 1px rgba(0, 0, 0, 0,3)"
                      }}
                      menuStyle={{
                        zIndex: 20004444444444444444444444,
                        transform: "translateY(-14px)"
                      }}
                      maxHeight={250}
                      isDisabled={
                        !!field.disable_country &&
                        field.disable_country.toString().toLowerCase() === "true"
                      }
                      onChange={(e,i,val) => {
                        this.setState({ country: val });
                      }}
                    >
                       {countryOptions.map((val, i) => (
                        <MenuItem
                          key={i}
                          value={val}
                          primaryText={val.code}
                          style={{ fontFamily: "'Muli', sans-serif" }}
                        >
                          {val.label.split(" ")[0] + "-"}
                        </MenuItem>
                      ))}
                    </SelectField>
                    </div> */}

                    {/* <div>
                    <Select
                      styles={{
                        singleValue: base => ({
                          ...base,
                          fontFamily: '"Muli", sans-serif',
                          fontSize: "14px"
                        })
                      }}
                      dropDownMenuProps={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                      }}
                      menuContainerStyle={{ 
                        zIndex: 999999
                      }}
                      maxHeight={50}
                      placeholder=""
                      value={this.state.country}
                      isDisabled={
                        !!field.disable_country &&
                        field.disable_country.toString().toLowerCase() === "true"
                      }
                      onChange={e => {
                        this.setState({ country: e })}}
                      options={countryOptions}
                      components={{ SingleValue }}
                    />
                    </div> */}

                    <div className="pk-phone-number-input">
                      <PhoneInput
                        autoFocus={field.country ? true : false}
                        placeholder="Enter phone number"
                        value={this.state.fields[field.key]}
                        name={field.key}
                        country={field.country}
                        onKeyPress={this.handleKeyPress}
                        onChange={value => {
                          this.setState(
                            {
                              ...this.state,
                              fields: {
                                ...this.state.fields,
                                [field.key]: value,
                              },
                            },
                            () => {
                              this.validateForm();
                            },
                          );
                        }}
                        onKeyDown={e => {
                          if (e.keyCode == 13) {
                            console.log("enter");

                            this.handleClick(e.target.name);
                          }
                        }}
                      />
                    </div>

                    {/* <div
                    style={{
                      width: '100%'
                    }}
                    >
                    <input
                      style={{
                        width: '100%'
                      }}
                      autoFocus={true}
                      className={`pk-step-form-input ${
                        this.state.showCross[field.key]
                        && "pk-step-form-error"}`}
                      name={field.key}
                      value={this.state.fields[field.key]}
                      onChange={this.handleChange}
                      onKeyPress={this.handleKeyPress}
                      type="text"
                      maxLength="10"
                      placeholder={field.placeholder}
                    />
                    </div> */}
                    <style>
                      {`.css-1rtrksz{ 
                            height: 40px; 
                          } 
                          .css-1aya2g8,
                          .css-162g8z5,
                          .css-2o5izw{ 
                            height: 40px; 
                            border: 1px solid #ccc !important; 
                          }
                          .css-15k3avv{
                            width: 200px !important;
                          }
                          .css-11unzgr{
                            max-height: 200px;
                          }`}
                    </style>
                  </div>
                ) : field.type === "longtext" ? (
                  <textarea
                    autoFocus={true}
                    className={`pk-step-form-input pk-step-form-textarea ${this
                      .state.showCross[field.key] && "pk-step-form-error"}`}
                    name={field.key}
                    value={this.state.fields[field.key]}
                    onChange={this.handleChange}
                    onKeyPress={this.handleKeyPress}
                    type="text"
                    placeholder={field.placeholder}
                  />
                ) : field.type === "dropdown" ? (
                  <div
                    className={`pk-step-form-input pk-step-form-select ${this
                      .state.showCross[field.key] && "pk-step-form-error"}`}
                  >
                    <SelectField
                      multiple={
                        !!field.multiple &&
                        field.multiple.toLowerCase() === "true"
                          ? true
                          : false
                      }
                      hintText={field.placeholder}
                      value={this.state.fields[field.key]}
                      style={{
                        fontFamily: "'Muli', sans-serif",
                        height: 37,
                        boxShadow: "0 0 1px 1px rgba(0, 0, 0, 0,3)",
                      }}
                      menuStyle={{
                        zIndex: 20004444444444444444444444,
                        transform: "translateY(-14px)",
                      }}
                      maxHeight={250}
                      onChange={(e, i, val) => {
                        this.setState(
                          {
                            fields: {
                              ...this.state.fields,
                              [field.key]: val,
                            },
                          },
                          () => {
                            this.handleClick(field.key);
                          },
                        );
                      }}
                    >
                      {field.options.map((val, i) => (
                        <MenuItem
                          key={i}
                          value={val}
                          primaryText={val}
                          style={{ fontFamily: "'Muli', sans-serif" }}
                          checked={
                            !!field.multiple &&
                            field.multiple.toLowerCase() === "true" &&
                            this.state.fields[field.key].indexOf(val) > -1
                          }
                        />
                      ))}
                    </SelectField>
                  </div>
                ) : field.type === "password" ? (
                  <input
                    autoFocus={true}
                    className={`pk-step-form-input ${this.state.showCross[
                      field.key
                    ] && "pk-step-form-error"}`}
                    name={field.key}
                    value={this.state.fields[field.key]}
                    onChange={this.handleChange}
                    onKeyPress={this.handleKeyPress}
                    type="password"
                    placeholder={field.placeholder}
                  />
                ) : (
                  <input
                    autoFocus={true}
                    className={`pk-step-form-input ${this.state.showCross[
                      field.key
                    ] && "pk-step-form-error"}`}
                    name={field.key}
                    value={this.state.fields[field.key]}
                    onChange={this.handleChange}
                    onKeyPress={this.handleKeyPress}
                    type={field.type}
                    placeholder={field.placeholder}
                  />
                )}
                {
                  <button
                    className={`pk-step-form-button ${field.type ===
                      "longtext" && "pk-step-form-textarea-button"} ${
                      this.state.showCross[field.key]
                        ? "pk-step-form-cross"
                        : this.state.done[field.key]
                        ? "pk-step-form-check"
                        : "pk-step-form-chevron"
                    }`}
                    style={{
                      ...(this.state.showCross[field.key]
                        ? { backgroundColor: "#DC4340" }
                        : this.state.done[field.key]
                        ? { backgroundColor: "#4EC794" }
                        : {
                            backgroundColor: this.props.primaryColor,
                            cursor: "pointer",
                          }),
                    }}
                    onClick={
                      this.state.done[field.key]
                        ? this.state.tac
                          ? this.state.done[field.key]
                            ? () => {}
                            : () => {
                                this.handleClick(field.key);
                              }
                          : () => {
                              this.setErrorMessage(
                                "Please agree terms and condition",
                              );
                            }
                        : () => {
                            this.handleClick(field.key);
                          }
                    }
                  >
                    <div className="pk-step-form-button-bar" />
                    <div className="pk-step-form-button-bar" />
                  </button>
                }
              </div>
              {field.type === "dob" && field.tnc && (
                <div style={{ display: "flex" }}>
                  <input
                    id="tac"
                    name="tac"
                    type="checkbox"
                    checked={this.state.tac}
                    onClick={this.changeTac}
                  />
                  <label htmlFor="tac">
                    I Agree{" "}
                    <span
                      className="hyperlink"
                      onClick={_ => this.props.openWebview(field.tnc)}
                    >
                      terms and condition
                    </span>
                  </label>
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    );
  }
}

export default StepForm;
