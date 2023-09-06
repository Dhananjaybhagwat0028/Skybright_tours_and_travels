//const baseURL = "https://localhost:44377";
const baseURL = "http://localhost:8081";
const axios = require("axios").default;

export const AdminDataServices = {
  ManupulateCustomerAccount,
  GetAllUserList,
  AddPackage,
  GetPackage,
  EmailService,
};

function ManupulateCustomerAccount(reqbody) {
  // debugger;
  const requestOptions = {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      Authorization: `Bearer ${localStorage.getItem("AdminToken")}`,
    },
    body: JSON.stringify(reqbody),
  };
  return fetch(baseURL + `/api/Admin/ManupulateCustomerAccount`, requestOptions)
    .then((res) => res.json())
    .then((result) => {
      return result;
    });
}

function AddPackage(reqbody) {
  const requestOptions = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      Authorization: `Bearer ${localStorage.getItem("AdminToken")}`,
    },
    body: JSON.stringify(reqbody),
  };
  return fetch(baseURL + `/api/Admin/AddPackage`, requestOptions)
    .then((res) => res.json())
    .then((result) => {
      return result;
    });
}

function GetAllUserList(reqbody) {
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
  return fetch(baseURL + `/api/Admin/GetAllUserList`, requestOptions)
    .then((res) => res.json())
    .then((result) => {
      return result;
    });
}

function GetPackage() {
  const requestOptions = {
    method: "GET",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      Authorization: `Bearer ${localStorage.getItem("AdminToken")}`,
    },
    body: null,
  };
  return fetch(baseURL + `/api/Admin/GetPackage`, requestOptions)
    .then((res) => res.json())
    .then((result) => {
      return result;
    });
}

function EmailService(reqbody) {
  const requestOptions = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      Authorization: `Bearer ${localStorage.getItem("AdminToken")}`,
    },
    body: JSON.stringify(reqbody),
  };
  return fetch(`https://localhost:44307/api/Email/EmailService`, requestOptions)
    .then((res) => res.json())
    .then((result) => {
      return result;
    });
}
