import { useState, useEffect } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import supabase from './client'

import Home from './components/Home';
import CreatePost from './components/CreatePost';
import Post from './components/Post';

function App() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetchPosts();
  }, [])

  const fetchPosts = async () => {
    let { data: posts, error } = await supabase.from('posts').select('*');
    if (error) console.log('error', error);
    else setPosts(posts);
  };

  const addPost = async (title, content, image) => {
    let { data: post, error } = await supabase.from('posts').insert([
      { 
      title, 
      content, 
      image,
      upvotes: 0,
      downvotes: 0,
      created_at: new Date().toISOString(),
      }
    ]);
    if (error) console.log('error', error);
    else setPosts([...posts, post]);
  };

  const upvotePost = async (id) => {
    let { data: post, error } = await supabase
      .from('posts')
      .update({ upvotes: supabase.raw('upvotes + 1') })
      .match({ id });
    if (error) console.log('error', error);
    else {
      let updatedPosts = posts.map((post) => {
        if (post.id === id) {
          return { ...post, upvotes: post.upvotes + 1 };
        }
        return post;
      });
      setPosts(updatedPosts);
    }
  };

  const downvotePost = async (id) => {
    let { data: post, error } = await supabase
      .from('posts')
      .update({ downvotes: supabase.raw('downvotes + 1') })
      .match({ id });
    if (error) console.log('error', error);
    else {
      let updatedPosts = posts.map((post) => {
        if (post.id === id) {
          return { ...post, downvotes: post.downvotes + 1 };
        }
        return post;
      });
      setPosts(updatedPosts);
    }
  };

  const deletePost = async (id) => {
    let { error } = await supabase.from('posts').delete().match({ id });
    if (error) console.log('error', error);
    else {
      let filteredPosts = posts.filter((post) => post.id !== id);
      setPosts(filteredPosts);
    }
  };

  return (
    <div className="App">
      <Router>
        <Routes>
          
          <Route path="/" 
            element={<Home 
              posts={posts}
              upvotePost={upvotePost}
              downvotePost={downvotePost}
              deletePost={deletePost}
            />}
          ></Route>


          <Route path="/create" 
            element={<CreatePost 
              addPost={addPost} />}
          ></Route>

          <Route path="/post/:id" 
            element={<Post 
              posts={posts} 
              deletePost={deletePost} 
              upvotePost={upvotePost} 
              downvotePost={downvotePost} 
          />}></Route>
          
        </Routes>
      </Router>

    </div>
  )
}

export default App
