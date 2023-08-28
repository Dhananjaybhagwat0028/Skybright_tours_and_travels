//const baseURL = "https://localhost:44377";
const baseURL = "http://localhost:8081"
export const AuthenticationDataServices = {
  SignIn,
  SignUp,
  ResetPassword,
};

function SignIn(reqbody) {
  // debugger;
  const requestOptions = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
    },
    body: JSON.stringify(reqbody),
  };
  return fetch(baseURL + `/api/Authentication/SignIn`, requestOptions)
    .then((res) => res.json())
    .then((result) => {
      return result;
    });
}

function SignUp(reqbody) {
  const requestOptions = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
    },
    body: JSON.stringify(reqbody),
  };
  return fetch(baseURL + `/api/Authentication/SignUp`, requestOptions)
    .then((res) => res.json())
    .then((result) => {
      return result;
    });
}
//https://localhost:44377/api/Authentication/ForgetPassword
function ResetPassword(reqbody) {
  const requestOptions = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
    },
    body: JSON.stringify(reqbody),
  };
  return fetch(baseURL + `/api/Authentication/ForgetPassword`, requestOptions)
    .then((res) => res.json())
    .then((result) => {
      return result;
    });
}
