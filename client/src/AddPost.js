import React, { Component } from "react";

class AddPost extends Component {
  state = {
    message: null,
    title: null,
    code: null,
    originUrl: null,
    isPublic: "public"
  };
  render() {
    return (
      <div className="input add" style={{ padding: "10px" }}>
        <div className="form">
          <h2>Add a Log</h2>
          <input
            type="text"
            className="input-field"
            onChange={e => this.setState({ title: e.target.value })}
            placeholder="add title"
          />
          <textarea
            type="text"
            className="input-field"
            onChange={e => this.setState({ message: e.target.value })}
            placeholder="add post"
            style={{ dheight: "60px" }}
          />
          <textarea
            type="text/javascript"
            className="input-field"
            onChange={e => this.setState({ code: e.target.value })}
            placeholder="add code"
            style={{ height: "60px" }}
          />
          <input
            type="text"
            className="input-field"
            onChange={e => this.setState({ originUrl: e.target.value })}
            placeholder="add link"
          />
          <input
            type="text"
            className="input-field"
            onChange={e => this.setState({ labels: e.target.value.split(",") })}
            placeholder="add labels"
          />
          <div className="radio">
            <label>
              <input
                type="radio"
                value="public"
                checked={this.state.isPublic === "public"}
                onChange={e => this.setState({ isPublic: e.target.value })}
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
                onChange={e => this.setState({ isPublic: e.target.value })}
              />
              Private
            </label>
          </div>
          <button
            type="submit"
            onClick={() => this.props.newPostSubmit(this.state)}
          >
            Add a Log
          </button>
        </div>
      </div>
    );
  }
}

export default AddPost;
