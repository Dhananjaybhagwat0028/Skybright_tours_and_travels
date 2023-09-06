import React, { Component } from "react";
import "./VendorDashboard.css";
import History from "./History";
import ActiveComplaints from "./ActiveComplaints";
import TechnicianHome from "./VendorHome.js";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import FlightTakeoffIcon from "@material-ui/icons/FlightTakeoff";
import FlightIcon from "@material-ui/icons/Flight";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import FeedbackIcon from "@material-ui/icons/Feedback";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import AccessibilityIcon from "@material-ui/icons/Accessibility";
import Paper from "@material-ui/core/Paper";

import Popper from "@material-ui/core/Popper";
import PopupState, { bindToggle, bindPopper } from "material-ui-popup-state";

export default class VendorDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //
      Message: "",
      //
      NumberOfRecordPerPage: 6,
      //
      PageNumber: 1,
      JobPageNumber: 1,
      ApplicationPageNumber: 1,
      FeedbackPageNumber: 1,
      //
      TotalPages: 0,
      TotalRecords: 0,

      open: false,
      open1: false,
      MenuOpen: false,
      OpenLoader: false,
      OpenSnackBar: false,

      OpenHome: true,
      OpenActiveComplaints: false,
      OpenHistory: false,
    };
  }

  componentWillMount() {
    console.log("Component will mount calling ... ");
    this.setState({
      OpenHome: localStorage.getItem("TMenuHome") === "true" ? true : false,
      OpenActiveComplaints:
        localStorage.getItem("TMenuActiveComplaints") === "true" ? true : false,
      OpenHistory:
        localStorage.getItem("TMenuHistory") === "true" ? true : false,
    });
    if (localStorage.getItem("TMenuHome") === "true") {
    } else if (localStorage.getItem("TMenuActiveComplaints") === "true") {
    } else if (localStorage.getItem("TMenuHistory") === "true") {
    }

    if (localStorage.getItem("VendorToken") === null) {
      window.location.href = "/";
    }

  }

  handleMenuButton = (e) => {
    console.log("Handle Menu Button Calling ... ");
    this.setState({
      MenuOpen: !this.state.MenuOpen,
    });
  };

  handleOpenHome = async () => {
    console.log("Handle Open Calling ... ");
    localStorage.setItem("TMenuHome", true);
    localStorage.setItem("TMenuActiveComplaints", false);
    localStorage.setItem("TMenuHistory", false);
    await this.setState({
      open: false,
      OpenHome: true,
      OpenActiveComplaints: false,
      OpenHistory: false,
    });
  };

  handleOpenActiveComplaints = async () => {
    console.log("Handle Open Calling ... ");
    localStorage.setItem("TMenuHome", false);
    localStorage.setItem("TMenuActiveComplaints", true);
    localStorage.setItem("TMenuHistory", false);
    await this.setState({
      open: false,
      OpenHome: false,
      OpenActiveComplaints: true,
      OpenHistory: false,
    });
  };

  handleOpenHistory = async () => {
    console.log("Handle Open Calling ... ");
    localStorage.setItem("TMenuHome", false);
    localStorage.setItem("TMenuActiveComplaints", false);
    localStorage.setItem("TMenuHistory", true);
    await this.setState({
      open: false,
      OpenHome: false,
      OpenActiveComplaints: false,
      OpenHistory: true,
    });
  };

  handleClose = () => {
    console.log("Handle Close Calling ...");
    this.setState({
      open: false,
      OpenHome: false,
      OpenActiveComplaints: false,
      OpenHistory: false,
    });
  };

  handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ OpenSnackBar: false });
  };

  handleRadioChange = (event) => {
    console.log("Handle Redio Change Calling...");
    this.setState({ ProjectStatus: event.target.value });
  };

  handleChanges = (e) => {
    const { name, value } = e.target;
    this.setState(
      { [name]: value },
      console.log("name : ", name, "Value : ", value)
    );
  };

  handleActiveChange = (e) => {
    console.log(" Checked Status : ", e.target.checked);
    this.setState({ IsActive: e.target.checked });
  };

  handlePaging = async (e, value) => {
    console.log("Current Page : ", value);
  };

  handleField = (event) => {
    console.log("Selected Job Field : ", event.target.value);
    this.setState({ JobField: event.target.value });
  };

  SignOut = async () => {
    //
    localStorage.removeItem("TechnicianID");
    localStorage.removeItem("TechnicianFullName");
    localStorage.removeItem("TechnicianEmail");
    localStorage.removeItem("TechnicianToken");
    //
    localStorage.removeItem("TMenuHome");
    localStorage.removeItem("TMenuActiveComplaints");
    localStorage.removeItem("TMenuHistory");
    //
    this.props.history.push("/");
  };

  handleOpenHomeBody = () => {
    let state = this.state;
    return (
      <div className="Technician-Home-Container">
        <div className="Technician-Home-SubContainer">
          <TechnicianHome />
        </div>
      </div>
    );
  };

  handleOpenActiveComplaintsBody = () => {
    let state = this.state;
    return (
      <div className="Technician-ActiveComplaints-Container">
        <ActiveComplaints />
      </div>
    );
  };

  handleOpenHistoryBody = () => {
    let state = this.state;
    return (
      <div className="Technician-History-Container">
        <History />
      </div>
    );
  };

  render() {
    let state = this.state;
    let self = this;
    console.log("state : ", state);
    return (
      <div className="TechnicianDashboard-Container">
        <div className="Sub-Container">
          <div className="Header">
            <AppBar position="static" style={{ backgroundColor: "#0c2ce3" }}>
              <Toolbar>
                <IconButton
                  edge="start"
                  className=""
                  color="inherit"
                  onClick={this.handleMenuButton}>
                  <MenuIcon />
                </IconButton>
                <Typography
                  variant="h6"
                  style={{ flex: 1.5, margin: "0 0 0 100px" }}>
                  Vendor DashBoard
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
                <PopupState variant="popper" popupId="demo-popup-popper">
                  {(popupState) => (
                    <div>
                      <IconButton
                        edge="start"
                        color="inherit"
                        {...bindToggle(popupState)}>
                        <AccountCircleIcon fontSize="large" />
                      </IconButton>

                      <Popper
                        {...bindPopper(popupState)}
                        transition
                        style={{ zIndex: 1234 }}>
                        {({ TransitionProps }) => (
                          <Fade {...TransitionProps} timeout={350}>
                            <Paper
                              style={{
                                padding: 15,
                                width: "fit-content",
                                height: "fit-content",
                                textAlign: "center",
                                fontFamily: "Roboto",
                                backgroundColor: "#202020",
                                color: "white",
                              }}>
                              <IconButton edge="start" color="inherit">
                                <AccountBoxIcon fontSize="large" />
                              </IconButton>
                              <Typography style={{ padding: 5 }}>
                                Vendor ID : {localStorage.getItem("VendorID")}
                              </Typography>
                              <Typography style={{ padding: 5 }}>
                                {localStorage.getItem("VendorFullName")}
                              </Typography>
                              <Typography style={{ padding: 5 }}>
                                {localStorage.getItem("VendorEmail")}
                              </Typography>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  this.SignOut();
                                }}>
                                <IconButton edge="start" color="inherit">
                                  <ExitToAppIcon fontSize="small" />
                                </IconButton>
                                <div>Sign Out</div>
                              </div>
                            </Paper>
                          </Fade>
                        )}
                      </Popper>
                    </div>
                  )}
                </PopupState>
              </Toolbar>
            </AppBar>
          </div>
          <div className="Body">
            <div className="Sub-Body">
              <div className={state.MenuOpen ? "SubBody11" : "SubBody12"}>
                <div
                  className={state.OpenHome ? "NavButton1" : "NavButton2"}
                  onClick={this.handleOpenHome}>
                  <IconButton edge="start" className="NavBtn" color="inherit">
                    <VisibilityIcon />
                  </IconButton>
                  {this.state.MenuOpen ? (
                    <div className="NavButtonText">Home</div>
                  ) : null}
                </div>

                <div
                  className={
                    state.OpenActiveComplaints ? "NavButton1" : "NavButton2"
                  }
                  onClick={this.handleOpenActiveComplaints}>
                  <IconButton edge="start" className="NavBtn" color="inherit">
                    <FlightIcon />
                  </IconButton>
                  {this.state.MenuOpen ? (
                    <div className="NavButtonText">Manipulate</div>
                  ) : null}
                </div>

                <div
                  className={state.OpenHistory ? "NavButton1" : "NavButton2"}
                  onClick={this.handleOpenHistory}>
                  <IconButton edge="start" className="NavBtn" color="inherit">
                    <AccessibilityIcon />
                  </IconButton>
                  {this.state.MenuOpen ? (
                    <div className="NavButtonText">Cutomer Booking</div>
                  ) : null}
                </div>
              </div>
              <div className={state.MenuOpen ? "SubBody21" : "SubBody22"}>
                <div
                  style={{
                    height: "100%",
                    width: "100%",
                  }}>
                  <div
                    style={{
                      height: "100%",
                      width: "100%",
                    }}>
                    {state.OpenHome
                      ? this.handleOpenHomeBody()
                      : state.OpenActiveComplaints
                      ? this.handleOpenActiveComplaintsBody()
                      : state.OpenHistory
                      ? this.handleOpenHistoryBody()
                      : null}
                  </div>
                </div>
              </div>
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
