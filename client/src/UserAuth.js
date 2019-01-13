import React, { Component } from "react";
import axios from "axios";
import ActionBtn from "./ActionBtn";
import SignUp from "./SignUp";
import Login from "./Login";
import "./UserAuth.css";

class UserAuth extends Component {
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
  render() {
    return (
      <div className="user-auth">
        <ActionBtn name="signup" text="Signup" click={this.actionBtn} />
        <ActionBtn name="login" text="Log in" click={this.actionBtn} />
        {this.state.action === "signup" && <SignUp action={this.actionBtn} />}
        {this.state.action === "login" && <Login action={this.actionBtn} />}
      </div>
    );
  }
}

export default UserAuth;
