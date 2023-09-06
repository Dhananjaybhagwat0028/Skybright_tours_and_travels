import React, { Component } from "react";
import "./ForgetPassword.scss";
import { AuthenticationDataServices } from "./../../services/AuthenticationDataServices";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import FlightTakeoffIcon from "@material-ui/icons/FlightTakeoff";

import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";

export default class ForgetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailId: null,
      password: null,
      confirmPassword: null,
      firstName: null,
      lastName: null,
      isReset: false,
      OpenLoader: false,
    };
  }

  handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ OpenSnackBar: false });
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState(
      { [name]: value },
      console.log("Name : ", name, " Value : ", value)
    );
  };

  IsValidation() {
    debugger;
    let IsValid = true;
    if (!this.state.emailId) {
      this.setState({
        OpenSnackBar: true,
        Message: "Please enter email address",
      });
      IsValid = false;
    }

    if (this.state.isReset && !this.state.confirmPassword) {
      this.setState({
        OpenSnackBar: true,
        Message: "Please enter confirm password",
      });
      IsValid = false;
    }

    if (this.state.isReset && !this.state.password) {
      this.setState({
        OpenSnackBar: true,
        Message: "Please enter password",
      });
      IsValid = false;
    }

    if (
      this.state.isReset &&
      this.state.password &&
      this.state.confirmPassword &&
      this.state.password !== this.state.confirmPassword
    ) {
      this.setState({
        OpenSnackBar: true,
        Message: "Password and confirm password not match",
      });
      IsValid = false;
    } else if (
      this.state.isReset &&
      this.state.password &&
      this.state.confirmPassword &&
      this.state.password === this.state.confirmPassword
    ) {
      this.setState({ isReset: true });
    }

    if (!IsValid) {
      return false;
    }

    return true;
  }

  handleSubmit = () => {
    if (this.IsValidation()) {
      console.log("Form is valid");
      debugger;
      let data = {
        email: this.state.emailId,
        password: this.state.password,
        isReset: this.state.isReset,
      };
      AuthenticationDataServices.ResetPassword(data)
        .then((data) => {
          debugger;
          console.log("ResetPassword Data : ", data);
          if (data.isSuccess && data.message === "User Found In System") {
            this.setState({
              isReset: true,
              firstName: data.data.firstName,
              lastName: data.data.lastName,
            });
            this.setState({
              OpenSnackBar: true,
              Message: data.message,
            });
          } else if (
            data.isSuccess &&
            data.message === "Password Reset Successfully"
          ) {
            this.setState({
              OpenSnackBar: true,
              Message: data.message,
            });
            window.location.href = "/";
          }
        })
        .catch((error) => {
          console.error("ResetPassword Error : ", error);
        });
    } else {
      console.log("Validation Error");
    }
  };

  render() {
    let state = this.state;
    return (
      <div id="forget-mainContainer">
        <div id="sub-Container">
          <div className="Header">
            <AppBar position="static" style={{ backgroundColor: "#ff0000" }}>
              <Toolbar>
                <IconButton
                  edge="start"
                  className=""
                  color="inherit"
                  // onClick={this.handleMenuButton}
                >
                  <MenuIcon />
                </IconButton>
                <Typography
                  variant="h6"
                  style={{ flex: 1, margin: "0 0 0 100px" }}>
                  Forget Password
                </Typography>
                <Typography
                  variant="h6"
                  style={{
                    flexGrow: 3,
                    display: "flex",
                    padding: "5px 0 0 190px",
                    boxSizing: "border-box",
                  }}>
                  Sky-Bright Tours & Travels &nbsp;
                  <div style={{ margin: "3px 0 0 0" }}>
                    <FlightTakeoffIcon />
                  </div>
                </Typography>
              </Toolbar>
            </AppBar>
          </div>
          <div id="body" className="d-flex justify-content-center">
            <div id="form-body" className="p-5">
              <form>
                {state.isReset ? (
                  <div className="mb-3">
                    <div className="text-dark">
                      First Name :&nbsp;
                      <div className="text-success d-inline-block">
                        {state.firstName}
                      </div>
                    </div>
                    <div className="text-dark">
                      Last Name :&nbsp;
                      <div className="text-success d-inline-block">
                        {state.lastName}
                      </div>
                    </div>
                  </div>
                ) : (
                  <React.Fragment></React.Fragment>
                )}
                <div className="mb-3">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    name="emailId"
                    onChange={(e) => {
                      this.handleChange(e);
                    }}
                  />
                  <div id="emailHelp" className="form-text">
                    Please enter valid email address
                  </div>
                </div>
                {state.isReset ? (
                  <React.Fragment>
                    <div className="mb-3">
                      <label
                        htmlFor="exampleInputPassword1"
                        className="form-label">
                        Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="exampleInputPassword1"
                        name="password"
                        onChange={(e) => {
                          this.handleChange(e);
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="exampleInputPassword1"
                        className="form-label">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="exampleInputPassword1"
                        name="confirmPassword"
                        onChange={(e) => {
                          this.handleChange(e);
                        }}
                      />
                    </div>
                  </React.Fragment>
                ) : null}
                <button
                  type="button"
                  className="btn btn-link float-left mt-3"
                  onClick={() => {
                    window.location.href = "/";
                  }}>
                  Sign In
                </button>
                <button
                  type="button"
                  className="btn btn-primary float-right mt-3"
                  onClick={() => {
                    this.handleSubmit();
                  }}>
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>

        <Backdrop
          style={{ zIndex: "1", color: "#fff" }}
          open={this.state.OpenLoader}
          onClick={() => {
            this.setState({ OpenLoader: false });
          }}>
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
