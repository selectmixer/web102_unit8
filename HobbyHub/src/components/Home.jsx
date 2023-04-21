import React from "react";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import supabase from "../client";


const Home = ( {posts, setPosts, upvotePost, downvotePost, addPost, deletePost} ) => {
    
    const [search, setSearch] = useState('');
    
    useEffect(() => {
        const fetchPosts = async () => {
            let { data: posts, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
            if (error) console.log('error', error);
            else setPosts(posts);
            
        };

        fetchPosts();
    }, [posts]);


    const filteredPosts = posts.filter((post) => {
        return post.title.toLowerCase().includes(search.toLowerCase());
    });


  return (
    <div>
        <h1>Home</h1>
        <input type="text" placeholder="Search" onChange={e => setSearch(e.target.value)} />

        <h2>Posts</h2>
        <div className="posts">
            {filteredPosts.map((post) => (
                <div className="post" key={post.id}>
                    <div className="post-link">
                        <Link to={`/post/${post.id}`}>
                            <img src={post.image_url} alt="" className="card-image" />
                            <h2 className="post-title">{post.title}</h2>
                        </Link>
                    </div>
                    {/* <div className="post-content">
                        <p>{post.content}</p>
                    </div> */}
                    <div className="post-buttons">
                    {/* <p>{post.upvotes} Upvotes</p>
                    <p>{post.downvotes} Downvotes</p> */}
                    <button onClick={() => upvotePost(post.id)} className="upvote-button"> {post.upvotes} Upvotes</button>
                    <button onClick={() => downvotePost(post.id)}className="downvote-button">{post.downvotes} Downvotes</button>
                    </div>

                </div>
            ))}
        </div>

        <Link to="/create"> <button>Create Post</button> </Link>

    </div>
  )
}

export default Home