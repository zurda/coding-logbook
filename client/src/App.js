import React, { Component } from "react";
import axios from "axios";
import "./App.css";
import Header from "./Header";
import DisplayPosts from "./DisplayPosts";
import Footer from "./Footer";
import ActionBtn from "./ActionBtn";
import AddPost from "./AddPost";

class App extends Component {
  state = {
    data: [],
    postsToEdit: [],
    intervalIsSet: false,
    objectToUpdate: null,
    action: null,
    email: null,
    username: null,
    password: null,
    passwordConf: null,
    logemail: null,
    logpassword: null
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

  handleSignupSubmit = () => {
    const { email, username, password, passwordConf } = this.state;
    if (password !== passwordConf) {
      alert("Passwords don't match");
    } else if (!email || !username || !password || !passwordConf) {
      alert("Please fill in all fields");
    } else {
      axios({
        url: "/api/putUser",
        method: "post",
        data: {
          email: email,
          username: username,
          password: password,
          passwordConf: passwordConf
        },
        withCredentials: true
      })
        .then(res => {
          this.setState({
            email: "",
            username: "",
            password: "",
            passwordConf: "",
            action: ""
          });
        })
        .catch(error => {
          console.log(error.response);
        });
    }
  };

  handleLoginSubmit = () => {
    const { logemail, logpassword } = this.state;
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
          this.setState({ auth: res.data.auth });
          this.setState({
            logemail: "",
            logpassword: "",
            action: ""
          });
        })
        .catch(error => {
          console.log(error.response);
        });
    }
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

  updateDB = post => {
    console.log("post: ", post);
    const { _id, title, message, code, isPublic, labels, originUrl } = post;
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

  actionBtnClick = e => {
    this.setState({
      action: e.target.className
    });
  };

  render() {
    const { data } = this.state;
    return (
      <div>
        <Header />
        <div className="main">
          <div className="action">
            <ActionBtn
              name="add"
              text="Add a Post"
              click={this.actionBtnClick}
            />
            <ActionBtn
              name="signup"
              text="Signup"
              click={this.actionBtnClick}
            />
            <ActionBtn name="login" text="Log in" click={this.actionBtnClick} />

            {this.state.action === "add" && (
              <AddPost newPostSubmit={this.putDataToDB} />
            )}

            {this.state.action === "login" && (
              <div className="form">
                <h2>Login</h2>
                <input
                  type="text"
                  className="input-field"
                  onChange={e => this.setState({ logemail: e.target.value })}
                  placeholder="Email"
                />
                <input
                  type="password"
                  className="input-field"
                  onChange={e => this.setState({ logpassword: e.target.value })}
                  placeholder="Password"
                />

                <button type="submit" onClick={() => this.handleLoginSubmit()}>
                  Login
                </button>
              </div>
            )}
            {this.state.action === "signup" && (
              <div className="form">
                <h2>Add a User</h2>
                <input
                  type="text"
                  className="input-field"
                  onChange={e => this.setState({ email: e.target.value })}
                  placeholder="Email"
                />
                <input
                  type="text"
                  className="input-field"
                  onChange={e => this.setState({ username: e.target.value })}
                  placeholder="Username"
                />
                <input
                  type="password"
                  className="input-field"
                  onChange={e => this.setState({ password: e.target.value })}
                  placeholder="Password"
                />
                <input
                  type="password"
                  className="input-field"
                  onChange={e =>
                    this.setState({ passwordConf: e.target.value })
                  }
                  placeholder="Repeat Password"
                />
                <button type="submit" onClick={() => this.handleSignupSubmit()}>
                  Add a User
                </button>
              </div>
            )}
          </div>
          <ul>
            {data.length <= 0 ? (
              "There are no Coding logs"
            ) : (
              <DisplayPosts
                data={this.state.data}
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
