import React from "react";
import "./EditPost.css";

const Post = props => {
  const { post } = props;
  return (
    <div className="edit-form">
      <h3>Edit this log</h3>
      <br />
      <input
        type="text"
        value={post.title}
        className="input-field"
        onChange={e => this.setState({ title: e.target.value })}
        placeholder="add title"
      />
      <textarea
        type="text"
        value={post.message}
        className="input-field"
        onChange={e => this.setState({ message: e.target.value })}
        placeholder="add post"
        style={{ dheight: "60px" }}
      />
      <textarea
        type="text/javascript"
        value={post.code}
        className="input-field"
        onChange={e => this.setState({ code: e.target.value })}
        placeholder="add code"
        style={{ height: "60px" }}
      />
      <input
        type="text"
        value={post.originalUrl}
        className="input-field"
        onChange={e => this.setState({ originUrl: e.target.value })}
        placeholder="add link"
      />
      <input
        type="text"
        value={post.labels.join(",")}
        className="input-field"
        onChange={e =>
          this.setState({
            labels: e.target.value.split(",")
          })
        }
        placeholder="add labels"
      />
      <div className="radio">
        <label>
          <input
            type="radio"
            value="public"
            checked={post.isPublic === true}
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
            checked={post.isPublic === false}
            onChange={e => this.setState({ isPublic: e.target.value })}
          />
          Private
        </label>
      </div>
      <div className="edit-action">
        <button type="submit" onClick={() => props.cancelPostEdit(post._id)}>
          Cancel
        </button>
        <button type="submit" onClick={() => this.putDataToDB()}>
          Update
        </button>
      </div>
    </div>
  );
};

export default Post;
