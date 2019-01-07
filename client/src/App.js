import React, { Component } from "react";
import axios from "axios";
import "./App.css";
import Header from "./Header";
import Footer from "./Footer";
import ActionBtn from "./ActionBtn";

class App extends Component {
  state = {
    auth: false,
    data: [],
    id: 0,
    message: null,
    title: null,
    code: null,
    originUrl: null,
    intervalIsSet: false,
    isPublic: "public",
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null,
    action: null,
    labels: [],
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

  putDataToDB = (title, message, code, originUrl, labels, isPublic) => {
    let currentIds = this.state.data.map(data => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    axios({
      url: "/api/putData",
      method: "post",
      data: {
        id: idToBeAdded,
        message: message,
        title: title,
        code: code,
        originUrl: originUrl,
        labels: labels,
        isPublic: isPublic
      },
      withCredentials: true
    });
  };

  handleSignupSubmit = (email, username, password, passwordConf) => {
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
      });
    }
  };

  handleLoginSubmit = (logemail, logpassword) => {
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
      }).then(res => {
        this.setState({ auth: res.data.auth });
      });
    }
  };

  deleteFromDB = idTodelete => {
    let objIdToDelete = null;
    this.state.data.forEach(dat => {
      if (dat.id === idTodelete) {
        objIdToDelete = dat._id;
      }
    });

    axios.delete("/api/deleteData", {
      data: {
        id: objIdToDelete
      }
    });
  };

  updateDB = (idToUpdate, updateToApply) => {
    let objIdToUpdate = null;
    this.state.data.forEach(dat => {
      if (dat.id === idToUpdate) {
        objIdToUpdate = dat._id;
      }
    });

    axios({
      url: "/api/updateData",
      method: "post",
      data: {
        id: objIdToUpdate,
        update: { message: updateToApply }
      },
      withCredentials: true
    });
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
              name="update"
              text="Update a Post"
              click={this.actionBtnClick}
            />
            <ActionBtn
              name="signup"
              text="Signup"
              click={this.actionBtnClick}
            />
            <ActionBtn name="login" text="Log in" click={this.actionBtnClick} />

            {this.state.action === "add" && (
              <div className="input add" style={{ padding: "10px" }}>
                <form>
                  <h2>Add a Log</h2>
                  <input
                    type="text"
                    className="input-field"
                    onChange={e => this.setState({ title: e.target.value })}
                    placeholder="add title"
                    style={{ display: "block", width: "400px" }}
                  />
                  <textarea
                    type="text"
                    className="input-field"
                    onChange={e => this.setState({ message: e.target.value })}
                    placeholder="add post"
                    style={{ display: "block", width: "400px", height: "60px" }}
                  />
                  <textarea
                    type="text/javascript"
                    className="input-field"
                    onChange={e => this.setState({ code: e.target.value })}
                    placeholder="add code"
                    style={{ display: "block", width: "400px", height: "60px" }}
                  />
                  <input
                    type="text"
                    className="input-field"
                    onChange={e => this.setState({ originUrl: e.target.value })}
                    placeholder="add link"
                    style={{ display: "block", width: "400px" }}
                  />
                  <input
                    type="text"
                    className="input-field"
                    onChange={e =>
                      this.setState({
                        labels: e.target.value.split(",")
                      })
                    }
                    placeholder="add labels"
                    style={{ display: "block", width: "400px" }}
                  />
                  <div className="radio">
                    <label>
                      <input
                        type="radio"
                        value="public"
                        checked={this.state.isPublic === "public"}
                        onChange={e =>
                          this.setState({ isPublic: e.target.value })
                        }
                      />
                      Public
                    </label>
                  </div>
                  <div className="radio">
                    <label>
                      <input
                        type="radio"
                        value="private"
                        checked={this.state.isPublic === "private"}
                        onChange={e =>
                          this.setState({ isPublic: e.target.value })
                        }
                      />
                      Private
                    </label>
                  </div>
                  <button
                    type="submit"
                    onClick={() =>
                      this.putDataToDB(
                        this.state.title,
                        this.state.message,
                        this.state.code,
                        this.state.originUrl,
                        this.state.labels,
                        this.state.isPublic
                      )
                    }
                  >
                    Add a Log
                  </button>
                </form>
              </div>
            )}
            {/* {this.state.action === "delete" && (
              <div className="input delete" style={{ padding: "10px" }}>
                <form>
                  <input
                    type="text"
                    className="input-field"
                    style={{ display: "block", width: "200px" }}
                    onChange={e =>
                      this.setState({ idToDelete: e.target.value })
                    }
                    placeholder="put id of item to delete here"
                  />
                  <button
                    type="submit"
                    onClick={() => this.deleteFromDB(this.state.idToDelete)}
                  >
                    DELETE
                  </button>
                </form>
              </div>
            )} */}
            {this.state.action === "update" && (
              <div className="input update" style={{ padding: "10px" }}>
                <form>
                  <input
                    type="text"
                    className="input-field"
                    style={{ display: "block", width: "200px" }}
                    onChange={e =>
                      this.setState({ idToUpdate: e.target.value })
                    }
                    placeholder="id of item to update here"
                  />
                  <input
                    type="text"
                    className="input-field"
                    style={{ display: "block", width: "200px" }}
                    onChange={e =>
                      this.setState({ updateToApply: e.target.value })
                    }
                    placeholder="put new value of the item here"
                  />
                  <button
                    type="submit"
                    onClick={() =>
                      this.updateDB(
                        this.state.idToUpdate,
                        this.state.updateToApply
                      )
                    }
                  >
                    UPDATE
                  </button>
                </form>
              </div>
            )}
            {this.state.action === "login" && (
              <form>
                <h2>Login</h2>
                <input
                  type="text"
                  className="input-field"
                  onChange={e => this.setState({ logemail: e.target.value })}
                  placeholder="your email"
                  style={{ display: "block", width: "400px" }}
                />
                <input
                  type="password"
                  className="input-field"
                  onChange={e => this.setState({ logpassword: e.target.value })}
                  placeholder="your password"
                  style={{ display: "block", width: "400px" }}
                />

                <button
                  type="submit"
                  onClick={() =>
                    this.handleLoginSubmit(
                      this.state.logemail,
                      this.state.logpassword
                    )
                  }
                >
                  Login
                </button>
              </form>
            )}
            {this.state.action === "signup" && (
              <form>
                <h2>Add a User</h2>
                <input
                  type="text"
                  className="input-field"
                  onChange={e => this.setState({ email: e.target.value })}
                  placeholder="add email"
                  style={{ display: "block", width: "400px" }}
                />
                <input
                  type="text"
                  className="input-field"
                  onChange={e => this.setState({ username: e.target.value })}
                  placeholder="add username"
                  style={{ display: "block", width: "400px" }}
                />
                <input
                  type="password"
                  className="input-field"
                  onChange={e => this.setState({ password: e.target.value })}
                  placeholder="add password"
                  style={{ display: "block", width: "400px" }}
                />
                <input
                  type="password"
                  className="input-field"
                  onChange={e =>
                    this.setState({ passwordConf: e.target.value })
                  }
                  placeholder="add passwordConf"
                  style={{ display: "block", width: "400px" }}
                />
                <button
                  type="submit"
                  onClick={() =>
                    this.handleSignupSubmit(
                      this.state.email,
                      this.state.username,
                      this.state.password,
                      this.state.passwordConf
                    )
                  }
                >
                  Add a User
                </button>
              </form>
            )}
          </div>
          <ul>
            {data.length <= 0
              ? "There are no Coding logs"
              : data.map(dat => (
                  <li
                    className="post"
                    style={{ padding: "10px" }}
                    key={dat._id}
                  >
                    <h3 style={{ color: "#455a64" }}>
                      {dat.title}
                      <span className="delete-icon">
                        <i className="fas fa-trash-alt" />
                      </span>
                    </h3>
                    <span style={{ color: "#455a64" }}>
                      {dat.createdAt.slice(0, 10)}
                    </span>
                    <p style={{ color: "#455a64" }}>{dat.message}</p>
                    <div style={{ color: "#455a64" }}>
                      <pre
                        className="code"
                        style={{
                          maxWidth: "98%",
                          padding: "0.6em",
                          width: "30em"
                        }}
                      >
                        {dat.code}
                      </pre>

                      <p>
                        <a href={dat.originUrl}>Origin</a>
                      </p>

                      {dat.labels.length > 0 && (
                        <ul className="labels">
                          {dat.labels.map(label => (
                            <li key={label}>{label}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </li>
                ))}
          </ul>
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
