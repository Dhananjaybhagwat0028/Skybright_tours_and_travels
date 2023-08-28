import React, { Component } from "react";
import "./TourPackage.scss";
import { CustomerDataServices } from "./../../services/CustomerDataServices.js";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import Paper from "@material-ui/core/Paper";
import Pagination from "@material-ui/lab/Pagination";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import Button from "@material-ui/core/Button";
import Backdrop from "@material-ui/core/Backdrop";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import TextField from "@material-ui/core/TextField";
import Modal from "@material-ui/core/Modal";
import Fade from "@material-ui/core/Fade";
import VisibilityIcon from "@material-ui/icons/Visibility";

export default class TourPackage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Open: false,
      OpenViewPackageList: false,
      OpenAddPackageList: false,

      rows: [],
      rows1: [],
      packageRow: [],
      PackageList: [],
      Type: "all",
      PackageName: "",
      Destination: "",
      Source: "",
      Message: "",
      TotalPackagePrice: 0,
      FlightTourPriceOperational: 0,
      PaymentMode: "cash",
      Card: "",
      UPI: "",
      FlightDate: "",
      SeatClass: "economy",

      OpenLoader: false,
      OpenSnackBar: false,
      PackageNameFlag: false,
      FlightDateFlag: false,
    };
  }
  componentDidMount() {
    this.GetPackage();
  }

  handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ OpenSnackBar: false });
  };

  GetPackage = () => {
    CustomerDataServices.GetPackage()
      .then((data) => {
        console.log("Data : ", data);
        if (data.data) {
          this.setState({
            packageRow: data.data,
          });
        }
      })
      .catch((error) => {
        console.error("Error : ", error);
      });
  };

  ViewPackageList = (data) => {
    debugger;
    let List = JSON.stringify(data.packageList);
    this.setState({
      PackageName: data.packageName,
      Destination: data.destination,
      Source: data.source,
      PackageList: JSON.parse(data.packageList),
      OpenViewPackageList: true,
      TotalPackagePrice: data.totalPrice,
    });
  };

  handleAddPackage = (data) => {
    let List = JSON.stringify(data.packageList);
    this.setState({
      OpenAddPackageList: true,
      PackageName: data.packageName,
      Destination: data.destination,
      Source: data.source,
      PackageList: JSON.parse(data.packageList),
      PackageID: data.packageID,
      FlightTourPriceOperational: data.totalPrice,
      TotalPackagePrice: data.totalPrice,
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
          FlightTourPriceOperational:
            Number(this.state.FlightTourPriceOperational) + 1000,
        });
      } else {
        this.setState({
          FlightTourPriceOperational: this.state.TotalPackagePrice,
        });
      }
    }
  };

  handleSubmitAddPackage = () => {
    this.setState({
      PaymentFlag: false,
      OpenSnackBar: false,
      FlightDateFlag: false,
      Message: "",
    });
    let Value = false;
    if (
      this.state.PaymentMode.toLocaleLowerCase() !== "cash" &&
      (!(
        this.state.PaymentMode.toLocaleLowerCase() === "card" && this.state.Card
      ) ||
        (this.state.PaymentMode.toLocaleLowerCase() === "upi" &&
          this.state.UPI))
    ) {
      this.setState({
        PaymentFlag: true,
        OpenSnackBar: true,
        Message: "Please Enter Required Field",
      });
      Value = true;
    }

    if (!this.state.FlightDate) {
      this.setState({
        FlightDateFlag: true,
        OpenSnackBar: true,
        Message: "Please Enter Required Field",
      });
      Value = true;
    }

    if (Value) {
      return;
    }

    debugger;

    let data = {
      userID: Number(localStorage.getItem("CustomerID")),
      packageID: this.state.PackageID,
      flightDate: this.state.FlightDate,
      seatClass: this.state.SeatClass,
      paymentType: this.state.PaymentMode,
      cartNo: this.state.Card,
      upiid: this.state.UPI,
      price: this.state.FlightTourPriceOperational,
      status: "Booked",
      packageName: this.state.PackageName,
      source: this.state.Source,
      destination: this.state.Destination,
    };

    CustomerDataServices.AddTourPackage(data)
      .then((data) => {
        console.log("Data : ", data);
        this.setState({
          OpenAddPackageList: false,
          OpenSnackBar: true,
          Message: data.message,
        });
      })
      .catch((error) => {
        console.error("Error : ", error);
        this.setState({
          OpenSnackBar: true,
          Message: "Something went wrong",
        });
      });
  };

  render() {
    let state = this.state;
    let self = this;
    return (
      <div className="TourPackage-Container">
        <div className="TourPack-Header">
          <div className="subHeaderText">Packages</div>
        </div>
        <div className="TourPack-Body p-2">
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead
                style={{
                  width: "100%",
                  backgroundColor: "#202020",
                }}
              >
                <TableRow style={{ display: "flex" }}>
                  <TableCell
                    style={{ fontSize: 16, flex: 2, color: "white" }}
                    align="left"
                  >
                    Id
                  </TableCell>
                  <TableCell
                    style={{ fontSize: 16, flex: 2, color: "white" }}
                    align="left"
                  >
                    Package Name
                  </TableCell>
                  <TableCell
                    style={{ fontSize: 16, flex: 2, color: "white" }}
                    align="left"
                  >
                    Source
                  </TableCell>
                  <TableCell
                    style={{ fontSize: 16, flex: 2, color: "white" }}
                    align="left"
                  >
                    Destination
                  </TableCell>
                  <TableCell
                    style={{ fontSize: 16, flex: 2, color: "white" }}
                    align="left"
                  >
                    Package Price
                  </TableCell>
                  <TableCell
                    style={{ fontSize: 16, flex: 2 }}
                    align="left"
                  ></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(state.packageRow) && state.packageRow.length > 0
                  ? state.packageRow.map((row) => (
                      <TableRow key={row.packageID} style={{ display: "flex" }}>
                        <TableCell
                          align="left"
                          component="th"
                          scope="row"
                          style={{ flex: 2 }}
                        >
                          {row.packageID}
                        </TableCell>
                        <TableCell align="left" style={{ flex: 2 }}>
                          {row.packageName}
                        </TableCell>
                        <TableCell align="left" style={{ flex: 2 }}>
                          {row.source}
                        </TableCell>
                        <TableCell align="left" style={{ flex: 2 }}>
                          {row.destination}
                        </TableCell>
                        <TableCell align="left" style={{ flex: 2 }}>
                          {row.totalPrice}
                        </TableCell>
                        <TableCell align="left" style={{ flex: 2, padding: 0 }}>
                          <IconButton
                            variant="outlined"
                            style={{ color: "black" }}
                            size="medium"
                            onClick={() => {
                              self.ViewPackageList(row);
                            }}
                          >
                            <VisibilityIcon size="medium" />
                          </IconButton>
                          <div
                            className="btn btn-info"
                            color="primary"
                            style={{
                              fontSize: 12,
                              //backgroundColor: "#21007F",
                              // width: 200,
                              margin: "8px 0 0 10px",
                              // color: "black",
                            }}
                            onClick={() => {
                              this.handleAddPackage(row);
                            }}
                          >
                            Buy Package
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  : null}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div className="TourPack-Footer"></div>

        <Modal
          open={this.state.OpenViewPackageList}
          onClose={() => {
            this.setState({ OpenViewPackageList: false });
          }}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
          className="Model-Create-TourPackage"
        >
          <Fade in={this.state.OpenViewPackageList}>
            <div className="Model-Create-TourPackage-Main">
              <div className="Model-Create-TourPackage-Header">
                <div className="Model-Create-TourPackage-Header-Text">
                  Package List
                </div>
              </div>
              <div className="Model-Create-TourPackage-Body">
                <div>
                  <TextField
                    disabled
                    label="Package Name"
                    type="text"
                    name="PackageName"
                    fullWidth
                    style={{ margin: "0 0 15px 0" }}
                    error={state.PackageNameFlag}
                    value={state.PackageName}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="d-flex" style={{ width: "100%" }}>
                  <TableContainer component={Paper}>
                    <Table className="" aria-label="simple table">
                      <TableHead
                        style={{
                          width: "100%",
                          backgroundColor: "#202020",
                        }}
                      >
                        <TableRow style={{ flex: 10 }}>
                          <TableCell
                            align="left"
                            style={{ flex: 2, color: "white" }}
                          >
                            Flight Name
                          </TableCell>
                          <TableCell
                            align="left"
                            style={{ flex: 2, color: "white" }}
                          >
                            Company
                          </TableCell>
                          <TableCell
                            align="left"
                            style={{ flex: 2, color: "white" }}
                          >
                            Source
                          </TableCell>
                          <TableCell
                            align="left"
                            style={{ flex: 2, color: "white" }}
                          >
                            Destination
                          </TableCell>
                          {/* <TableCell
                            align="left"
                            style={{ flex: 2, color: "white" }}
                          ></TableCell> */}
                        </TableRow>
                      </TableHead>
                      <TableBody className="FirstList">
                        {Array.isArray(state.PackageList) &&
                          state.PackageList.length > 0 &&
                          state.PackageList.map((row) => (
                            <TableRow key={row.flightID} style={{ flex: 10 }}>
                              <TableCell
                                align="left"
                                scope="row"
                                style={{ flex: 2 }}
                              >
                                {row.flightName}
                              </TableCell>
                              <TableCell
                                align="left"
                                scope="row"
                                style={{ flex: 2 }}
                              >
                                {row.company}
                              </TableCell>
                              <TableCell align="left" style={{ flex: 2 }}>
                                {row.to}
                              </TableCell>
                              <TableCell align="left" style={{ flex: 2 }}>
                                {row.destination}&nbsp;
                              </TableCell>
                              {/* <TableCell align="left" style={{ flex: 2 }}>
                                <a
                                  className="btn btn-primary"
                                  onClick={() => {
                                    this.handleAddPackage(row);
                                  }}
                                >
                                  Add
                                </a>
                              </TableCell> */}
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </div>
              <div className="Model-Create-TourPackage-Footer">
                <div style={{ width: 300 }}>Source : {this.state.Source} </div>
                <div style={{ width: 300 }}>
                  Destination : {this.state.Destination}{" "}
                </div>
                <div style={{ width: 300 }}>
                  Price : {this.state.TotalPackagePrice}{" "}
                </div>
                <Button
                  variant="contained"
                  style={{ margin: "10px" }}
                  onClick={() => {
                    this.setState({ OpenViewPackageList: false });
                  }}
                >
                  Cancel
                </Button>
                {/* <Button
                  variant="contained"
                  color="primary"
                  style={{
                    backgroundColor: "#21007F",
                    width: 200,
                    margin: "0px 0 0 10px",
                    color: "white",
                  }}
                  onClick={() => {
                    this.handleInfoSubmit();
                  }}
                >
                  Add Package
                </Button> */}
              </div>
            </div>
          </Fade>
        </Modal>

        <Modal
          open={this.state.OpenAddPackageList}
          onClose={() => {
            this.setState({ OpenAddPackageList: false });
          }}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
          className="Model-Create-TourPackage"
        >
          <Fade in={this.state.OpenAddPackageList}>
            <div className="Model-Create-TourPackage-Main">
              <div className="Model-Create-TourPackage-Header">
                <div className="Model-Create-TourPackage-Header-Text">
                  Package Payment Getway
                </div>
              </div>
              <div style={{ width: "100%", height: "100%" }} className="d-flex">
                <div
                  className="Model-Create-TourPackage-Body border"
                  style={{ width: "50%", height: "100%" }}
                >
                  <div>
                    <TextField
                      disabled
                      label="Package Name"
                      type="text"
                      name="PackageName"
                      fullWidth
                      style={{ margin: "0 0 15px 0" }}
                      error={state.PackageNameFlag}
                      value={state.PackageName}
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="d-flex" style={{ width: "100%" }}>
                    <TableContainer component={Paper}>
                      <Table className="" aria-label="simple table">
                        <TableHead
                          style={{
                            width: "100%",
                            backgroundColor: "#202020",
                          }}
                        >
                          <TableRow style={{ flex: 10 }}>
                            <TableCell
                              align="left"
                              style={{ flex: 2, color: "white" }}
                            >
                              Flight Name
                            </TableCell>
                            <TableCell
                              align="left"
                              style={{ flex: 2, color: "white" }}
                            >
                              Company
                            </TableCell>
                            <TableCell
                              align="left"
                              style={{ flex: 2, color: "white" }}
                            >
                              Source
                            </TableCell>
                            <TableCell
                              align="left"
                              style={{ flex: 2, color: "white" }}
                            >
                              Destination
                            </TableCell>
                            {/* <TableCell
                            align="left"
                            style={{ flex: 2, color: "white" }}
                          ></TableCell> */}
                          </TableRow>
                        </TableHead>
                        <TableBody className="FirstList">
                          {Array.isArray(state.PackageList) &&
                            state.PackageList.length > 0 &&
                            state.PackageList.map((row) => (
                              <TableRow key={row.flightID} style={{ flex: 10 }}>
                                <TableCell
                                  align="left"
                                  scope="row"
                                  style={{ flex: 2 }}
                                >
                                  {row.flightName}
                                </TableCell>
                                <TableCell
                                  align="left"
                                  scope="row"
                                  style={{ flex: 2 }}
                                >
                                  {row.company}
                                </TableCell>
                                <TableCell align="left" style={{ flex: 2 }}>
                                  {row.to}
                                </TableCell>
                                <TableCell align="left" style={{ flex: 2 }}>
                                  {row.destination}&nbsp;
                                </TableCell>
                                {/* <TableCell align="left" style={{ flex: 2 }}>
                                <a
                                  className="btn btn-primary"
                                  onClick={() => {
                                    this.handleAddPackage(row);
                                  }}
                                >
                                  Add
                                </a>
                              </TableCell> */}
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </div>
                <div style={{ width: "50%", height: "100%", padding: "50px" }}>
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
                        margin: "10px 0 0 20px",
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
                      <>
                        <div
                          style={{
                            width: "30%",
                            display: "flex",
                            justifyContent: "flex-start",
                            margin: "10px 0 10px 15px",
                            fontWeight: 500,
                          }}
                          className="font-Styles"
                        >
                          Enter Number
                        </div>
                        <div
                          style={{
                            width: "70%",
                            display: "flex",
                            justifyContent: "flex-start",
                          }}
                        >
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
                              state.PaymentMode === "card"
                                ? state.Card
                                : state.UPI
                            }
                            onChange={this.handleChange}
                          />
                        </div>
                      </>
                    ) : null}
                  </div>
                  <div className="CartDetail">
                    <div
                      style={{
                        width: "30%",
                        display: "flex",
                        justifyContent: "flex-start",
                        margin: "10px 0 10px 15px",
                        fontWeight: 500,
                      }}
                      className="font-Styles"
                    >
                      Flight Date
                    </div>
                    <div
                      style={{
                        width: "70%",
                        display: "flex",
                        justifyContent: "flex-start",
                      }}
                    >
                      <TextField
                        variant="outlined"
                        size="small"
                        type="date"
                        name="FlightDate"
                        style={{ margin: "5px 0 20px 0" }}
                        error={state.FlightDateFlag}
                        value={state.FlightDate}
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>
                  <div
                    style={{ display: "flex" }}
                    className="Model-Create-Ticket-Body-Row"
                  >
                    Seat Class :
                    <RadioGroup
                      name="SeatClass"
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        margin: "10px 0 0 65px",
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "flex-start",
                      margin: "20px 0 10px 15px",
                      fontWeight: 500,
                    }}
                    className="font-Styles"
                  >
                    Source Location : {this.state.Source}
                  </div>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "flex-start",
                      margin: "20px 0 10px 15px",
                      fontWeight: 500,
                    }}
                    className="font-Styles"
                  >
                    Destination Location : {this.state.Destination}
                  </div>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "flex-start",
                      margin: "20px 0 10px 15px",
                      fontWeight: 500,
                    }}
                    className="font-Styles"
                  >
                    TotalPackagePrice : {this.state.FlightTourPriceOperational}
                    &nbsp;&#8377;
                  </div>
                </div>
              </div>
              <div className="Model-Create-TourPackage-Footer">
                {/* <div style={{ width: 300 }}>Source : {this.state.Source} </div>
                <div style={{ width: 300 }}>
                  Destination : {this.state.Destination}{" "}
                </div>
                <div style={{ width: 300 }}>
                  Price : {this.state.TotalPackagePrice}{" "}
                </div> */}
                <Button
                  variant="contained"
                  style={{ margin: "10px" }}
                  onClick={() => {
                    this.setState({ OpenAddPackageList: false });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  style={{
                    backgroundColor: "#21007F",
                    width: 200,
                    margin: "0px 0 0 10px",
                    color: "white",
                  }}
                  onClick={() => {
                    this.handleSubmitAddPackage();
                  }}
                >
                  Buy Package
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
