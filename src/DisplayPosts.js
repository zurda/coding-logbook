import React, { Component } from "react";
import axios from "axios";

import Post from "./Post";
import EditPost from "./EditPost";


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL

class DisplayPosts extends Component {
  state = {
    data: [],
    postsToEdit: [],
    intervalIsSet: false,
    action: ""
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
    axios({ url: `${BACKEND_URL}/api/entries`, method: "get", withCredentials: true }).then(
      res => this.setState({ data: res.data.data })
    );
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

  handleDelete = idTodelete => {
    axios({
      url: `${BACKEND_URL}/api/entry`,
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

  handleUpdate = data => {
    axios({
      url: `${BACKEND_URL}/api/updateData`,
      method: "post",
      data,
      withCredentials: true
    })
      .then(res => {
        this.cancelPostEdit(data._id);
      })
      .catch(error => {
        console.log(error.response);
      });
  };

  render() {
    const { data } = this.state;
    return (
      <div>
        {data.length < 1
          ? "No posts to display"
          : data.map(post =>
            this.state.postsToEdit.includes(post._id) ? (
              <EditPost
                key={post._id}
                post={post}
                handleDelete={this.handleDelete}
                postsToEdit={this.state.postsToEdit}
                editPostHandler={this.editPostHandler}
                cancelPostEdit={this.cancelPostEdit}
                handleUpdate={this.handleUpdate}
              />
            ) : (
                <Post
                  key={post._id}
                  post={post}
                  handleDelete={this.handleDelete}
                  postsToEdit={this.postsToEdit}
                  editPostHandler={this.editPostHandler}
                />
              )
          )}
      </div>
    );
  }
}

export default DisplayPosts;
