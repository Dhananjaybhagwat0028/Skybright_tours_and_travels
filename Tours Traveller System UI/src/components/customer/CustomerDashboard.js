import React, { Component } from "react";
import "./CustomerDashboard.css";
import { CustomerDataServices } from "../../services/CustomerDataServices";
import { FeedbackDataServices } from "../../services/FeedbackDataServices";
import Default from "./../../asserts/Default.png";
import CustomerHome from "./CustomerHome.js";
import MyPackages from "./MyPackages";
import TourPackage from "./TourPackage.js";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import MenuIcon from "@material-ui/icons/Menu";
import VisibilityIcon from "@material-ui/icons/Visibility";
import TextField from "@material-ui/core/TextField";
import Modal from "@material-ui/core/Modal";
import Fade from "@material-ui/core/Fade";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Paper from "@material-ui/core/Paper";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FlightTakeoffIcon from "@material-ui/icons/FlightTakeoff";
import Popper from "@material-ui/core/Popper";
import PopupState, { bindToggle, bindPopper } from "material-ui-popup-state";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Rating from "@material-ui/lab/Rating";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import SentimentVeryDissatisfiedIcon from "@material-ui/icons/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@material-ui/icons/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@material-ui/icons/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@material-ui/icons/SentimentSatisfiedAltOutlined";
import SentimentVerySatisfiedIcon from "@material-ui/icons/SentimentVerySatisfied";
import Box from "@material-ui/core/Box";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import MyTour from "./MyTour.js";

const StyledRating = withStyles({
  iconFilled: {
    color: "#ff6d75",
  },
  iconHover: {
    color: "#ff3d47",
  },
})(Rating);

const customIcons = {
  1: {
    icon: <SentimentVeryDissatisfiedIcon />,
    label: "Very Dissatisfied",
  },
  2: {
    icon: <SentimentDissatisfiedIcon />,
    label: "Dissatisfied",
  },
  3: {
    icon: <SentimentSatisfiedIcon />,
    label: "Neutral",
  },
  4: {
    icon: <SentimentSatisfiedAltIcon />,
    label: "Satisfied",
  },
  5: {
    icon: <SentimentVerySatisfiedIcon />,
    label: "Very Satisfied",
  },
};

function IconContainer(props) {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
}

IconContainer.propTypes = {
  value: PropTypes.number.isRequired,
};

