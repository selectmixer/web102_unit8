import { useState, useEffect } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import supabase from './client'

import Home from './components/Home';
import CreatePost from './components/CreatePost';
import EditPost from './components/EditPost';
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
        .select('*')
        .eq('id', id)
        .single()
    let newUpvotes = post.upvotes + 1
    if (error) console.log('error', error)
    else {
        let { data: post, error } = await supabase
            .from('posts')
            .update({ upvotes: newUpvotes })
            .match({ id })
        if (error) console.log('error', error)
        // re-render the post
        else {
            let updatedPosts = posts.map((post) => {
                if (post.id === id) {
                    return { ...post, upvotes: post.upvotes + 1 }
                }
                return post
            })
            setPosts(updatedPosts)
        }
    }
}

const downvotePost = async (id) => {
    let { data: post, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()
    let newDownvotes = post.downvotes + 1
    if (error) console.log('error', error)
    else {
        let { data: post, error } = await supabase
            .from('posts')
            .update({ downvotes: newDownvotes })
            .match({ id })
        if (error) console.log('error', error)
        else {

            let updatedPosts = posts.map((post) => {
                if (post.id === id) {
                    return { ...post, downvotes: post.downvotes + 1 }
                }
                return post
            })
            setPosts(updatedPosts)
        }
    }
}
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
              setPosts={setPosts}
              upvotePost={upvotePost}
              downvotePost={downvotePost}
              addPost={addPost}
              deletePost={deletePost}
            />}
          ></Route>


          <Route path="/create" 
            element={<CreatePost 
              posts={posts}
              setPosts={setPosts}
              upvotePost={upvotePost}
              downvotePost={downvotePost}
              addPost={addPost}
              deletePost={deletePost}
            />}
          ></Route>

          <Route path="/edit/:id"
            element={<EditPost
              posts={posts}
              setPosts={setPosts}
              upvotePost={upvotePost}
              downvotePost={downvotePost}
              addPost={addPost}
              deletePost={deletePost}
              fetchPosts={fetchPosts}
            />}
          ></Route>

          <Route path="/post/:id" 
            element={<Post 
              posts={posts}
              setPosts={setPosts}
              upvotePost={upvotePost}
              downvotePost={downvotePost}
              addPost={addPost}
              deletePost={deletePost}
            />}
          ></Route>
          
        </Routes>
      </Router>

    </div>
  )
}

export default App
