import React from "react";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";


const Home = ( {posts} ) => {
    const [search, setSearch] = useState('');

    const filteredPosts = posts.filter(post => {
        return post.title.toLowerCase().includes(search.toLowerCase())
    })
    
  return (
    <div>
        <h1>Home</h1>
        <input type="text" placeholder="Search" onChange={e => setSearch(e.target.value)} />

        <h2>Posts</h2>
        <div className="posts">
            {filteredPosts.map((post) => (
                <div className="post" key={post.id}>
                    <Link to={`/post/${post.id}`}>
                        <h2>{post.title}</h2>
                    </Link>
                    <p>{post.content}</p>
                    <p>{post.upvotes} upvotes</p>
                    <p>{post.downvotes} downvotes</p>

                </div>
            ))}
        </div>

        <Link to="/create"> <button>Create Post</button> </Link>

    </div>
  )
}

export default Home