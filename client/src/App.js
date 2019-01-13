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
    data: [],
    postsToEdit: [],
    intervalIsSet: false,
    action: null
  };

  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 3000);
      this.setState({ intervalIsSet: interval });
    }
  }

  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  getDataFromDb = () => {
    axios({ url: "/api/getData", method: "get", withCredentials: true }).then(
      res => this.setState({ data: res.data.data })
    );
  };

  putDataToDB = newPost => {
    const { title, message, code, originUrl, labels, isPublic } = newPost;
    axios({
      url: "/api/putData",
      method: "post",
      data: {
        message: message,
        title: title,
        code: code,
        originUrl: originUrl,
        labels: labels,
        isPublic: isPublic
      },
      withCredentials: true
    })
      .then(res => {
        if (res.data.success) {
          this.setState({
            action: ""
          });
        } else {
          console.log("PROBLEM WITH INPUTS");
        }
      })
      .catch(error => {
        console.log(error.response);
      });
  };

  deleteFromDB = idTodelete => {
    axios({
      url: "/api/deleteData",
      method: "delete",
      data: {
        id: idTodelete
      },
      withCredentials: true,
      name: "",
      parts: ""
    })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error.response);
      });
  };

  updateDB = existingPost => {
    const {
      _id,
      title,
      message,
      code,
      isPublic,
      labels,
      originUrl
    } = existingPost;
    axios({
      url: "/api/updateData",
      method: "post",
      data: {
        _id,
        title,
        message,
        code,
        isPublic,
        labels,
        originUrl
      },
      withCredentials: true
    })
      .then(res => {
        this.cancelPostEdit(_id);
      })
      .catch(error => {
        console.log(error.response);
      });
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

  editPostHandler = postId => {
    const postsToEdit = this.state.postsToEdit;
    postsToEdit.push(postId);
    this.setState({ postsToEdit });
  };

  cancelPostEdit = postId => {
    let postsToEdit = this.state.postsToEdit;
    const newPostsToEdit = postsToEdit.filter(id => id !== postId);
    this.setState({ postsToEdit: newPostsToEdit });
  };

  actionBtn = e => {
    this.setState({
      action: e.target.className
    });
  };

  render() {
    const { data, action } = this.state;
    return (
      <div>
        <Header />
        <div className="main">
          <div className="action">
            <ActionBtn name="add" text="Add a Post" click={this.actionBtn} />
            <ActionBtn name="signup" text="Signup" click={this.actionBtn} />
            <ActionBtn name="login" text="Log in" click={this.actionBtn} />
            {action === "add" && <AddPost newPostSubmit={this.putDataToDB} />}
            {action === "login" && <Login handleLogin={this.handleLogin} />}
            {action === "signup" && <Signup handleSignup={this.handleSignup} />}
          </div>
          <ul>
            {data.length <= 0 ? (
              "There are no Coding logs"
            ) : (
              <DisplayPosts
                data={data}
                handleDelete={this.deleteFromDB}
                handleUpdate={this.updateDB}
                editPostHandler={this.editPostHandler}
                postsToEdit={this.state.postsToEdit}
                cancelPostEdit={this.cancelPostEdit}
              />
            )}
          </ul>
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
