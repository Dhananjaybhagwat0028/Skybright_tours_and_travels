import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SignUp from "./components/authentication/SignUp";
import AdminDashboard from "./components/admin/AdminDashboard";
import CustomerDashboard from "./components/customer/CustomerDashboard";
import VendorDashboard from "./components/vendor/VendorDashboard";
import ForgetPassword from "./components/authentication/ForgetPassword";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={SignUp} />
          <Route exact path="/AdminDashboard" component={AdminDashboard} />
          <Route exact path="/VendorDashboard" component={VendorDashboard} />
          <Route exact path="/ForgetPassword" component={ForgetPassword} />
          <Route
            required
            path="/CustomerDashboard"
            component={CustomerDashboard}
          />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
