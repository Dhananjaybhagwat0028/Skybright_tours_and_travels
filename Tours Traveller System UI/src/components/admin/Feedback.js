import React, { Component } from "react";
import "./Feedback.scss";
import { AdminDataServices } from "../../services/AdminDataServices";
import { FeedbackDataServices } from "../../services/FeedbackDataServices";
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

export default class Feedback extends Component {
  constructor() {
    super();
    this.state = {
      rows: [],
      //
      PageNumber: 1,
      TotalPage: 0,
      //
      Message: "",
      //
      OpenLoader: false,
      OpenSnackBar: false,
    };
  }

  componentWillMount() {
    console.log("Complaints component will mount calling ... ");
    this.GetFeedback(this.state.PageNumber);
  }

  GetFeedback = (CurrentPageNumber) => {
    let data = {
      pageNumber: CurrentPageNumber,
      numberOfRecordPerPage: 8,
    };
    FeedbackDataServices.GetFeedback(data)
      .then((data) => {
        console.log("GetTicketHistory Data : ", data);
        this.setState({
          rows: data.data,
          TotalPage: data.totalPage,
        });
      })
      .catch((error) => {
        console.log("GetTicketHistory Error : ", error);
      });
  };

  DeleteFeedback = (FeedbackId) => {
    // debugger;
    let data = {
      feedbackID: FeedbackId,
    };
    FeedbackDataServices.DeleteFeedback(data)
      .then((data) => {
        // debugger;
        console.log("DeleteFeedback Data : ", data);
        this.GetFeedback(this.state.PageNumber);
        this.setState({
          OpenSnackBar: true,
          Message: data.message,
        });
      })
      .catch((error) => {
        // debugger;
        console.log("DeleteFeedback Error : ", error);
        this.GetFeedback(this.state.PageNumber);
        this.setState({
          OpenSnackBar: true,
          Message: "Something went wrong",
        });
      });
  };

  handlePaging = async (e, value) => {
    console.log("Current Page : ", value);
    this.GetFeedback(value);
  };

  render() {
    let state = this.state;
    let self = this;
    return (
      <div className="Feedback-MainContainer">
        <div className="Feedback-MainSubContainer">
          <div className="Feedback-MainSubContainer-Header">Feedback</div>
          <div className="Feedback-MainSubContainer-Main">
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
                      style={{ fontSize: 16, flex: 0.2, color: "white" }}
                      align="left"
                    >
                      Id
                    </TableCell>
                    <TableCell
                      style={{ fontSize: 16, flex: 1, color: "white" }}
                      align="left"
                    >
                      UserName
                    </TableCell>
                    <TableCell
                      style={{ fontSize: 16, flex: 5, color: "white" }}
                      align="left"
                    >
                      Feedback&nbsp;
                    </TableCell>
                    {/* <TableCell
                      style={{ fontSize: 16, flex: 1, color: "white" }}
                      align="left"
                    >
                      Rating
                    </TableCell> */}
                    <TableCell
                      style={{ fontSize: 16, flex: 0.5 }}
                      align="left"
                    ></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(state.rows) && state.rows.length > 0
                    ? state.rows.map((row) => (
                        <TableRow
                          key={row.feedbackID}
                          style={{ display: "flex" }}
                        >
                          <TableCell
                            align="left"
                            component="th"
                            scope="row"
                            style={{ flex: 0.2 }}
                          >
                            {row.feedbackID}
                          </TableCell>
                          <TableCell align="left" style={{ flex: 1 }}>
                            {row.userName}
                          </TableCell>
                          <TableCell align="left" style={{ flex: 5 }}>
                            {row.feedback}
                          </TableCell>
                          {/* <TableCell align="left" style={{ flex: 1 }}>
                            {row.rating}
                          </TableCell> */}
                          <TableCell
                            align="left"
                            style={{ flex: 0.5, padding: 0 }}
                          >
                            <IconButton
                              variant="outlined"
                              style={{ color: "black" }}
                              size="medium"
                              onClick={() => {
                                self.DeleteFeedback(row.feedbackID);
                              }}
                            >
                              <DeleteIcon size="medium" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    : null}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <div className="Feedback-MainSubContainer-Footer">
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
