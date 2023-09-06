import React, { Component } from "react";
import "./SignUp.scss";
import { AuthenticationDataServices } from "../../services/AuthenticationDataServices";
import AirplaneLogo from "./../../asserts/logo1.jpg";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import FlightTakeoffIcon from "@material-ui/icons/FlightTakeoff";

export default class SignUp extends Component {
  constructor() {
    super();
    this.state = {
      FirstName: "",
      LastName: "",
      SignInEmail: "",
      SignUpEmail: "",
      SignInPassword: "",
      SignUpPassword: "",
      SignUpConfirmPassword: "",
      MasterPassword: "",
      Role: "customer",
      FlightCompany: "",

      FirstNameFlag: false,
      LastNameFlag: false,
      SignInEmailFlag: false,
      SignUpEmailFlag: false,
      SignInPasswordFlag: false,
      SignUpPasswordFlag: false,
      SignUpConfirmPasswordFlag: false,
      MasterPasswordFlag: false,
      FlightCompanyFlag: false,

      OpenLoader: false,
      OpenSnackBar: false,
      Message: "",
    };
  }

  ClearState = () => {
    console.log("Clear States Calling....");
    this.setState({
      FirstName: "",
      LastName: "",
      SignInEmail: "",
      SignUpEmail: "",
      SignInPassword: "",
      SignUpPassword: "",
      SignUpConfirmPassword: "",
      MasterPassword: "",
      FlightCompany: "",

      FirstNameFlag: false,
      LastNameFlag: false,
      SignInEmailFlag: false,
      SignUpEmailFlag: false,
      SignInPasswordFlag: false,
      SignUpPasswordFlag: false,
      SignUpConfirmPasswordFlag: false,
      MasterPasswordFlag: false,
      FlightCompanyFlag: false,
    });
  };

  handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ OpenSnackBar: false });
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
    console.log("Name : ", name, " Value : ", value);
  };

  CheckValidity = (operation) => {
    let state = this.state;
    let Value = true;
    this.setState({
      FirstNameFlag: false,
      LastNameFlag: false,
      SignInEmailFlag: false,
      SignUpEmailFlag: false,
      SignInPasswordFlag: false,
      SignUpPasswordFlag: false,
      SignUpConfirmPasswordFlag: false,
      MasterPasswordFlag: false,
      FlightCompanyFlag: false,
    });

    if (operation === "signup") {
      const nameRegex = /^[A-Za-z]+$/;

      if (!nameRegex.test(state.FirstName)) {
        this.setState({ FirstNameFlag: true });
        Value = false;
      }

      if (!nameRegex.test(state.LastName)) {
        this.setState({ LastNameFlag: true });
        Value = false;
      }

      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

      if (!emailRegex.test(state.SignUpEmail)) {
        this.setState({ SignUpEmailFlag: true });
        Value = false;
      }

      //const passwordRegex = /^(?=.*[A-Za-z0-9])(?=.*\d)[A-Za-z\d]{8,}$/;
      const passwordRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

      if (!passwordRegex.test(state.SignUpPassword)) {
        this.setState({ SignUpPasswordFlag: true });
        Value = false;
      }

      if (state.SignUpConfirmPassword !== state.SignUpPassword) {
        this.setState({
          SignUpConfirmPasswordFlag: true,
        });
        Value = false;
      }

      if (state.Role !== "customer" && state.MasterPassword === "") {
        this.setState({ MasterPasswordFlag: true });
        Value = false;
      }
      debugger;
      if (state.Role === "vendor" && state.FlightCompany === "") {
        this.setState({ FlightCompanyFlag: true });
        Value = false;
      }
    } else {
      //SignIn
      if (state.SignInEmail === "") {
        this.setState({ SignInEmailFlag: true });
        Value = false;
      }

      if (state.SignInPassword === "") {
        this.setState({ SignInPasswordFlag: true });
        Value = false;
      }
    }

    return Value;
  };

  handleSignUpSubmit = (e) => {
    let state = this.state;

    if (this.CheckValidity("signup")) {
      if (state.SignUpConfirmPassword !== state.SignUpPassword) {
        this.setState({
          OpenSnackBar: true,
          Message: "Password And Confirm Password Not Match",
        });
        return;
      }
      this.setState({ OpenLoader: true });
      let data = {
        firstName: state.FirstName,
        lastName: state.LastName,
        email: state.SignUpEmail,
        password: state.SignUpPassword,
        role: state.Role,
        masterPassword: state.MasterPassword,
        flightCompany: state.FlightCompany.trim(),
      };

      AuthenticationDataServices.SignUp(data)
        .then((data) => {
          console.log("Data : ", data);
          if (data.isSuccess) {
            this.ClearState();
          }
          this.setState({
            OpenSnackBar: true,
            Message: data.message,
            OpenLoader: false,
          });
        })
        .catch((error) => {
          console.log("Error : ", error);
          this.setState({
            OpenSnackBar: true,
            Message: "Something went wrong",
            OpenLoader: false,
          });
        });
    } else {
      this.setState({
        OpenSnackBar: true,
        Message: "Please Enter Required Field",
      });
    }
  };

  handleSignInSubmit = (e) => {
    let state = this.state;
    if (this.CheckValidity("signin")) {
      this.setState({ OpenLoader: true });
      let data = {
        email: state.SignInEmail,
        password: state.SignInPassword,
      };

      AuthenticationDataServices.SignIn(data)
        .then((data) => {
          console.log("Data : ", data);
          this.setState({
            OpenSnackBar: true,
            Message: data.message,
            OpenLoader: false,
          });
          if (data.isSuccess) {
            this.ClearState();
            // debugger;
            if (data.data.role === "customer") {
              localStorage.setItem("CustomerToken", data.token);
              localStorage.setItem("CustomerID", data.data.userID);
              localStorage.setItem("CustomerFullName", data.data.fullName);
              localStorage.setItem("CustomerEmail", data.data.email);
              //
              localStorage.setItem("CMenuHome", true);
              localStorage.setItem("CMenuTourPackages", false);
              localStorage.setItem("CMenuMyPackages", false);
              localStorage.setItem("CMenuMyTour", false);
              //
              window.location = "/CustomerDashboard";
              //
            } else if (data.data.role === "admin") {
              debugger;
              console.log(
                "Vendor Token : " + localStorage.getItem("VendorToken")
              );

              localStorage.setItem("VendorToken", data.token);
              localStorage.setItem("AdminToken", data.token);
              localStorage.setItem("AdminID", data.data.userID);
              localStorage.setItem("AdminFullName", data.data.fullName);
              localStorage.setItem("AdminEmail", data.data.email);
              //
              localStorage.setItem("AMenuHome", true);
              localStorage.setItem("AMenuTourPack", false);
              localStorage.setItem("AMenuPackage", false);
              localStorage.setItem("AMenuComplaints", false);
              localStorage.setItem("AMenuFeedback", false);
              localStorage.setItem("AMenuRequestPackages", false);
              //
              window.location = "/AdminDashboard";
            } else if (data.data.role === "vendor") {
              localStorage.setItem("VendorToken", data.token);
              localStorage.setItem("VendorID", data.data.userID);
              localStorage.setItem("VendorFullName", data.data.fullName);
              localStorage.setItem("VendorEmail", data.data.email);
              localStorage.setItem(
                "VendorFlightCompany",
                data.data.flightCompany
              );
              //FlightCompany
              localStorage.setItem("TMenuHome", true);
              localStorage.setItem("TMenuActiveComplaints", false);
              localStorage.setItem("TMenuHistory", false);
              //
              window.location = "/VendorDashboard";
            }
          }
        })
        .catch((error) => {
          console.log("Error : ", error);
          this.setState({
            OpenSnackBar: true,
            Message: "Error Occur",
            OpenLoader: false,
          });
        });
    } else {
      this.setState({
        OpenSnackBar: true,
        Message: "Please Enter Required Field",
      });
    }
  };

  render() {
    let state = this.state;
    return (
      <div className="SignUp-Container">
        <div className="SignUp-SubContainer">
          <div className="Header">
            <AppBar position="static" style={{ backgroundColor: "#202020" }}>
              <Toolbar>
                <Typography
                  variant="h6"
                  style={{
                    flexGrow: 3,
                    display: "flex",
                    padding: "5px 0 0 200px",
                    boxSizing: "border-box",
                  }}>
                  Sky-Bright Tours & Travels &nbsp;
                  <div style={{ margin: "3px 0 0 0" }}>
                    <FlightTakeoffIcon />
                  </div>
                </Typography>
                <TextField
                  error={state.SignInEmailFlag}
                  className="TextField"
                  placeholder="Email"
                  name="SignInEmail"
                  variant="outlined"
                  size="small"
                  style={{
                    margin: "10px 10px",
                    width: 200,
                  }}
                  value={state.SignInEmail}
                  onChange={this.handleChange}
                />
                <TextField
                  error={state.SignInPasswordFlag}
                  className="TextField"
                  placeholder="Password"
                  variant="outlined"
                  type="password"
                  name="SignInPassword"
                  size="small"
                  style={{
                    margin: "10px 0px",
                    width: 200,
                  }}
                  value={state.SignInPassword}
                  onChange={this.handleChange}
                />
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "#00137F",
                    width: 100,
                    margin: "10px 10px",
                    color: "white",
                  }}
                  onClick={() => {
                    this.handleSignInSubmit();
                  }}>
                  Sign In
                </Button>
              </Toolbar>
            </AppBar>
          </div>
          <div className="Body">
            <div className="Sub-Body1">
              <div className="Sub-Sub-Body1">
                <div className="Sub-Sub-Body1-Header">
                  Make Your Tours A Memorable One.
                </div>
                <div className="Sub-Sub-Body1-Image">
                  <img
                    src={AirplaneLogo}
                    alt="Home Icon"
                    className="HomeImage"
                  />
                </div>
              </div>
              <div className="Sub-Sub-Body2">
                <div className="Sub-Sub-Body2-Header">Sign Up</div>
                <div className="Sub-Sub-Body2-Form">
                  <div className="Sub-Form1">
                    <TextField
                      error={state.FirstNameFlag}
                      helperText={
                        state.LastNameFlag
                          ? "Please enter a valid first name"
                          : ""
                      }
                      className="TextField"
                      placeholder="First Name"
                      variant="outlined"
                      size="small"
                      name="FirstName"
                      style={{ margin: "0px 10px 10px 0px" }}
                      value={state.FirstName}
                      onChange={this.handleChange}
                    />
                    <TextField
                      error={state.LastNameFlag}
                      helperText={
                        state.LastNameFlag
                          ? "Please enter a valid last name"
                          : ""
                      }
                      className="TextField"
                      placeholder="Last Name"
                      variant="outlined"
                      size="small"
                      name="LastName"
                      value={state.LastName}
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="Sub-Form2">
                    <TextField
                      error={state.SignUpEmailFlag}
                      helperText={
                        state.LastNameFlag
                          ? "Please enter a valid email address"
                          : ""
                      }
                      className="TextField"
                      placeholder="Your Email"
                      variant="outlined"
                      size="small"
                      name="SignUpEmail"
                      style={{ margin: "10px 0px", width: 430 }}
                      value={state.SignUpEmail}
                      onChange={this.handleChange}
                    />
                    <TextField
                      error={state.SignUpPasswordFlag}
                      helperText={
                        state.LastNameFlag
                          ? "Password should be alphanumeric "
                          : "it should be min 8 character"
                      }
                      className="TextField"
                      placeholder="Password"
                      variant="outlined"
                      size="small"
                      type="password"
                      name="SignUpPassword"
                      style={{ margin: "10px 0px", width: 430 }}
                      value={state.SignUpPassword}
                      onChange={this.handleChange}
                    />
                    <TextField
                      error={state.SignUpConfirmPasswordFlag}
                      helperText={
                        state.LastNameFlag ? "confirm password is wrong" : ""
                      }
                      className="TextField"
                      placeholder="Confirm Password"
                      variant="outlined"
                      size="small"
                      type="password"
                      name="SignUpConfirmPassword"
                      style={{ margin: "10px 0px", width: 430 }}
                      value={state.SignUpConfirmPassword}
                      onChange={this.handleChange}
                    />
                    {state.Role === "vendor" ? (
                      <TextField
                        error={state.FlightCompanyFlag}
                        className="TextField"
                        placeholder="Flight Company"
                        variant="outlined"
                        size="small"
                        name="FlightCompany"
                        type="text"
                        style={{ margin: "10px 0px", width: 430 }}
                        value={state.FlightCompany}
                        onChange={this.handleChange}
                      />
                    ) : null}
                    {state.Role !== "customer" ? (
                      <TextField
                        error={state.MasterPasswordFlag}
                        className="TextField"
                        placeholder="Host key"
                        variant="outlined"
                        size="small"
                        name="MasterPassword"
                        type="password"
                        style={{ margin: "10px 0px", width: 430 }}
                        value={state.MasterPassword}
                        onChange={this.handleChange}
                      />
                    ) : null}
                    <RadioGroup
                      //   aria-label="gender"
                      name="Role"
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        // justifyContent: "center",
                        // alignItems: "center",
                      }}
                      value={state.Role}
                      onChange={this.handleChange}>
                      <FormControlLabel
                        value="customer"
                        control={<Radio />}
                        label="Customer"
                      />
                      <FormControlLabel
                        value="admin"
                        control={<Radio />}
                        label="Admin"
                      />
                      <FormControlLabel
                        value="vendor"
                        control={<Radio />}
                        label="Vendor"
                      />
                    </RadioGroup>
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: "#06C400",
                        width: 430,
                        margin: "10px 0 10px 0",
                        color: "white",
                      }}
                      onClick={() => {
                        this.handleSignUpSubmit();
                      }}>
                      Sign Up
                    </Button>
                    {/* <Button
                      className="text-primary"
                      style={{ width: 430 }}
                      onClick={() => {
                        window.location.href = "/ForgetPassword";
                      }}
                    >
                      Forget Password
                    </Button> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="Sub-Body2">
              Contact Tours & Travels Customer Care Number Anytime At 1234567890
            </div>
          </div>
        </div>
        <Backdrop
          style={{ zIndex: "1", color: "#fff" }}
          open={this.state.OpenLoader}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={state.OpenSnackBar}
          autoHideDuration={2000}
          onClose={this.handleSnackBarClose}
          message={state.Message}
          action={
            <React.Fragment>
              <Button
                color="secondary"
                size="small"
                onClick={this.handleSnackBarClose}>
                UNDO
              </Button>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={this.handleSnackBarClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
        />
      </div>
    );
  }
}
