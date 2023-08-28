import React, { Component } from "react";
import "./Packages.scss";
import { AdminDataServices } from "../../services/AdminDataServices";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Pagination from "@material-ui/lab/Pagination";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import ReactFileReader from "react-file-reader";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";

export default class Packages extends Component {
  constructor() {
    super();
    this.state = {
      rows: [],
      //
      PageNumber: 1,
      TotalPages: 0,

      Image: null,
      File: new FormData(),
      FileName: "",
      FileExist: false,
      //
      ProductID: 0,
      ProductName: "",
      ProductPrice: "",
      ProductType: "",
      ProductDescription: "",
      PublicID: "",
      PlanType: "all",
      //
      ProductImageFlag: false,
      ProductNameFlag: false,
      ProductPriceFlag: false,
      ProductTypeFlag: false,
      ProductDescriptionFlag: false,
      //
      OpenSnackBar: false,
      Message: "",
      OpenLoader: false,
      Update: false,
    };
  }

  componentWillMount() {
    console.log("Package componentWillMount Calling ....");
    this.GetAllUserList(this.state.PageNumber);
  }

  GetAllUserList = (PageNumber) => {
    let data = {
      pageNumber: PageNumber,
      numberOfRecordPerPage: 5,
    };
    AdminDataServices.GetAllUserList(data)
      .then((data) => {
        console.log("GetAllUserList Data : ", data);
        this.setState({
          rows: data.data.reverse(),
          TotalPages: data.TotalPage,
        });
      })
      .catch((error) => {
        console.log("GetAllUserList Error : ", error);
      });
  };

  handlePaging = async (e, value) => {
    console.log("Current Page : ", value);
    this.GetAllUserList(value);
  };

  handleActiveAndDeactiveAccount = (UserID, Flag1, Flag2) => {
    // debugger;
    this.setState({ OpenLoader: true });
    let data = {
      userID: UserID,
      block: Flag1,
      unblock: Flag2,
    };
    AdminDataServices.ManupulateCustomerAccount(data)
      .then((data) => {
        console.log("ManupulateCustomerAccount Data : ", data);
        this.setState({
          OpenSnackBar: true,
          Message: data.message,
          OpenLoader: false,
        });
        this.GetAllUserList(this.state.PageNumber);
      })
      .catch((error) => {
        console.log("ManupulateCustomerAccount Error : ", error);
        this.setState({
          OpenSnackBar: true,
          Message: "Something Went Wrong",
          OpenLoader: false,
        });
        this.GetAllUserList(this.state.PageNumber);
      });
  };

  handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ OpenSnackBar: false });
  };

  handleCapture = (event) => {
    const reader = new FileReader();
    reader.onload = () => {
      this.setState({ Image: reader.result });
    };
    reader.readAsDataURL(event.target.files[0]);
    this.setState({ File: event.target.files[0] });
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState(
      { [name]: value },
      console.log("name : ", name, "Value : ", value)
    );
  };

  CheckValidity = () => {
    console.log("Check Validity Calling....");
    let State = this.state;
    let Value = false;
    this.setState({
      ProductNameFlag: false,
      ProductPriceFlag: false,
      ProductTypeFlag: false,
      ProductDescriptionFlag: false,
      ProductImageFlag: false,
    });

    if (State.ProductName === "") {
      this.setState({ ProductNameFlag: true });
      Value = true;
    }

    if (State.ProductPrice === "") {
      this.setState({ ProductPriceFlag: true });
      Value = true;
    }

    if (State.ProductType === "") {
      this.setState({ ProductTypeFlag: true });
      Value = true;
    }

    if (State.Image === null) {
      this.setState({ ProductImageFlag: true });
      Value = true;
    }

    return Value;
  };

  handlePaging = async (e, value) => {
    console.log("Current Page : ", value);
    this.GetAllProduct(value, this.state.PlanType);
  };

  render() {
    let state = this.state;
    let self = this;
    console.log("State : ", state);
    return (
      <div className="Packages-Container">
        <div className="Admin-Packages-Header">Customer Account Setting</div>
        <div className="Admin-Packages-Body">
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
                    UserID
                  </TableCell>
                  <TableCell align="left" style={{ flex: 2, color: "white" }}>
                    User Name
                  </TableCell>
                  <TableCell align="left" style={{ flex: 2, color: "white" }}>
                    Role
                  </TableCell>
                  <TableCell align="left" style={{ flex: 2, color: "white" }}>
                    EmailID
                  </TableCell>
                  <TableCell align="left" style={{ flex: 2, color: "white" }}>
                    Account Status
                  </TableCell>
                  <TableCell
                    align="left"
                    style={{ flex: 2, color: "white" }}
                  ></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(state.rows) &&
                  state.rows.length > 0 &&
                  state.rows.map((row) => (
                    <TableRow key={row.userID} style={{ flex: 10 }}>
                      <TableCell align="left" scope="row" style={{ flex: 2 }}>
                        {row.userID}
                      </TableCell>
                      <TableCell align="left" scope="row" style={{ flex: 2 }}>
                        {row.firstName + " " + row.lastName}
                      </TableCell>
                      <TableCell align="left" style={{ flex: 2 }}>
                        {row.role}
                      </TableCell>
                      <TableCell align="left" style={{ flex: 2 }}>
                        {row.email}&nbsp;
                      </TableCell>
                      <TableCell align="left" style={{ flex: 2 }}>
                        {row.count > 4 ? <>DeActivate</> : <>Activate</>}&nbsp;
                      </TableCell>
                      <TableCell align="center" style={{ flex: 2 }}>
                        {row.count > 4 ? (
                          <Button
                            variant="outlined"
                            color="primary"
                            style={{ margin: "0 5px" }}
                            onClick={() => {
                              self.handleActiveAndDeactiveAccount(
                                row.userID,
                                false,
                                true
                              );
                            }}
                          >
                            Activate
                          </Button>
                        ) : (
                          <Button
                            variant="outlined"
                            style={{ color: "black" }}
                            onClick={() => {
                              self.handleActiveAndDeactiveAccount(
                                row.userID,
                                true,
                                false
                              );
                            }}
                          >
                            Deactivate
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div className="Admin-Packages-Footer">
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
