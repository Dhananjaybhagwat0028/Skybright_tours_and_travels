import React, { Component } from "react";
import "./History.scss";
import { CustomerDataServices } from "../../services/CustomerDataServices";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Pagination from "@material-ui/lab/Pagination";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

export default class History extends Component {
  constructor() {
    super();
    this.state = {
      rows: [],
      //
      PageNumber: 1,
      TotalPage: 0,
      //
      TicketID: "",
      InsertionDate: "",
      //UserID: localStorage.getItem("CustomerID"),
      UserID: -1,
      Summary: "",
      PlanType: "",
      RaiseType: "",
      Assigner: "",
      Reportor: "",
      Status: "",
      Description: "",
      //
      FlightID: 0,
      FlightName: "",
      Company: "",
      To: "",
      Destination: "",
      Date: "",
      Time: "",
      PaymentType: "",
      CardNo: "",
      Upiid: "",
      Price: 0,
      Status: "",
      SeatClass: "",
      //
      OpenTicket: false,
      OpenTicketDetailModel: false,
    };
  }
  componentWillMount() {
    console.log("MyPackages Component will mount calling ...");
    this.GetUserTickets(this.state.PageNumber);
  }

  GetUserTickets = (PageNumber) => {
    let data = {
      userID: this.state.UserID,
      pageNumber: PageNumber,
      numberOfRecordPerPage: 8,
      vendor: localStorage.getItem("VendorFlightCompany"),
    };
    CustomerDataServices.GetUserTicketsByVendor(data)
      .then((data) => {
        console.log("GetUserTicketsByVendor data : ", data);
        this.setState({ rows: data.data, TotalPages: data.totalPage });
      })
      .catch((error) => {
        console.log("GetUserTicketsByVendor Error : ", error);
      });
  };
  GetTickets = (CurrentPageNumber) => {
    let data = {
      technicianName: localStorage.getItem("TechnicianFullName"),
      type: "done",
      pageNumber: CurrentPageNumber,
      numberOfRecordPerPage: 10,
    };
  };

  OpenTicketModel = (data) => {
    this.setState({
      OpenTicket: true,
      TicketID: data.ticketID,
      InsertionDate: data.insertionDate,
      UserID: data.userID,
      Summary: data.summary,
      PlanType: data.planType,
      Assigner: data.assigner,
      Reportor: data.reportor,
      Status: data.status,
      Description: data.description,
    });
  };

  handleCancelBooking = (TicketID, Status) => {
    let data = {
      ticketID: TicketID,
      status: Status,
    };
    CustomerDataServices.UpdateTicket(data)
      .then((data) => {
        console.log("handleCancelBooking data : ", data);
        this.setState({
          OpenLoader: false,
          OpenSnackBar: false,
          Message: data.message,
        });
        this.GetUserTickets(this.state.PageNumber);
      })
      .catch((error) => {
        console.log("handleCancelBooking Error : ", error);
        this.setState({
          OpenLoader: false,
          OpenSnackBar: false,
          Message: "Something went wrong",
        });
        this.GetUserTickets(this.state.PageNumber);
      });
  };

  handleClose = () => {
    console.log("Handle Close Calling ...");
    this.setState({
      OpenTicketDetailModel: false,
    });
  };

  handleTicketDetailModel = (data) => {
    this.setState({
      OpenTicketDetailModel: true,
      TicketID: data.ticketID,
      FlightID: data.flightID,
      FlightName: data.flightName,
      Company: data.company,
      To: data.to,
      Destination: data.destination,
      Time: data.time,
      PaymentType: data.paymentType,
      CardNo: data.cardNo,
      Upiid: data.upiid,
      Price: data.price,
      Status: data.status,
      SeatClass: data.seatClass,
      Date: data.flightDate,
    });
  };

