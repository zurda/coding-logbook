import React, { Component } from "react";
import axios from "axios";

import "./App.css";
import { HashRouter, Route } from "react-router-dom";
import Header from "./Header";
import DisplayPosts from "./DisplayPosts";
import AddPost from "./AddPost";
import Signup from "./SignUp";
import Login from "./Login";
import Footer from "./Footer";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL

class App extends Component {
  handleSignup = signup => {
    const { email, username, password, passwordConf } = signup;
    if (password !== passwordConf) {
      alert("Passwords don't match");
    } else if (!email || !username || !password || !passwordConf) {
      alert("Please fill in all fields");
    } else {
      axios({
        url: `${BACKEND_URL}/api/putUser`,
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
          this.handleRedirect("/login");
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
        url: `${BACKEND_URL}/api/loginUser`,
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
            this.handleRedirect("/");
          } else {
            console.log("PROBLEM WITH LOGIN");
          }
        })
        .catch(error => {
          console.log(error.response);
        });
    }
  };
  handleRedirect = path => {
    window.location.href = process.env.REACT_APP_HOME_URL ? process.env.REACT_APP_HOME_URL + '/#' + path : path;
  };
  actionBtn = e => {
    if (!e) this.setState({ action: "" });
    this.setState({
      action: e.target.className
    });
  };

  render() {
    return (
      <HashRouter>
        <div>
          <Header />
          <div className="main">
            <Route exact path='/' component={DisplayPosts} />
            <Route
              exact
              path={'/login'}
              render={() => <Login handleLogin={this.handleLogin} />}
            />
            <Route
              exact
              path='/signup'
              render={() => <Signup handleSignup={this.handleSignup} />}
            />
            <Route exact path='/add-post' component={AddPost} />
          </div>
          <Footer />
        </div>
      </HashRouter>
    );
  }
}

export default App;
