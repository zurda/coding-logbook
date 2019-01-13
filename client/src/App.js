import React, { Component } from "react";
import axios from "axios";
import "./App.css";
import Header from "./Header";
import DisplayPosts from "./DisplayPosts";
import Footer from "./Footer";
import ActionBtn from "./ActionBtn";
import AddPost from "./AddPost";
import Signup from "./SignUp";
import Login from "./Login";

class App extends Component {
  state = {
    postsToEdit: [],
    action: null
  };

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
    const { action } = this.state;
    return (
      <div>
        <Header />
        <div className="main">
          <div className="action">
            <ActionBtn name="add" text="Add a Post" click={this.actionBtn} />
            <ActionBtn name="signup" text="Signup" click={this.actionBtn} />
            <ActionBtn name="login" text="Log in" click={this.actionBtn} />
            {action === "add" && <AddPost action={this.actionBtn} />}
            {action === "login" && <Login action={this.actionBtn} />}
            {action === "signup" && <Signup action={this.actionBtn} />}
          </div>
          <DisplayPosts />
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
