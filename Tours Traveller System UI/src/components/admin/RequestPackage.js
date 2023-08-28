import React, { Component } from "react";
import "./RequestPackage.scss";
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
import { CustomerDataServices } from "../../services/CustomerDataServices";
import { AdminDataServices } from "../../services/AdminDataServices";

export default class RequestPackage extends Component {
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
    this.GetAllTourPackage();
  }

  GetAllTourPackage = () => {
    CustomerDataServices.GetAllTourPackage()
      .then((datas) => {
        console.log("GetUserTourPackage Data : ", datas);
        this.setState({ packageRow: datas.data });
      })
      .catch((error) => {
        console.error("Error : ", error);
      });
  };

  handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ OpenSnackBar: false });
  };

  ChangeTourPackageStatus = async (_packageID, _status, _data) => {
    let data = {
      PackageID: _packageID,
      Status: _status,
    };
    //this.setState({ OpenLoader: true });
    await CustomerDataServices.ChangeTourPackageStatus(data)
      .then((data) => {
        console.log("ChangeTourPackageStatus Data : ", data);
        this.setState({
          OpenSnackBar: true,
          Message: data.message,
        });
        if (_status === "Confirmed") {
          this.EmailService(_data);
        }
        //this.setState({ OpenLoader: false });
        this.GetAllTourPackage();
      })
      .catch((error) => {
        console.log("ChangeTourPackageStatus Error : ", error);
        this.setState({
          OpenLoader: false,
          OpenSnackBar: true,
          Message: "Something Went Wrong",
        });
      });
  };

  EmailService = async (data) => {
    let _data = {
      packageID: data.packageID,
      firstName: data.firstName,
      lastName: data.lastName,
      emailID: data.emailID,
      packageName: data.packageName,
      to: data.source,
      destination: data.destination,
      paymentType: data.paymentType,
      price: data.price,
      status: data.status,
      seatClass: data.seatClass,
    };
    this.setState({ OpenLoader: true });
    await AdminDataServices.EmailService(_data)
      .then((data) => {
        console.log("EmailService Data : ", data);
        this.setState({
          OpenLoader: false,
          OpenSnackBar: true,
          Message: data.message,
        });
      })
      .catch((error) => {
        console.error("EmailService Error : ", error);
        this.setState({
          OpenLoader: false,
          OpenSnackBar: true,
          Message: "Something went wrong",
        });
      });
  };

  render() {
    let state = this.state;
    return (
      <div className="RequestPackage-Container">
        <div className="RequestPackage-Header">
          <div className="subHeaderText">Request Tours</div>
        </div>
        <div className="RequestPackage-Body p-2">
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
                    style={{ fontSize: 16, flex: 2, color: "white" }}
                    align="left"
                  >
                    Ticket Status
                  </TableCell>
                  <TableCell
                    style={{ fontSize: 16, flex: 3 }}
                    align="left"
                  ></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(state.packageRow) && state.packageRow.length > 0
                  ? state.packageRow.map((row) => (
                      <TableRow key={row.pticketID} style={{ display: "flex" }}>
                        <TableCell
                          align="left"
                          component="th"
                          scope="row"
                          style={{ flex: 2 }}
                        >
                          {row.pticketID}
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
                          {row.price}
                        </TableCell>
                        <TableCell align="left" style={{ flex: 2 }}>
                          {row.status}
                        </TableCell>
                        <TableCell align="left" style={{ flex: 3, padding: 0 }}>
                          {row.status !== "Cancelled" ||
                          row.status === "Booked" ? (
                            <>
                              <div
                                className="btn btn-danger mt-2"
                                onClick={() => {
                                  this.ChangeTourPackageStatus(
                                    row.pticketID,
                                    "Cancelled",
                                    row
                                  );
                                }}
                              >
                                Cancel Tour
                              </div>
                            </>
                          ) : null}
                          {row.status !== "Confirmed" ||
                          row.status === "Booked" ? (
                            <div
                              className="btn btn-success mx-1 mt-2"
                              onClick={() => {
                                this.ChangeTourPackageStatus(
                                  row.pticketID,
                                  "Confirmed",
                                  row
                                );
                              }}
                            >
                              Confirm Tour
                            </div>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    ))
                  : null}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div className="RequestPackage-Footer"></div>

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
