import React, { Component } from "react";
import "./MyTour.scss";
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

export default class MyTour extends Component {
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
    this.GetUserTourPackage();
  }

  GetUserTourPackage() {
    let data = localStorage.getItem("CustomerID");
    CustomerDataServices.GetUserTourPackage(data)
      .then((datas) => {
        console.log("GetUserTourPackage Data : ", datas);
        this.setState({ packageRow: datas.data });
      })
      .catch((error) => {
        console.error("Error : ", error);
      });
  }

  ChangeTourPackageStatus = (_packageID, _status) => {
    let data = {
      PackageID: _packageID,
      Status: _status,
    };
    CustomerDataServices.ChangeTourPackageStatus(data)
      .then((data) => {
        console.log("ChangeTourPackageStatus Data : ", data);
        this.setState({
          OpenSnackBar: true,
          Message: data.message,
        });
        this.GetUserTourPackage();
      })
      .catch((error) => {
        console.log("ChangeTourPackageStatus Error : ", error);
        this.setState({
          OpenSnackBar: true,
          Message: "Something Went Wrong",
        });
      });
  };

  render() {
    let state = this.state;
    let self = this;
    return (
      <div className="MyTour-Container">
        <div className="MyTour-Header">
          <div className="subHeaderText">My Tours</div>
        </div>
        <div className="MyTour-Body p-2">
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
                    style={{ fontSize: 16, flex: 2 }}
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
                        <TableCell align="left" style={{ flex: 2, padding: 0 }}>
                          {row.status !== "Cancelled" ? (
                            <div
                              className="btn btn-danger mt-2"
                              onClick={() => {
                                this.ChangeTourPackageStatus(
                                  row.pticketID,
                                  "Cancelled"
                                );
                              }}
                            >
                              Cancel Tour
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
        <div className="MyTour-Footer"></div>

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