export default class CustomerDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      PersonalDetailID: 0,
      UserID: localStorage.getItem("CustomerID"),
      FirstName: "",
      LastName: "",
      Address: "",
      City: "",
      State: "",
      ZipCode: "",
      HomePhone: "",
      PersonalNumber: "",
      Email: "",
      Gender: "male",
      DateOfBirth: "",
      Occupation: "",
      CompanyName: "",
      Feedback: "",
      Rating: 0,
      //
      PlanType: "device",
      RaiseType: "issue",
      Summary: "",
      Description: "",
      //
      Image: Default,
      File: new FormData(),
      FileName: "",
      FileExist: false,
      //
      PlanTypeFlag: false,
      RaiseTypeFlag: false,
      SummaryFlag: false,
      DescriptionFlag: false,
      //
      FirstNameFlag: false,
      LastNameFlag: false,
      AddressFlag: false,
      CityFlag: false,
      StateFlag: false,
      ZipCodeFlag: false,
      HomePhoneFlag: false,
      PersonalNumberFlag: false,
      EmailFlag: false,
      DateOfBirthFlag: false,
      FeedbackFlag: false,
      ProductImageFlag: false,
      ImageUrl: "",
      //
      Message: "",
      //
      NumberOfRecordPerPage: 6,
      //
      PageNumber: 1,
      //
      TotalPages: 0,
      TotalRecords: 0,
      //
      MenuOpen: false,
      OpenLoader: false,
      OpenSnackBar: false,
      OpenAddressModel: true,
      OpenFeedback: false,

      OpenHome: true,
      OpenTourPackages: false,
      OpenMyPackages: false,
      OpenMyTour: false,
      //
      rows: [],
    };
  }

  componentWillMount() {
    console.log("Component will mount calling ... ");

    this.setState({
      OpenHome: localStorage.getItem("CMenuHome") === "true" ? true : false,
      OpenTourPackages:
        localStorage.getItem("CMenuTourPackages") === "true" ? true : false,
      OpenMyTour: localStorage.getItem("CMenuMyTour") === "true" ? true : false,
      OpenMyPackages:
        localStorage.getItem("CMenuMyPackages") === "true" ? true : false,
    });

    if (localStorage.getItem("CMenuHome") === "true") {
    } else if (localStorage.getItem("CMenuUpgrade") === "true") {
    } else if (localStorage.getItem("CMenuMyPackages") === "true") {
    } else if (localStorage.getItem("CMenuMyTour") === "true") {
    }

    if (localStorage.getItem("CustomerToken") === null) {
      window.location.href = "/";
    }

    this.GetCustomerInfomation();
  }

  GetCustomerInfomation = () => {
    let state = this.state;
    CustomerDataServices.GetCustomerInfomation(this.state.UserID)
      .then((data) => {
        console.log("GetCustomerInfomation Data : ", data);
        this.setState({
          PersonalDetailID: data.data.personalDetailID,
          UserID: data.data.userID,
          FirstName: data.data.firstName,
          LastName: data.data.lastName,
          Address: data.data.address,
          City: data.data.city,
          State: data.data.state,
          ZipCode: data.data.zipCode,
          HomePhone: data.data.homePhone,
          PersonalNumber: data.data.personalNumber,
          Email: data.data.email,
          Gender: data.data.gender === null ? state.Gender : data.data.gender,
          DateOfBirth: data.data.dob,
          Occupation: data.data.occupation,
          Image: data.data.imageUrl,
        });
      })
      .catch((error) => {
        console.log("GetCustomerInfomation Error : ", error);
      });
  };

  CreateTicketValidity = () => {
    console.log("CreateTicketValidity Calling...");
    let state = this.state;
    let Value = false;
    this.setState({
      PlanTypeFlag: false,
      RaiseTypeFlag: false,
      SummaryFlag: false,
      DescriptionFlag: false,
    });

    if (state.Summary === "") {
      this.setState({ SummaryFlag: true });
      Value = true;
    }

    if (state.Description === "") {
      this.setState({ DescriptionFlag: true });
      Value = true;
    }

    return Value;
  };

  CheckValidity = () => {
    let state = this.state;
    let Value = false;
    this.setState({
      FirstNameFlag: false,
      LastNameFlag: false,
      AddressFlag: false,
      CityFlag: false,
      StateFlag: false,
      ZipCodeFlag: false,
      HomePhoneFlag: false,
      PersonalNumberFlag: false,
      EmailFlag: false,
      DateOfBirthFlag: false,
      ProductImageFlag: false,
    });

    if (state.DateOfBirth === "" || state.DateOfBirth === null) {
      this.setState({ DateOfBirthFlag: true });
      Value = true;
    }

    if (state.Email === "" || state.Email === null) {
      this.setState({ EmailFlag: true });
      Value = true;
    }

    if (state.PersonalNumber === "" || state.PersonalNumber === null) {
      this.setState({ PersonalNumberFlag: true });
      Value = true;
    }

    if (state.HomePhone === "" || state.HomePhone === null) {
      this.setState({ HomePhoneFlag: true });
      Value = true;
    }

    if (state.ZipCode === "" || state.ZipCode === null) {
      this.setState({ ZipCodeFlag: true });
      Value = true;
    }

    if (state.State === "" || state.State === null) {
      this.setState({ StateFlag: true });
      Value = true;
    }

    if (state.City === "" || state.City === null) {
      this.setState({ CityFlag: true });
      Value = true;
    }

    if (state.Address === "" || state.Address === null) {
      this.setState({ AddressFlag: true });
      Value = true;
    }

    if (state.LastName === "" || state.LastName === null) {
      this.setState({ LastNameFlag: true });
      Value = true;
    }

    if (state.FirstName === "" || state.FirstName === null) {
      this.setState({ FirstNameFlag: true });
      Value = true;
    }

    return Value;
  };

  UpdateImage = async () => {
    let state = this.state;
    const data = new FormData();
    data.append("File", state.File);
    data.append("UserID", state.UserID);
    await CustomerDataServices.UpdateImage(data)
      .then((data) => {
        console.log("UpdateImage Data : ", data);
        this.setState({
          OpenSnackBar: true,
          OpenAddressModel: false,
          // Message: data.message,
        });
      })
      .catch((error) => {
        console.log("UpdateImage Error : ", error);
        this.setState({
          OpenSnackBar: true,
          OpenAddressModel: false,
          // Message: "Something went wrong",
        });
      });
  };

  handleInfoSubmit = async () => {
    if (this.CheckValidity()) {
      this.setState({
        OpenSnackBar: true,
        Message: "Please Enter Required Field.",
      });
      return;
    }
    this.setState({ OpenLoader: true });
    await this.UpdateImage();
    let state = this.state;
    let data = {
      userID: state.UserID,
      firstName: state.FirstName,
      lastName: state.LastName,
      address: state.Address,
      city: state.City,
      state: state.State,
      zipCode: state.ZipCode,
      homePhone: state.HomePhone,
      personalNumber: state.PersonalNumber,
      email: state.Email,
      gender: state.Gender,
      dob: state.DateOfBirth,
      occupation: state.Occupation,
    };

    CustomerDataServices.UpdateCustomerInfomation(data)
      .then((data) => {
        console.log("UpdateCustomerInfomation Data : ", data);
        this.setState({
          OpenLoader: false,
          OpenSnackBar: true,
          OpenAddressModel: false,
          Message: data.message,
        });
      })
      .catch((error) => {
        console.log("UpdateCustomerInfomation Error : ", error);
        this.setState({
          OpenLoader: false,
          OpenSnackBar: true,
          OpenAddressModel: false,
          // Message: "Something went wrong",
        });
      });
  };

  handleMenuButton = (e) => {
    console.log("Handle Menu Button Calling ... ");
    this.setState({
      MenuOpen: !this.state.MenuOpen,
    });
  };

  handleOpenHome = async () => {
    console.log("Handle Open Home Calling ... ");
    localStorage.setItem("CMenuHome", true);
    localStorage.setItem("CMenuTourPackages", false);
    localStorage.setItem("CMenuMyPackages", false);
    localStorage.setItem("CMenuMyTour", false);
    await this.setState({
      OpenHome: true,
      OpenTourPackages: false,
      OpenMyPackages: false,
      OpenMyTour: false,
    });
  };

  handleOpenTourPackages = async () => {
    console.log("Handle Open Home Calling ... ");
    localStorage.setItem("CMenuHome", false);
    localStorage.setItem("CMenuTourPackages", true);
    localStorage.setItem("CMenuMyPackages", false);
    localStorage.setItem("CMenuMyTour", false);
    await this.setState({
      OpenHome: false,
      OpenTourPackages: true,
      OpenMyTour: false,
      OpenMyPackages: false,
    });
  };

  handleOpenMyPackages = async () => {
    console.log("Handle Open Home Calling ... ");
    localStorage.setItem("CMenuHome", false);
    localStorage.setItem("CMenuTourPackages", false);
    localStorage.setItem("CMenuMyPackages", true);
    localStorage.setItem("CMenuMyTour", false);
    await this.setState({
      OpenHome: false,
      OpenTourPackages: false,
      OpenMyTour: false,
      OpenMyPackages: true,
    });
  };

  handleOpenMyTour = async () => {
    console.log("Handle Open Home Calling ... ");
    localStorage.setItem("CMenuHome", false);
    localStorage.setItem("CMenuTourPackages", false);
    localStorage.setItem("CMenuMyPackages", false);
    localStorage.setItem("CMenuMyTour", true);
    await this.setState({
      OpenHome: false,
      OpenTourPackages: false,
      OpenMyTour: true,
      OpenMyPackages: false,
    });
  };

  InsertFeedback = () => {
    this.setState({ FeedbackFlag: false });
    console.log("Feedback : ", this.state.Feedback);
    if (this.state.Feedback === "") {
      this.setState({
        FeedbackFlag: true,
        OpenSnackBar: true,
        Message: "Please Fill Required Field",
      });
      return;
    }

    let data = {
      userID: this.state.UserID,
      feedback: this.state.Feedback,
      rating: this.state.Rating,
    };

    FeedbackDataServices.InsertFeedback(data)
      .then((data) => {
        console.log("Data : ", data);
        this.setState({
          OpenFeedback: false,
          OpenSnackBar: true,
          Message: data.message,
          Feedback: "",
        });
      })
      .catch((error) => {
        console.log("Error : ", error);
        this.setState({
          OpenFeedback: false,
          FeedbackFlag: true,
          OpenSnackBar: true,
          Message: "Something Went Wrong",
        });
      });
  };

  handleOpenFeedbackModel = () => {
    this.setState({ OpenFeedback: true });
  };

  handleClose = () => {
    console.log("Handle Close Calling ...");
    this.setState({
      open: false,
      OpenAddressModel: false,
      OpenFeedback: false,
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

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value }, () => {
      // Call your validation functions here if needed
    });
  };

  handleCapture = (event) => {
    const reader = new FileReader();
    reader.onload = () => {
      this.setState({ Image: reader.result });
    };
    reader.readAsDataURL(event.target.files[0]);
    this.setState({ File: event.target.files[0] });
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
    localStorage.removeItem("CustomerToken");
    localStorage.removeItem("CustomerID");
    localStorage.removeItem("CustomerFullName");
    localStorage.removeItem("CustomerEmail");
    //
    localStorage.removeItem("CMenuHome");
    localStorage.removeItem("CMenuUpgrade");
    localStorage.removeItem("CMenuMyPackages");
    localStorage.removeItem("CMenuHistory");
    //
    this.props.history.push("/");
  };

  handleOpenAddressModelModel = async () => {
    this.setState({ OpenAddressModel: true });
  };

  handleOpenHomeBody = () => {
    return (
      <div className="Customer-Home-Container">
        <div className="Customer-Home-SubContainer">
          <CustomerHome parentCallback={this.handleCallback} />
        </div>
      </div>
    );
  };

  handleOpenTourPackagesBody = () => {
    return (
      <div className="Customer-TourPackage-Container">
        <div className="Customer-TourPackage-SubContainer">
          <TourPackage />
        </div>
      </div>
    );
  };

  handleOpenMyPackagesBody = () => {
    return (
      <div className="Customer-MyPackages-Container">
        <MyPackages />
      </div>
    );
  };

  handleOpenMyTourBody = () => {
    return (
      <div className="Customer-MyTour-Container">
        <MyTour />
      </div>
    );
  };

  handleChangeRating = (e) => {
    const { value } = e.target;
    this.setState({ Rating: value }, console.log("Value : ", value));
  };

  render() {
    let state = this.state;
    let self = this.self;
    console.log("state : ", state);
    return (
      <div className="CustomerDashboard-Container">
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
                  style={{ flex: 4, margin: "0 0 0 100px" }}>
                  Customer DashBoard
                </Typography>
                <Typography
                  variant="h6"
                  style={{
                    flexGrow: 2,
                    display: "flex",
                    padding: "5px 0 0 190px",
                    boxSizing: "border-box",
                  }}>
                  Sky-Bright Tours & Travels &nbsp;
                  <div style={{ margin: "3px 0 0 0" }}>
                    <FlightTakeoffIcon />
                  </div>
                </Typography>

                <Button
                  variant="outlined"
                  style={{
                    color: "white",
                    border: "1px solid white",
                    margin: "0 10px",
                  }}
                  onClick={() => {
                    this.handleOpenFeedbackModel();
                  }}>
                  Feedback
                </Button>

                <PopupState variant="popper" popupId="demo-popup-popper">
                  {(popupState) => (
                    <div>
                      <IconButton
                        edge="start"
                        color="inherit"
                        {...bindToggle(popupState)}>
                        {state.Image === Default ? (
                          <AccountCircleIcon fontSize="large" />
                        ) : (
                          <img
                            src={state.Image}
                            alt=""
                            className="Profile-Image"
                          />
                        )}
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
                                User ID : {localStorage.getItem("CustomerID")}
                              </Typography>
                              <Typography style={{ padding: 5 }}>
                                {localStorage.getItem("CustomerFullName")}
                              </Typography>
                              <Typography style={{ padding: 5 }}>
                                {localStorage.getItem("CustomerEmail")}
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
                    state.OpenTourPackages ? "NavButton1" : "NavButton2"
                  }
                  onClick={this.handleOpenTourPackages}>
                  <IconButton edge="start" className="NavBtn" color="inherit">
                    <LocalMallIcon />
                  </IconButton>
                  {this.state.MenuOpen ? (
                    <div className="NavButtonText"> Tour Packages</div>
                  ) : null}
                </div>

                <div
                  className={state.OpenMyPackages ? "NavButton1" : "NavButton2"}
                  onClick={this.handleOpenMyPackages}>
                  <IconButton edge="start" className="NavBtn" color="inherit">
                    <BookmarkIcon />
                  </IconButton>
                  {this.state.MenuOpen ? (
                    <div className="NavButtonText">My Personal Booking</div>
                  ) : null}
                </div>

                <div
                  className={state.OpenMyTour ? "NavButton1" : "NavButton2"}
                  onClick={this.handleOpenMyTour}>
                  <IconButton edge="start" className="NavBtn" color="inherit">
                    <BookmarkIcon />
                  </IconButton>
                  {this.state.MenuOpen ? (
                    <div className="NavButtonText">My Tour Booking</div>
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
                      // height: state.OpenHome ? "100%" : "92%",
                      height: "100%",
                      width: "100%",
                    }}>
                    {state.OpenHome
                      ? this.handleOpenHomeBody()
                      : state.OpenTourPackages
                      ? this.handleOpenTourPackagesBody()
                      : state.OpenMyTour
                      ? this.handleOpenMyTourBody()
                      : state.OpenMyPackages
                      ? this.handleOpenMyPackagesBody()
                      : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Modal
          open={this.state.OpenAddressModel}
          onClose={this.handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
          className="Model-Create-Ticket">
          <Fade in={this.state.OpenAddressModel}>
            <div className="Model-Create-Ticket-Main">
              <div className="Model-Create-Ticket-Header">
                <div className="Model-Create-Ticket-Header-Text">
                  User Details
                </div>
              </div>
              <div className="Model-Create-Ticket-Body">
                <div>
                  <TextField
                    label="User ID"
                    type="number"
                    name="UserID"
                    style={{ margin: "0 20px 5px 0" }}
                    value={state.UserID}
                  />
                  <TextField
                    label="First Name"
                    type="text"
                    style={{ margin: "0 20px 5px 0" }}
                    name="FisrtName"
                    value={state.FirstName}
                  />
                  <TextField
                    label="Last Name"
                    type="text"
                    style={{ margin: "0 20px 5px 0" }}
                    name="LastName"
                    value={state.LastName}
                  />
                </div>
                <TextField
                  label="Address"
                  type="text"
                  fullWidth
                  style={{ margin: "0 0 5px 0" }}
                  name="Address"
                  error={state.AddressFlag}
                  value={state.Address}
                  onChange={this.handleChange}
                />
                <div>
                  <TextField
                    label="City"
                    type="text"
                    style={{ margin: "0 20px 5px 0" }}
                    name="City"
                    error={state.CityFlag}
                    value={state.City}
                    onChange={this.handleChange}
                  />
                  <TextField
                    label="State"
                    type="text"
                    style={{ margin: "0 20px 5px 0" }}
                    name="State"
                    error={state.StateFlag}
                    value={state.State}
                    onChange={this.handleChange}
                  />
                  <TextField
                    label="Zip Code"
                    type="number"
                    style={{ margin: "0 20px 5px 0" }}
                    name="ZipCode"
                    error={state.ZipCodeFlag}
                    helperText={
                      state.ZipCodeFlag
                        ? "Please enter a valid 6-digit zip code"
                        : "Enter a 6-digit zip code"
                    }
                    value={state.ZipCode}
                    onChange={this.handleChange}
                    inputProps={{
                      maxLength: 6, // Restrict the input length to 6 characters
                    }}
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <TextField
                    label="Home Phone"
                    type="tel"
                    style={{ margin: "0 20px 5px 0" }}
                    name="HomePhone"
                    error={state.HomePhoneFlag}
                    helperText={
                      state.HomePhoneFlag
                        ? "Please enter a valid 10-digit phone number"
                        : "Enter a 10-digit phone number"
                    }
                    value={state.HomePhone}
                    onChange={this.handleChange}
                    inputProps={{
                      pattern: "[0-9]{10}", // Validate for 10 digits
                    }}
                  />

                  <TextField
                    label="Personal Number"
                    type="tel"
                    style={{ margin: "0 20px 5px 0" }}
                    name="PersonalNumber"
                    error={state.PersonalNumberFlag}
                    helperText={
                      state.PersonalNumberFlag
                        ? "Please enter a valid 10-digit phone number"
                        : "Enter a 10-digit phone number"
                    }
                    value={state.PersonalNumber}
                    onChange={this.handleChange}
                    inputProps={{
                      pattern: "[0-9]{10}", // Validate for 10 digits
                    }}
                  />
                  <TextField
                    label="Email Address"
                    type="email"
                    style={{ margin: "0 20px 5px 0" }}
                    name="Email"
                    error={state.EmailFlag}
                    value={state.Email}
                    onChange={this.handleChange}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    margin: "20px 0 0 0",
                  }}>
                  DOB :
                  <TextField
                    type="date"
                    style={{ margin: "0 20px 5px 10px" }}
                    name="DateOfBirth"
                    error={state.DateOfBirthFlag}
                    helperText={
                      state.DateOfBirthFlag
                        ? "Please select a valid date of birth"
                        : "Select your date of birth"
                    }
                    value={state.DateOfBirth}
                    onChange={this.handleChange}
                    inputProps={{
                      min: "1900-01-01", // Set a minimum date
                      max: "2023-08-31",
                    }}
                  />
                  Gender :
                  <RadioGroup
                    name="Gender"
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      margin: "0 0 0 20px",
                      // justifyContent: "center",
                      // alignItems: "center",
                    }}
                    value={state.Gender}
                    onChange={this.handleChange}>
                    <FormControlLabel
                      value="male"
                      control={<Radio />}
                      label="Male"
                    />
                    <FormControlLabel
                      value="female"
                      control={<Radio />}
                      label="Female"
                    />
                    <FormControlLabel
                      value="other"
                      control={<Radio />}
                      label="Other"
                    />
                  </RadioGroup>
                </div>
                <div style={{ display: "flex" }}>
                  <TextField
                    label="Occupation"
                    type="text"
                    style={{ margin: "0 20px 5px 0" }}
                    name="Occupation"
                    value={state.Occupation}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="Model-Create-Ticket-Footer">
                <Button
                  variant="contained"
                  style={{ margin: "10px" }}
                  onClick={() => {
                    this.handleClose();
                  }}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  style={{
                    backgroundColor: "#21007F",
                    width: 100,
                    margin: "0px 0 0 10px",
                    color: "white",
                  }}
                  onClick={() => {
                    // Perform your validation checks here before saving
                    if (!state.ZipCode || state.ZipCode.length !== 6) {
                      // Display an error message or set a flag
                      return;
                    }

                    if (
                      !state.HomePhone ||
                      !state.HomePhone.match(/^\d{10}$/)
                    ) {
                      // Display an error message or set a flag
                      return;
                    }

                    if (
                      !state.PersonalNumber ||
                      !state.PersonalNumber.match(/^\d{10}$/)
                    ) {
                      // Display an error message or set a flag
                      return;
                    }

                    // Your other validation checks

                    // If all validations pass, call your save function
                    this.handleInfoSubmit();
                  }}>
                  Save
                </Button>
              </div>
            </div>
          </Fade>
        </Modal>

        <Modal
          open={this.state.OpenFeedback}
          onClose={this.handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
          className="Model-Create-Feedback">
          <Fade in={this.state.OpenFeedback}>
            <div className="Model-Create-Feedback-Main">
              <div className="Model-Create-Feedback-Header">
                {/* <div className="Model-Create-Feedback-Header-Text"> */}
                Send Your Feedback
                {/* </div> */}
              </div>
              <div className="Model-Create-Feedback-Body">
                <TextField
                  id="outlined-basic"
                  label="Feedback"
                  name="Feedback"
                  variant="outlined"
                  style={{ width: "100%" }}
                  multiline
                  rows={10}
                  size="small"
                  error={state.FeedbackFlag}
                  value={state.Feedback}
                  onChange={this.handleChanges}
                />
              </div>
              <div className="Model-Create-Feedback-Footer">
                <Button
                  variant="contained"
                  style={{ margin: "10px" }}
                  onClick={() => {
                    this.handleClose();
                  }}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    this.InsertFeedback();
                  }}>
                  Send
                </Button>
              </div>
            </div>
          </Fade>
        </Modal>

        <Modal
          open={this.state.OpenFeedback}
          onClose={this.handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
          className="Model-Create-Feedback">
          <Fade in={this.state.OpenFeedback}>
            <div className="Model-Create-Feedbacks-Main">
              <div className="Model-Create-Feedback-Header">
                {/* <div className="Model-Create-Feedback-Header-Text"> */}
                Send Your Feedback
                {/* </div> */}
              </div>
              <div className="Model-Create-Feedback-Body d-flex flex-column">
                <TextField
                  id="outlined-basic"
                  label="Feedback"
                  name="Feedback"
                  variant="outlined"
                  style={{ width: "100%" }}
                  multiline
                  rows={10}
                  size="small"
                  error={state.FeedbackFlag}
                  value={state.Feedback}
                  onChange={this.handleChange}
                />
              </div>
              <div className="Model-Create-Feedback-Footer">
                <Button
                  variant="contained"
                  style={{ margin: "10px" }}
                  onClick={() => {
                    this.handleClose();
                  }}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ background: "#ff0000" }}
                  onClick={() => {
                    this.InsertFeedback();
                  }}>
                  Send
                </Button>
              </div>
            </div>
          </Fade>
        </Modal>

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
