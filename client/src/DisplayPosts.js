import React from "react";
import Post from "./Post";
import EditPost from "./EditPost";

const DisplayPosts = props => {
  return (
    <div>
      {document.cookie
        ? props.data.map(post => (
            <Post
              key={post._id}
              post={post}
              handleDelete={props.handleDelete}
            />
          ))
        : props.data.map(post =>
            post.isPublic && props.postsToEdit.includes(post._id) ? (
              <EditPost
                key={post._id}
                post={post}
                handleDelete={props.handleDelete}
                postsToEdit={props.postsToEdit}
                editPostHandler={props.editPostHandler}
                cancelPostEdit={props.cancelPostEdit}
              />
            ) : (
              <Post
                key={post._id}
                post={post}
                handleDelete={props.handleDelete}
                postsToEdit={props.postsToEdit}
                editPostHandler={props.editPostHandler}
              />
            )
          )}
    </div>
  );
};

export default DisplayPosts;
