import React, { Component } from "react";
import "./CustomerHome.scss";
import { CustomerDataServices } from "../../services/CustomerDataServices";
import { VendorDataServices } from "../../services/VendorDataServices";
import Pagination from "@material-ui/lab/Pagination";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Modal from "@material-ui/core/Modal";
import Fade from "@material-ui/core/Fade";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";

export default class CustomerHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      UserID: localStorage.getItem("CustomerID"),
      CustomerID: 0,
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
      PaymentMode: "card",
      Card: "",
      UPI: "",
      Cash: "",
      //
      FlightID: 0,
      FlightName: "",
      To: "",
      ToSearch: "",
      Destination: "",
      DestinationSearch: "",
      FlightPrice: "",
      FlightPriceOperational: "",
      Company: "",
      Time: "",
      FlightDescription: "",
      SeatClass: "economy",
      Date: "",
      AvailableSeats: 0,
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
      PaymentFlag: false,
      //
      Message: "",
      OpenSnackBar: false,
      OpenLoader: false,
      OpenTicketBookingModel: false,
      OpenGetwayModel: false,
      IsPayment: false,
      //
      PageNumber: 1,
      TotalPages: 0,
      Type: "all",
    };
  }

  componentWillMount() {
    console.log("Component will mount calling ... ");
    this.GetFlightDetails(this.state.PageNumber);
  }

  GetFlightDetails = (PageNumber) => {
    let data = {
      pageNumber: PageNumber,
      numberOfRecordPerPage: 8,
      type: this.state.Type,
    };

    CustomerDataServices.GetFlightDetails(data)
      .then((data) => {
        console.log("GetFlightDetails Data : ", data);
        this.setState({
          rows: data.data.reverse(),
          TotalPages: data.totalPage,
        });
      })
      .catch((error) => {
        console.log("GetFlightDetails Error : ", error);
      });
  };

  SearchAndFilterFlights = () => {
    // debugger;
    let data = {
      pageNumber: this.state.PageNumber,
      numberOfRecordPerPage: 7,
      isSearch: true,
      to: this.state.ToSearch,
      destination: this.state.DestinationSearch,
      isFilter: false,
      filterOn: {
        name: false,
        price: false,
        time: false,
      },
      isAscending: false,
    };

    CustomerDataServices.SearchAndFilterFlights(data)
      .then((data) => {
        console.log("SearchAndFilterFlights Data : ", data);
        this.setState({
          rows: data.data
            .filter(
              (X) =>
                X.to.toLowerCase() === this.state.ToSearch.toLowerCase() &&
                X.destination.toLowerCase() ===
                  this.state.DestinationSearch.toLowerCase()
            )
            .slice((this.state.PageNumber - 1) * 7, this.state.PageNumber * 7),
          TotalPages: Math.ceil(
            parseFloat(
              data.data.filter(
                (X) =>
                  X.to.toLowerCase() === this.state.ToSearch.toLowerCase() &&
                  X.destination.toLowerCase() ===
                    this.state.DestinationSearch.toLowerCase()
              ).length / 7
            )
          ),
        });
      })
      .catch((error) => {
        console.log("SearchAndFilterFlights Error : ", error);
      });
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState(
      { [name]: value },
      console.log("name : ", name, "Value : ", value)
    );

    if (name === "SeatClass") {
      if (value === "business") {
        this.setState({
          FlightPriceOperational:
            Number(this.state.FlightPriceOperational) + 1000,
        });
      } else {
        this.setState({ FlightPriceOperational: this.state.FlightPrice });
      }
    }
  };

  handleSelectDate = (e) => {
    const { name, value } = e.target;
    this.setState(
      { [name]: value },
      console.log("name : ", name, "Value : ", value)
    );

    this.AvailableSeat(value);
  };

  handleClose = () => {
    console.log("Handle Close Calling ...");
    this.setState({
      OpenTicketBookingModel: false,
    });
  };

  handleClose1 = () => {
    console.log("Handle Close Calling ...");
    this.setState({
      OpenGetwayModel: false,
    });
  };

  handleOpenBookingModel = (data) => {
    this.setState({
      OpenTicketBookingModel: true,
      FlightID: data.flightID,
      FlightName: data.flightName,
      To: data.to,
      Destination: data.destination,
      FlightPrice: data.price,
      FlightPriceOperational: data.price,
      Company: data.company,
      Time: data.time,
      FlightDescription: data.description,
    });
  };

  handleOpenGetwayModel = () => {
    this.setState({ OpenGetwayModel: true });
  };

  handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ OpenSnackBar: false });
  };

  CheckValidity = () => {
    console.log("CheckValidity Calling....");
    let value = false;
    let state = this.state;
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
    });

    if (state.FirstName === "" || state.FirstName === null) {
      this.setState({ FirstNameFlag: true });
      value = true;
    }

    if (state.LastName === "" || state.LastName === null) {
      this.setState({ LastNameFlag: true });
      value = true;
    }

    if (state.Address === "" || state.Address === null) {
      this.setState({ AddressFlag: true });
      value = true;
    }

    if (state.City === "" || state.City === null) {
      this.setState({ CityFlag: true });
      value = true;
    }

    if (state.State === "" || state.State === null) {
      this.setState({ StateFlag: true });
      value = true;
    }

    if (state.ZipCode === "" || state.ZipCode === null) {
      this.setState({ ZipCodeFlag: true });
      value = true;
    }

    if (state.HomePhone === "" || state.HomePhone === null) {
      this.setState({ HomePhoneFlag: true });
      value = true;
    }

    if (state.PersonalNumber === "" || state.PersonalNumber === null) {
      this.setState({ PersonalNumberFlag: true });
      value = true;
    }

    if (state.Email === "" || state.Email === null) {
      this.setState({ EmailFlag: true });
      value = true;
    }

    if (state.DateOfBirth === "" || state.DateOfBirth === null) {
      this.setState({ DateOfBirthFlag: true });
      value = true;
    }

    return value;
  };

  handleCoonfirmBook = async () => {
    console.log("handleCoonfirmBook Calling .... ");
    this.setState({ PaymentFlag: false });
    let state = this.state;
    if (state.PaymentMode === "upi" && state.UPI === "") {
      this.setState({
        Message: "Enter Required Filled",
        OpenSnackBar: true,
        PaymentFlag: true,
      });
      return;
    } else if (state.PaymentMode === "card" && state.Card === "") {
      this.setState({
        Message: "Enter Required Filled",
        OpenSnackBar: true,
        PaymentFlag: true,
      });
      return;
    }
    this.setState({ OpenLoader: true });
    let data = {
      userID: state.UserID,
      flightID: state.FlightID,
      flightDate: state.Date,
      seatClass: state.SeatClass,
      paymentType: state.PaymentMode,
      cartNo: state.Card,
      upiid: state.UPI,
      status: "booked",
      price: Number(state.FlightPriceOperational),
      // Card: "",
      // UPI: "",
    };
    CustomerDataServices.PaymentGetway(data)
      .then((data) => {
        // debugger;
        console.log("PaymentGetway Data : ", data);
        this.setState({
          Message: data.message,
          OpenSnackBar: true,
          OpenLoader: false,
          OpenTicketBookingModel: false,
          OpenGetwayModel: false,
          Card: "",
          UPI: "",
        });
      })
      .catch((error) => {
        // debugger;
        console.log("PaymentGetway Error : ", error);
        this.setState({
          Message: "Something Went Wrong",
          OpenSnackBar: true,
          OpenLoader: false,
          OpenTicketBookingModel: false,
          OpenGetwayModel: false,
        });
      });
  };

  AvailableSeat = (flightDate) => {
    ///AvailableSeat?FlightID=2&FlightDate=2023-08-08
    let data = {
      flightID: this.state.FlightID,
      flightDate: flightDate,
    };
    CustomerDataServices.AvailableSeat(data)
      .then((data) => {
        console.log("Available Seat : Data : ", data);
        this.setState({ AvailableSeats: data.data });
        if (data.data > 0) {
          this.setState({ IsPayment: true });
        } else {
          this.setState({ IsPayment: false });
        }
      })
      .catch((error) => {
        console.error("Available Seat : Error : ", error);
      });
  };

  handlePaging = async (e, value) => {
    console.log("Current Page : ", value);
    this.GetFlightDetails(value);
  };

  render() {
    let state = this.state;
    let self = this;
    console.log("State : ", state);
    return (
      <div className="Customer-Container">
        <div className="Customer-Container-Header">
          Home
          <div>
            <TextField
              placeholder="Source"
              type="text"
              size="small"
              variant="outlined"
              style={{
                margin: "0 10px 0px 0",
                background: "white",
                borderRadius: 5,
              }}
              name="ToSearch"
              value={state.ToSearch}
              onChange={this.handleChange}
            />
            <TextField
              placeholder="Destination"
              variant="outlined"
              type="text"
              size="small"
              style={{
                margin: "0 10px 0px 0",
                background: "white",
                borderRadius: 5,
              }}
              name="DestinationSearch"
              value={state.DestinationSearch}
              onChange={this.handleChange}
            />
            <Button
              variant="contained"
              style={{ margin: "0 5px" }}
              onClick={() => {
                this.SearchAndFilterFlights();
              }}
            >
              Search
            </Button>
            <Button
              // variant="contained"
              style={{ color: "white" }}
              onClick={() => {
                this.GetFlightDetails(this.state.PageNumber);
              }}
            >
              clear
            </Button>
          </div>
        </div>
        <div className="Customer-Container-Body">
          <TableContainer component={Paper}>
            <Table className="" aria-label="simple table">
              <TableHead
                style={{
                  width: "100%",
                  backgroundColor: "#202020",
                }}
              >
                <TableRow style={{ flex: 10 }}>
                  <TableCell align="left" style={{ flex: 2, color: "white" }}>
                    Flight Name
                  </TableCell>
                  <TableCell align="left" style={{ flex: 2, color: "white" }}>
                    Company
                  </TableCell>
                  <TableCell align="left" style={{ flex: 2, color: "white" }}>
                    Source
                  </TableCell>
                  <TableCell align="left" style={{ flex: 2, color: "white" }}>
                    Destination
                  </TableCell>
                  <TableCell align="left" style={{ flex: 1, color: "white" }}>
                    Price
                  </TableCell>
                  <TableCell align="left" style={{ flex: 1, color: "white" }}>
                    Time
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(state.rows) &&
                  state.rows.length > 0 &&
                  state.rows.map((row) => (
                    <TableRow
                      key={row.flightID}
                      style={{ flex: 10, margin: 8, boxSizing: "border-box" }}
                      onClick={() => {
                        this.handleOpenBookingModel(row);
                      }}
                    >
                      <TableCell align="left" scope="row" style={{ flex: 2 }}>
                        {row.flightName}
                      </TableCell>
                      <TableCell align="left" scope="row" style={{ flex: 2 }}>
                        {row.company}
                      </TableCell>
                      <TableCell align="left" style={{ flex: 2 }}>
                        {row.to}
                      </TableCell>
                      <TableCell align="left" style={{ flex: 2 }}>
                        {row.destination}&nbsp;
                      </TableCell>
                      <TableCell align="left" style={{ flex: 1 }}>
                        {row.price}
                      </TableCell>
                      <TableCell align="left" style={{ flex: 1 }}>
                        {row.time}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div className="Customer-Container-Footer">
          <Pagination
            count={this.state.TotalPages}
            Page={this.state.PageNumber}
            onChange={this.handlePaging}
            variant="outlined"
            shape="rounded"
            color="secondary"
          />
        </div>

        <Modal
          open={this.state.OpenTicketBookingModel}
          onClose={this.handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
          className="Model-Create-Ticket"
        >
          <Fade in={this.state.OpenTicketBookingModel}>
            <div className="Model-Create-Book-Main">
              <div className="Model-Create-Ticket-Header">
                <div className="Model-Create-Ticket-Header-Text">
                  Ticket Details
                </div>
              </div>
              <div className="Model-Create-Ticket-Body">
                <div className="Model-Create-Ticket-Body-Row">
                  Flight ID :
                  <div style={{ color: "red" }}>&nbsp;{state.FlightID}</div>
                </div>
                <div className="Model-Create-Ticket-Body-Row">
                  Flight Name :{" "}
                  <div style={{ color: "red" }}>&nbsp;{state.FlightName}</div>
                </div>
                <div className="Model-Create-Ticket-Body-Row">
                  Flight Company :{" "}
                  <div style={{ color: "red" }}>&nbsp;{state.Company}</div>
                </div>
                <div className="Model-Create-Ticket-Body-Row">
                  Flight Price :{" "}
                  <div style={{ color: "red" }}>
                    &nbsp;
                    {state.FlightPriceOperational} &#8377;
                  </div>
                </div>
                <div className="Model-Create-Ticket-Body-Row">
                  Source : <div style={{ color: "red" }}>&nbsp;{state.To}</div>
                </div>
                <div className="Model-Create-Ticket-Body-Row">
                  Destination :&nbsp;
                  <div style={{ color: "red" }}>{state.Destination}</div>
                </div>
                <div className="Model-Create-Ticket-Body-Row">
                  Flight Time :&nbsp;{" "}
                  <div style={{ color: "red" }}>{state.Time}</div>
                </div>
                <div className="Model-Create-Ticket-Body-Row">
                  Name :&nbsp;{" "}
                  <div style={{ color: "red" }}>
                    {localStorage.getItem("CustomerFullName")}
                  </div>
                </div>
                <div className="Model-Create-Ticket-Body-Row">
                  Email :&nbsp;{" "}
                  <div style={{ color: "red" }}>
                    {localStorage.getItem("CustomerEmail")}
                  </div>
                </div>
                <div className="Model-Create-Ticket-Body-Row">
                  Seat Class :&nbsp;
                  <RadioGroup
                    name="SeatClass"
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      // margin: "0 0 0 20px",
                      // justifyContent: "center",
                      // alignItems: "center",
                    }}
                    value={state.SeatClass}
                    onChange={this.handleChange}
                  >
                    <FormControlLabel
                      value="economy"
                      control={<Radio />}
                      label="Economy"
                    />
                    <FormControlLabel
                      value="business"
                      control={<Radio />}
                      label="Business"
                    />
                  </RadioGroup>
                </div>
                <div className="Model-Create-Ticket-Body-Row">
                  Date :&nbsp;{" "}
                  <TextField
                    variant="outlined"
                    // label=""
                    name="Date"
                    type="date"
                    style={{ margin: "0 10px 15px 0", width: "60%" }}
                    size="small"
                    // error={state.ToFlag}
                    value={state.Date}
                    onChange={this.handleSelectDate}
                  />
                </div>
                <div className="Model-Create-Ticket-Body-Row">
                  Available Seat :&nbsp;{" "}
                  <div style={{ color: "red" }}>{state.AvailableSeats}</div>
                </div>
              </div>
              <div className="Model-Create-Ticket-Footer">
                <Button
                  // variant="contained"
                  style={{ margin: "10px" }}
                  onClick={() => {
                    this.handleClose();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  // disabled={!state.IsPayment}
                  variant="contained"
                  color="primary"
                  style={{
                    backgroundColor: "#ff0000",
                    width: 100,
                    margin: "0px 0 0 10px",
                    color: "white",
                    display: state.IsPayment ? "block" : "none",
                  }}
                  onClick={() => {
                    this.handleOpenGetwayModel();
                  }}
                >
                  Payment
                </Button>
              </div>
            </div>
          </Fade>
        </Modal>

        <Modal
          open={this.state.OpenGetwayModel}
          onClose={this.handleClose1}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
          className="Model-Create-Ticket"
        >
          <Fade in={this.state.OpenGetwayModel}>
            <div className="Model-Open-Getway-Main">
              <div
                className="Model-Create-Ticket-Header"
                style={{ height: 100 }}
              >
                <div className="Model-Open-Getway-Header-Text">
                  Payment Detail
                </div>
              </div>
              <div className="Model-Open-Getway-Body">
                <div style={{ display: "flex" }}>
                  <div className="Model-Create-Ticket-Body-Row">
                    Flight ID :
                    <div style={{ color: "red" }}>&nbsp;{state.FlightID}</div>
                  </div>
                  <div className="Model-Create-Ticket-Body-Row">
                    Flight Name :{" "}
                    <div style={{ color: "red" }}>&nbsp;{state.FlightName}</div>
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  <div className="Model-Create-Ticket-Body-Row">
                    Flight Price :{" "}
                    <div style={{ color: "red" }}>
                      &nbsp;
                      {state.FlightPriceOperational} &#8377;
                    </div>
                  </div>
                  <div className="Model-Create-Ticket-Body-Row">
                    Flight Time :&nbsp;{" "}
                    <div style={{ color: "red" }}>{state.Time}</div>
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  <div className="Model-Create-Ticket-Body-Row">
                    Source :{" "}
                    <div style={{ color: "red" }}>&nbsp;{state.To}</div>
                  </div>
                  <div className="Model-Create-Ticket-Body-Row">
                    Destination :&nbsp;
                    <div style={{ color: "red" }}>{state.Destination}</div>
                  </div>
                </div>

                <div className="Model-Create-Ticket-Body-Row">
                  Name :&nbsp;{" "}
                  <div style={{ color: "red" }}>
                    {localStorage.getItem("CustomerFullName")}
                  </div>
                </div>
                <div
                  style={{ display: "flex" }}
                  className="Model-Create-Ticket-Body-Row"
                >
                  Payment Mode :
                  <RadioGroup
                    name="PaymentMode"
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      margin: "0 0 0 20px",
                      // justifyContent: "center",
                      // alignItems: "center",
                    }}
                    value={state.PaymentMode}
                    onChange={this.handleChange}
                  >
                    <FormControlLabel
                      value="card"
                      control={<Radio />}
                      label="Card"
                    />
                    <FormControlLabel
                      value="cash"
                      control={<Radio />}
                      label="Cash"
                    />
                    <FormControlLabel
                      value="upi"
                      control={<Radio />}
                      label="UPI"
                    />
                  </RadioGroup>
                </div>
                <div className="CartDetail">
                  {state.PaymentMode !== "cash" ? (
                    <TextField
                      variant="outlined"
                      size="small"
                      label={
                        state.PaymentMode === "card"
                          ? "Card Number"
                          : "UPI Number"
                      }
                      name={state.PaymentMode === "card" ? "Card" : "UPI"}
                      style={{ margin: "5px 0 20px 0" }}
                      error={state.PaymentFlag}
                      value={
                        state.PaymentMode === "card" ? state.Card : state.UPI
                      }
                      onChange={this.handleChange}
                    />
                  ) : null}
                </div>
              </div>
              <div className="Model-Open-Getway-Footer">
                <Button
                  // variant="contained"
                  style={{ margin: "10px" }}
                  onClick={() => {
                    this.handleClose1();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  style={{
                    backgroundColor: "#ff0000",
                    width: 100,
                    margin: "0px 0 0 10px",
                    color: "white",
                  }}
                  onClick={() => {
                    this.handleCoonfirmBook();
                  }}
                >
                  Book
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
          }}
        >
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
                onClick={this.handleSnackBarClose}
              >
                UNDO
              </Button>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={this.handleSnackBarClose}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
        />
      </div>
    );
  }
}
