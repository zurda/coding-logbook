import React, { Component } from "react";
import axios from "axios";

import Post from "./Post";
import EditPost from "./EditPost";


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL

class DisplayPosts extends Component {
  state = {
    data: [],
    postsToEdit: [],
    action: ""
  };

  componentDidMount() {
    this.getDataFromDb();
    this.setState({ isLoggedIn: window && window.localStorage && window.localStorage.getItem('blogSession') })
  }

  getDataFromDb = () => {
    axios({
      url: `${BACKEND_URL}/api/entries`, method: "get", withCredentials: true
    }).then(
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
    if (this.state.isLoggedIn) {
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
          this.getDataFromDb();
        })
        .catch(error => {
          console.log(error.response);
        });
    } else console.log('You do not have permissions to delete this')
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
        this.getDataFromDb();
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
