import React, { Component } from "react";
import "./TourPack.scss";
import { VendorDataServices } from "../../services/VendorDataServices";
import { AdminDataServices } from "../../services/AdminDataServices";
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
import DeleteIcon from "@material-ui/icons/Delete";
import TextField from "@material-ui/core/TextField";
import Modal from "@material-ui/core/Modal";
import Fade from "@material-ui/core/Fade";
import VisibilityIcon from "@material-ui/icons/Visibility";

export default class TourPack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Open: false,
      OpenViewPackageList: false,

      rows: [],
      rows1: [],
      packageRow: [],
      PackageList: [],

      TotalPackagePrice: 0,

      Type: "all",
      PackageName: "",
      Destination: "",
      Source: "",
      Message: "",

      OpenLoader: false,
      OpenSnackBar: false,
      PackageNameFlag: false,
    };
  }

  componentDidMount() {
    this.GetFlightDetails(1);
    this.GetPackage();
  }

  GetPackage = () => {
    AdminDataServices.GetPackage()
      .then((data) => {
        console.log("Data : ", data);
        debugger;
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

  GetFlightDetails = (PageNumber) => {
    let data = {
      pageNumber: PageNumber,
      numberOfRecordPerPage: 1000,
      type: this.state.Type,
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

  handleOpenModel = () => {
    this.setState({
      Open: true,
      rows1: [],
      packageRow: [],

      PackageName: "",
      Destination: "",
      Source: "",
    });
  };

  handleClose = () => {
    console.log("Handle Close Calling ...");
    this.setState({
      Open: false,
    });
  };

  handleAddPackage = (data) => {
    console.log("Data : ", data);
    let List = this.state.rows1;
    List.push(data);
    const uniqueArray = List.filter((value, index) => {
      const _value = JSON.stringify(value);
      return (
        index ===
        List.findIndex((obj) => {
          return JSON.stringify(obj) === _value;
        })
      );
    });
    //TotalPackagePrice

    var Sum = 0;
    for (let index = 0; index < uniqueArray.length; index++) {
      Sum += uniqueArray[index].price;
    }

    this.setState({
      rows1: uniqueArray,
      Source: List[0].to,
      Destination: data.destination,
      TotalPackagePrice: Sum,
    });

    console.log("Row1 : ", uniqueArray);
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

  handleRemovePackage = (flightID, price) => {
    debugger;
    var List = this.state.rows1;
    List = List.filter((x) => x.flightID !== flightID);

    this.setState({
      rows1: List.length === 0 ? [] : List,
      Source: List.length === 0 ? "" : List[0].to,
      Destination: List.length === 0 ? "" : List[List.length - 1].destination,
      TotalPackagePrice:
        List.length === 0 ? 0 : this.state.TotalPackagePrice - Number(price),
    });
  };

  handleInfoSubmit = () => {
    debugger;
    this.setState({
      PackageNameFlag: false,
      OpenSnackBar: false,
      Message: "",
    });

    if (!this.state.PackageName) {
      this.setState({
        PackageNameFlag: true,
        OpenSnackBar: true,
        Message: "Please Enter Package Name",
      });
      return;
    }
    if (this.state.rows1.length === 0) {
      this.setState({
        OpenSnackBar: true,
        Message: "Please Enter Package Name",
      });
      return;
    }

    var Sum = 0;
    for (let index = 0; index < this.state.rows1.length; index++) {
      Sum += this.state.rows1[index].price;
    }

    let data = {
      packageName: this.state.PackageName,
      packageList: JSON.stringify(this.state.rows1),
      source: this.state.Source,
      destination: this.state.Destination,
      totalPrice: Sum,
    };

    AdminDataServices.AddPackage(data)
      .then((data) => {
        console.log("Data : ", data);
        this.setState({
          OpenSnackBar: true,
          Message: data.message,
          Open: false,
          rows1: [],
        });
        this.GetPackage();
      })
      .catch((error) => {
        console.error("Error : ", error);
        this.setState({
          OpenSnackBar: true,
          Message: "Something went wrong",
        });
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

  render() {
    let state = this.state;
    let self = this;
    return (
      <div className="Container">
        <div className="TourPack-Header">
          <div className="subHeaderText">Packages</div>
          <a
            className="btn btn-info"
            onClick={() => {
              this.handleOpenModel();
            }}
          >
            Add Tour Pack
          </a>
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
                    Total Price
                  </TableCell>
                  <TableCell
                    style={{ fontSize: 16, flex: 1 }}
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
                        <TableCell align="left" style={{ flex: 1, padding: 0 }}>
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
          open={this.state.Open}
          onClose={this.handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
          className="Model-Create-Tour"
        >
          <Fade in={this.state.Open}>
            <div className="Model-Create-Tour-Main">
              <div className="Model-Create-Tour-Header">
                <div className="Model-Create-Tour-Header-Text">Add Package</div>
              </div>
              <div className="Model-Create-Tour-Body">
                <div>
                  <TextField
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
                  <div className="me-1" style={{ width: "55%" }}>
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
                            <TableCell
                              align="left"
                              style={{ flex: 2, color: "white" }}
                            >
                              Price
                            </TableCell>
                            <TableCell
                              align="left"
                              style={{ flex: 2, color: "white" }}
                            ></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody className="FirstList">
                          {Array.isArray(state.rows) &&
                            state.rows.length > 0 &&
                            state.rows.map((row) => (
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
                                <TableCell align="left" style={{ flex: 2 }}>
                                  {row.price}&nbsp;
                                </TableCell>
                                <TableCell align="left" style={{ flex: 2 }}>
                                  <a
                                    className="btn btn-primary"
                                    onClick={() => {
                                      this.handleAddPackage(row);
                                    }}
                                  >
                                    Add
                                  </a>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                  <div className="ms-1" style={{ width: "44%" }}>
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
                            <TableCell
                              align="left"
                              style={{ flex: 2 }}
                            ></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody className="SecondList">
                          {Array.isArray(state.rows1) &&
                            state.rows1.length > 0 &&
                            state.rows1.map((row) => (
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
                                <TableCell align="left" style={{ flex: 2 }}>
                                  <a
                                    className="btn btn-danger"
                                    onClick={() => {
                                      this.handleRemovePackage(
                                        row.flightID,
                                        row.price
                                      );
                                    }}
                                  >
                                    Remove
                                  </a>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </div>
              </div>
              <div className="Model-Create-Tour-Footer">
                <div style={{ width: 300 }}>Source : {this.state.Source} </div>
                <div style={{ width: 300 }}>
                  Destination : {this.state.Destination}{" "}
                </div>
                <div style={{ width: 300 }}>
                  Total Price : {this.state.TotalPackagePrice}{" "}
                </div>
                <Button
                  variant="contained"
                  style={{ margin: "10px" }}
                  onClick={() => {
                    this.handleClose();
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
                    this.handleInfoSubmit();
                  }}
                >
                  Add Package
                </Button>
              </div>
            </div>
          </Fade>
        </Modal>

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
          className="Model-Create-Tour"
        >
          <Fade in={this.state.OpenViewPackageList}>
            <div className="Model-Create-Tour-Main">
              <div className="Model-Create-Tour-Header">
                <div className="Model-Create-Tour-Header-Text">
                  Package List
                </div>
              </div>
              <div className="Model-Create-Tour-Body">
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
                          <TableCell
                            align="left"
                            style={{ flex: 2, color: "white" }}
                          >
                            Price
                          </TableCell>
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
                              <TableCell align="left" style={{ flex: 2 }}>
                                {row.price}&nbsp;
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
              <div className="Model-Create-Tour-Footer">
                <div style={{ width: 300 }}>Source : {this.state.Source} </div>
                <div style={{ width: 300 }}>
                  Destination : {this.state.Destination}{" "}
                </div>
                <div style={{ width: 300 }}>
                  Total Price : {this.state.TotalPackagePrice}{" "}
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
