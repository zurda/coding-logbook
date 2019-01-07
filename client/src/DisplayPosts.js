import React from "react";
import Post from "./Post";

const DisplayPosts = props => {
  return (
    <div>
      {props.data.map(post => (
        <Post key={post._id} post={post} handleDelete={props.handleDelete} />
      ))}
    </div>
  );
};

export default DisplayPosts;