  render() {
    let state = this.state;
    let self = this;
    return (
      <div className="History-MainContainer">
        <div className="History-MainSubContainer">
          <div className="History-MainSubContainer-Header">History</div>
          <div className="History-MainSubContainer-Body">
            <TableContainer component={Paper}>
              <Table className="" aria-label="simple table">
                <TableHead
                  style={{
                    width: "100%",
                    backgroundColor: "#202020",
                  }}
                >
                  <TableRow style={{ flex: 11 }}>
                    <TableCell align="left" style={{ flex: 2, color: "white" }}>
                      Flight Name
                    </TableCell>
                    <TableCell align="left" style={{ flex: 2, color: "white" }}>
                      Name
                    </TableCell>
                    <TableCell align="left" style={{ flex: 2, color: "white" }}>
                      Email
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
                      Date
                    </TableCell>
                    <TableCell align="left" style={{ flex: 1, color: "white" }}>
                      Time
                    </TableCell>
                    <TableCell align="left" style={{ flex: 1, color: "white" }}>
                      Status
                    </TableCell>
                    <TableCell align="right" style={{ flex: 1, width: 225 }}>
                      {" "}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(state.rows) &&
                    state.rows.length > 0 &&
                    state.rows.map((row) => (
                      <TableRow key={row.flightID} style={{ flex: 12 }}>
                        <TableCell
                          align="left"
                          scope="row"
                          style={{ flex: 2 }}
                          onClick={() => {
                            this.handleTicketDetailModel(row);
                          }}
                        >
                          {row.flightName}
                        </TableCell>
                        <TableCell
                          align="left"
                          scope="row"
                          style={{ flex: 2 }}
                          onClick={() => {
                            this.handleTicketDetailModel(row);
                          }}
                        >
                          {row.firstName}
                        </TableCell>
                        <TableCell
                          align="left"
                          scope="row"
                          style={{ flex: 2 }}
                          onClick={() => {
                            this.handleTicketDetailModel(row);
                          }}
                        >
                          {row.email}
                        </TableCell>

                        <TableCell
                          align="left"
                          scope="row"
                          style={{ flex: 2 }}
                          onClick={() => {
                            this.handleTicketDetailModel(row);
                          }}
                        >
                          {row.company}
                        </TableCell>
                        <TableCell
                          align="left"
                          style={{ flex: 2 }}
                          onClick={() => {
                            this.handleTicketDetailModel(row);
                          }}
                        >
                          {row.to}
                        </TableCell>
                        <TableCell
                          align="left"
                          style={{ flex: 2 }}
                          onClick={() => {
                            this.handleTicketDetailModel(row);
                          }}
                        >
                          {row.destination}&nbsp;
                        </TableCell>
                        <TableCell
                          align="left"
                          style={{ flex: 1 }}
                          onClick={() => {
                            this.handleTicketDetailModel(row);
                          }}
                        >
                          {row.price}
                        </TableCell>
                        <TableCell
                          align="left"
                          style={{ flex: 1 }}
                          onClick={() => {
                            this.handleTicketDetailModel(row);
                          }}
                        >
                          {row.flightDate}
                        </TableCell>
                        <TableCell
                          align="left"
                          style={{ flex: 1 }}
                          onClick={() => {
                            this.handleTicketDetailModel(row);
                          }}
                        >
                          {row.time}
                        </TableCell>
                        <TableCell
                          align="left"
                          style={{ flex: 1 }}
                          onClick={() => {
                            this.handleTicketDetailModel(row);
                          }}
                        >
                          {row.status}
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{ flex: 1, width: 225 }}
                        >
                          {row.status !== "confirmed" &&
                          row.status !== "cancelled" ? (
                            <Button
                              variant="outlined"
                              // color="secondary"
                              style={{ color: "green", margin: "0 5px 0 0" }}
                              onClick={() => {
                                this.handleCancelBooking(
                                  row.ticketID,
                                  "confirmed"
                                );
                              }}
                            >
                              Confirm
                            </Button>
                          ) : null}
                          {row.status !== "cancelled" ? (
                            <Button
                              variant="outlined"
                              color="secondary"
                              onClick={() => {
                                this.handleCancelBooking(
                                  row.ticketID,
                                  "cancelled"
                                );
                              }}
                            >
                              Cancel
                            </Button>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <div className="History-MainSubContainer-Footer">
            <Pagination
              count={this.state.TotalPage}
              Page={this.state.PageNumber}
              onChange={this.handlePaging}
              variant="outlined"
              shape="rounded"
              color="secondary"
            />
          </div>
        </div>

        <Modal
          open={this.state.OpenTicket}
          onClose={this.handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
          className="Complaints-Model-Create-Ticket"
        >
          <Fade in={this.state.OpenTicket}>
            <div className="Complaints-Model-Create-Ticket-Main">
              <div className="Complaints-Model-Create-Ticket-Header">
                <div className="Complaints-Model-Create-Ticket-Header-Text">
                  Edit Ticket
                </div>
              </div>
              <div className="Complaints-Model-Create-Ticket-Body">
                <InputLabel required>Plan Type</InputLabel>
                <FormControl
                  variant="filled"
                  className="Complaints-Model-Create-Ticket-Body-PlanType"
                  size="small"
                  name="PlanType"
                  style={{ margin: "5px 0 20px 0" }}
                >
                  <Select
                    native
                    name="PlanType"
                    value={state.PlanType}
                    onChange={this.handleChanges}
                  >
                    <option value="device">Device</option>
                    <option value="plan">Plans</option>
                    <option value="other">Other</option>
                  </Select>
                </FormControl>
                <InputLabel required>Raise Type</InputLabel>
                <FormControl
                  variant="filled"
                  size="small"
                  name="RaiseType"
                  className="Complaints-Model-Create-Ticket-Body-IssueType"
                  style={{ margin: "5px 0 20px 0" }}
                >
                  <Select
                    native
                    name="RaiseType"
                    value={state.RaiseType}
                    onChange={this.handleChanges}
                  >
                    <option value="issue">Issue</option>
                    <option value="improvement">Improvement</option>
                    <option value="changerequest">Change Request</option>
                  </Select>
                </FormControl>
                <div className="Complaints-Line"></div>
                <InputLabel required>Summary</InputLabel>
                <TextField
                  variant="outlined"
                  size="small"
                  name="Summary"
                  className="Complaints-Model-Create-Ticket-Body-Summary"
                  style={{ margin: "5px 0 20px 0" }}
                  error={state.SummaryFlag}
                  value={state.Summary}
                  onChange={this.handleChanges}
                />
                <InputLabel required>Description</InputLabel>
                <TextField
                  variant="outlined"
                  size="small"
                  name="Description"
                  className="Complaints-Model-Create-Ticket-Body-Summary"
                  style={{ margin: "5px 0 20px 0" }}
                  multiline
                  rows={5}
                  error={state.DescriptionFlag}
                  value={state.Description}
                  onChange={this.handleChanges}
                />
                <InputLabel required>Reporter</InputLabel>
                <TextField
                  variant="outlined"
                  size="small"
                  name="Summary"
                  className="Complaints-Model-Create-Ticket-Body-Reportor"
                  style={{ margin: "5px 0 20px 0" }}
                  error={state.SummaryFlag}
                  value={state.Reportor}
                  // onChange={this.handleChanges}
                />
                <InputLabel required>Assigner</InputLabel>
                <TextField
                  variant="outlined"
                  size="small"
                  name="Summary"
                  className="Complaints-Model-Create-Ticket-Body-Assigner"
                  style={{ margin: "5px 0 20px 0" }}
                  error={state.SummaryFlag}
                  value={state.Assigner}
                  onChange={this.handleChanges}
                />
              </div>
              <div className="Complaints-Model-Create-Ticket-Footer">
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
                  onClick={() => {
                    this.handleCreateTicket();
                  }}
                >
                  Create
                </Button>
              </div>
            </div>
          </Fade>
        </Modal>

        <Modal
          open={this.state.OpenTicketDetailModel}
          onClose={this.handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
          className="Model-Create-Ticket"
        >
          <Fade in={this.state.OpenTicketDetailModel}>
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
                    {state.Price} &#8377;
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
                  Flight Date :&nbsp;{" "}
                  <div style={{ color: "red" }}>{state.Date}</div>
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
                  <div style={{ color: "red" }}>{state.SeatClass}</div>
                </div>
                <div className="Model-Create-Ticket-Body-Row">
                  Status :&nbsp;
                  <div style={{ color: "red" }}>{state.Status}</div>
                </div>
              </div>
              <div
                className="Model-Create-Ticket-Footer"
                style={{ justifyContent: "center", fontFamily: "Roboto" }}
              >
                Don't Share Your Ticket
              </div>
            </div>
          </Fade>
        </Modal>
      </div>
    );
  }
}
