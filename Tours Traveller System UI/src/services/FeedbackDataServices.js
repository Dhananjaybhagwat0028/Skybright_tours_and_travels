//const baseURL = "https://localhost:44377";
const baseURL = "http://localhost:8081"
const axios = require("axios").default;

export const FeedbackDataServices = {
    InsertFeedback,
    GetFeedback,
    DeleteFeedback
};

function InsertFeedback(reqbody) {
  // debugger;
  const requestOptions = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      Authorization: `Bearer ${localStorage.getItem("CustomerToken")}`,
    },
    body: JSON.stringify(reqbody),
  };
  return fetch(baseURL + `/api/Feedback/InsertFeedback`, requestOptions)
    .then((res) => res.json())
    .then((result) => {
      return result;
    });
}

function GetFeedback(reqbody) {
  // debugger;
  const requestOptions = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      Authorization: `Bearer ${localStorage.getItem("AdminToken")}`,
    },
    body: JSON.stringify(reqbody),
  };
  return fetch(baseURL + `/api/Feedback/GetFeedback`, requestOptions)
    .then((res) => res.json())
    .then((result) => {
      return result;
    });
}

function DeleteFeedback(reqbody) {
    // debugger;
    const requestOptions = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "cache-control": "no-cache",
        Authorization: `Bearer ${localStorage.getItem("AdminToken")}`,
      },
      body: JSON.stringify(reqbody),
    };
    return fetch(baseURL + `/api/Feedback/DeleteFeedback`, requestOptions)
      .then((res) => res.json())
      .then((result) => {
        return result;
      });
  }
