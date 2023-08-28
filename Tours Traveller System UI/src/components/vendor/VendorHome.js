import React, { Component } from "react";
import "./VendorHome.scss";
import { VendorDataServices } from "../../services/VendorDataServices";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Pagination from "@material-ui/lab/Pagination";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";

export default class VendorHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      VendorID: 0,
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
      Position: "",
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
      //
      FlightID: 0,
      FlightName: "",
      To: "",
      Destination: "",
      FlightPrice: "",
      Company: "",
      Time: "",
      FlightDescription: "",
      //
      FlightNameFlag: false,
      ToFlag: false,
      DestinationFlag: false,
      FlightPriceFlag: false,
      CompanyFlag: false,
      TimeFlag: false,
      FlightDescriptionFlag: false,
      //
      Message: "",
      OpenSnackBar: false,
      OpenLoader: false,
      //
      PageNumber: 1,
      TotalPage: 0,
      Type: "Nall",
      rows: [],
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
      userID: Number(localStorage.getItem("VendorID")),
    };

    VendorDataServices.GetFlightDetails(data)
      .then((data) => {
        console.log("GetFlightDetails Data : ", data);
        this.setState({ rows: data.data.reverse(), TotalPage: data.totalPage });
      })
      .catch((error) => {
        console.log("GetFlightDetails Error : ", error);
      });
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState(
      { [name]: value },
      console.log("name : ", name, "Value : ", value)
    );
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

  handleInfoSubmit = async () => {
    console.log("handleInfoSubmit Calling .... ");
    if (await this.CheckValidity()) {
      this.setState({ Message: "Enter Required Filled", OpenSnackBar: true });
      return;
    }
    let state = this.state;
    // let data = {
    //   userID: state.TechnicianID,
    //   firstName: state.FirstName,
    //   lastName: state.LastName,
    //   address: state.Address,
    //   city: state.City,
    //   state: state.State,
    //   zipCode: state.ZipCode,
    //   homePhone: state.HomePhone,
    //   personalNumber: state.PersonalNumber,
    //   email: state.Email,
    //   gender: state.Gender,
    //   dob: state.DateOfBirth,
    //   position: state.Position,
    // };
    // TechnicianDataServices.UpdateTechnicianAddress(data)
    //   .then((data) => {
    //     // debugger;
    //     console.log("UpdateTechnicianAddress Data : ", data);
    //     this.setState({
    //       Message: data.message,
    //       OpenSnackBar: true,
    //     });
    //   })
    //   .then((error) => {
    //     // debugger;
    //     console.log("UpdateTechnicianAddress Error : ", error);
    //     // this.setState({
    //     //   Message: "Something Went Wrong",
    //     //   OpenSnackBar: true,
    //     // });
    //   });
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
      <div className="Vendor-Container">
        <div className="Vendor-Container-Header">Vendor Home</div>
        <div className="Vendor-Container-Body">
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
                    <TableRow key={row.flightID} style={{ flex: 10 }}>
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
                      {/* <TableCell
                        align="center"
                        style={{ flex: 1 }}
                      >
                        <IconButton
                          variant="outlined"
                          color="primary"
                          size="medium"
                          onClick={() => {
                            self.handleCopyData(row);
                          }}
                        >
                          <EditIcon size="medium" />
                        </IconButton>
                        <IconButton
                          variant="outlined"
                          style={{ color: "black" }}
                          onClick={() => {
                            self.handleDeleteProduct(row.productID);
                          }}
                        >
                          <DeleteIcon size="medium" />
                        </IconButton>
                      </TableCell> */}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div className="Vendor-Container-Footer">
          <Pagination
            count={this.state.TotalPage}
            Page={this.state.PageNumber}
            onChange={this.handlePaging}
            variant="outlined"
            shape="rounded"
            color="secondary"
          />
        </div>

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
