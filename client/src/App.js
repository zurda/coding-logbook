import React, { Component } from "react";
import axios from "axios";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Header from "./Header";
import DisplayPosts from "./DisplayPosts";
import AddPost from "./AddPost";
import Signup from "./SignUp";
import Login from "./Login";
import Footer from "./Footer";

class App extends Component {
  handleSignup = signup => {
    console.log("handle signup");
    const { email, username, password, passwordConf } = signup;
    if (password !== passwordConf) {
      alert("Passwords don't match");
    } else if (!email || !username || !password || !passwordConf) {
      alert("Please fill in all fields");
    } else {
      axios({
        url: "/api/putUser",
        method: "post",
        data: {
          email,
          username,
          password,
          passwordConf
        },
        withCredentials: true
      })
        .then(res => {
          this.setState({
            action: ""
          });
        })
        .catch(error => {
          console.log(error.response);
        });
    }
  };

  handleLogin = loginForm => {
    const { logemail, logpassword } = loginForm;
    if (!logemail || !logpassword) {
      alert("Please fill in all fields");
    } else {
      axios({
        url: "/api/loginUser",
        method: "post",
        data: {
          logemail: logemail,
          logpassword: logpassword
        },
        withCredentials: true
      })
        .then(res => {
          if (res.data.success) {
            this.setState({ auth: res.data.auth });
            this.setState({
              action: ""
            });
            console.log("LOGIN SUCCESSFUL");
          } else {
            console.log("PROBLEM WITH LOGIN");
          }
        })
        .catch(error => {
          console.log(error.response);
        });
    }
  };
  actionBtn = e => {
    if (!e) this.setState({ action: "" });
    this.setState({
      action: e.target.className
    });
  };

  render() {
    return (
      <Router>
        <div>
          <Header />
          <div className="main">
            <Route exact path="/" component={DisplayPosts} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/add-post" component={AddPost} />
          </div>
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;
