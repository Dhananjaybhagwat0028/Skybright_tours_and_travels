//const baseURL = "https://localhost:44377/";
const baseURL = "http://localhost:8081/";
const axios = require("axios").default;

export const CustomerDataServices = {
  SearchAndFilterFlights,
  UpdateCustomerInfomation,
  GetCustomerInfomation,
  PaymentGetway,
  UpdateTicket,
  UpdateImage,
  GetUserTickets,
  GetFlightDetails,
  GetUserTicketsByVendor,
  AvailableSeat,
  GetPackage,
  AddTourPackage,
  GetUserTourPackage,
  GetAllTourPackage,
  ChangeTourPackageStatus,
};

function AddTourPackage(reqbody) {
  const requestOptions = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      Authorization: `Bearer ${localStorage.getItem("CustomerToken")}`,
    },
    body: JSON.stringify(reqbody),
  };
  return fetch(baseURL + `api/Admin/AddTourPackage`, requestOptions)
    .then((res) => res.json())
    .then((result) => {
      return result;
    });
}

function GetUserTourPackage(reqbody) {
  const requestOptions = {
    method: "GET",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      Authorization: `Bearer ${localStorage.getItem("CustomerToken")}`,
    },
    body: null,
  };
  return fetch(
    baseURL + `api/Admin/GetUserTourPackage?UserID=` + reqbody,
    requestOptions
  )
    .then((res) => res.json())
    .then((result) => {
      return result;
    });
}

function GetAllTourPackage() {
  const requestOptions = {
    method: "GET",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      Authorization: `Bearer ${localStorage.getItem("CustomerToken")}`,
    },
    body: null,
  };
  return fetch(baseURL + `api/Admin/GetAllTourPackage`, requestOptions)
    .then((res) => res.json())
    .then((result) => {
      return result;
    });
}

function ChangeTourPackageStatus(reqbody) {
  const requestOptions = {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      Authorization: `Bearer ${localStorage.getItem("CustomerToken")}`,
    },
    body: null,
  };
  return fetch(
    baseURL +
      `api/Admin/ChangeTourPackageStatus?PackageID=` +
      reqbody.PackageID +
      `&Status=` +
      reqbody.Status,
    requestOptions
  )
    .then((res) => res.json())
    .then((result) => {
      return result;
    });
}

function SearchAndFilterFlights(reqbody) {
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
  return fetch(baseURL + `api/Customer/SearchAndFilterFlights`, requestOptions)
    .then((res) => res.json())
    .then((result) => {
      return result;
    });
}

function UpdateCustomerInfomation(reqbody) {
  // debugger;
  const requestOptions = {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      Authorization: `Bearer ${localStorage.getItem("CustomerToken")}`,
    },
    body: JSON.stringify(reqbody),
  };
  return fetch(
    baseURL + `api/Customer/UpdateCustomerInfomation`,
    requestOptions
  )
    .then((res) => res.json())
    .then((result) => {
      return result;
    });
}

function GetCustomerInfomation(reqbody) {
  // debugger;
  const requestOptions = {
    method: "GET",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      Authorization: `Bearer ${localStorage.getItem("CustomerToken")}`,
    },
    //body: JSON.stringify(reqbody),
  };
  return fetch(
    baseURL + `api/Customer/GetCustomerInfomation?UserID=${reqbody}`,
    requestOptions
  )
    .then((res) => res.json())
    .then((result) => {
      return result;
    });
}

function PaymentGetway(reqbody) {
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
  return fetch(baseURL + `api/Customer/PaymentGetway`, requestOptions)
    .then((res) => res.json())
    .then((result) => {
      return result;
    });
}

function UpdateTicket(reqbody) {
  // debugger;
  const requestOptions = {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      Authorization: `Bearer ${localStorage.getItem("CustomerToken")}`,
    },
    body: JSON.stringify(reqbody),
  };
  return fetch(baseURL + `api/Customer/UpdateTicket`, requestOptions)
    .then((res) => res.json())
    .then((result) => {
      return result;
    });
}

async function UpdateImage(reqbody) {
  const headers = {
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      Authorization: `Bearer ${localStorage.getItem("CustomerToken")}`,
    },
  };

  await axios
    .post(baseURL + "api/Customer/UpdateImage", reqbody, true && headers)
    .then((result) => {
      console.log("Result : ", result);
      return result;
    });
}

function GetUserTickets(reqbody) {
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
  return fetch(baseURL + `api/Customer/GetUserTickets`, requestOptions)
    .then((res) => res.json())
    .then((result) => {
      return result;
    });
}

function GetUserTicketsByVendor(reqbody) {
  const requestOptions = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      Authorization: `Bearer ${localStorage.getItem("CustomerToken")}`,
    },
    body: JSON.stringify(reqbody),
  };
  return fetch(baseURL + `api/Customer/GetUserTicketsByVendor`, requestOptions)
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
      Authorization: `Bearer ${localStorage.getItem("CustomerToken")}`,
    },
    body: null,
  };
  return fetch(baseURL + `api/Admin/GetPackage`, requestOptions)
    .then((res) => res.json())
    .then((result) => {
      return result;
    });
}

function GetFlightDetails(reqbody) {
  const requestOptions = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      Authorization: `Bearer ${localStorage.getItem("CustomerToken")}`,
    },
    body: JSON.stringify(reqbody),
  };
  return fetch(baseURL + `api/Vendor/GetFlightDetails`, requestOptions)
    .then((res) => res.json())
    .then((result) => {
      return result;
    });
}

function AvailableSeat(reqbody) {
  const requestOptions = {
    method: "GET",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      Authorization: `Bearer ${localStorage.getItem("CustomerToken")}`,
    },
    //body: JSON.stringify(reqbody),
  };
  return fetch(
    baseURL +
      `api/Customer/AvailableSeat?FlightID=${reqbody.flightID}&FlightDate=${reqbody.flightDate}`,
    requestOptions
  )
    .then((res) => res.json())
    .then((result) => {
      return result;
    });
}
