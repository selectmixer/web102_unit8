import React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Link, BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import supabase from '../client'

const Post = ({posts, setPosts, upvotePost, downvotePost, addPost, deletePost}) => {
    const { id } = useParams()
    const [post, setPost] = useState(null)
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')
    const [count, setCount] = useState(0)
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            let { data: post, error } = await supabase
                .from('posts')
                .select('*')
                .eq('id', id)
                .single()
            if (error) console.log('error', error)
            else setPost(post)
        }
        
        const fetchComments = async () => {
            let { data: comments, error } = await supabase
                .from('comments')
                .select('*')
                .eq('post_id', id)
            // console.log (comments)
            if (error) console.log('error', error)
            else setComments(comments)
        }

        fetchPost()
        fetchComments()
    }, [id, posts])


    const handleSubmitComment = async (e) => {
        e.preventDefault()
        let data = { post_id: id, content: newComment, created_at: new Date().toISOString(), count: count }
        setCount(count + 1)
        let { data: comment, error } = await supabase
            .from('comments')
            .insert([
                {
                    post_id: id,
                    count: count,
                    content: newComment,
                    created_at: new Date().toISOString(),
                }
            ]).select()

        if (error) console.log('error', error)
        else {
            console.log(data, 'data')
            setComments([...comments, data])
            setNewComment('')
        }
    }

    const handleDelete = async (id) => {
        deletePost(id)
        navigate('/')
      };

    if (!post) return <div>Loading...</div>


  return (
    <div>
        <Link to="/"> <button>Home</button> </Link>
        <button onClick={() => handleDelete(post.id)}>Delete Post</button>
        <h1>{post.title}</h1>
        <div className='post-image-wrapper' >
        {post.image_url && <img className='post-image' src={post.image_url} alt="post" />}
        </div>
        <p>{post.content}</p>
        <p>{post.upvotes} upvotes</p>
        <p>{post.downvotes} downvotes</p>
        <button onClick={() => upvotePost(post.id)}> {post.upvotes} Upvote</button>
        <button onClick={() => downvotePost(post.id)}> {post.downvotes} Downvote</button>

        <h3>Comments ({comments.length})</h3>
      {comments.map((comment) => (
        <div key={comment.id} className='comment-row'>
          <p className='comment-text'>{comment.content}</p>
          <p className='comment-text'>{new Date(comment.created_at).toLocaleDateString()}</p>
        </div>
      ))}

      <form onSubmit={handleSubmitComment}>
        <label htmlFor="new-comment">Leave a comment:</label>
        <br />
        <textarea
          id="new-comment"
          value={newComment}
          onChange={(event) => setNewComment(event.target.value)}
          className="comment-input"
        ></textarea>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Post;