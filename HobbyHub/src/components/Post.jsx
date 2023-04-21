import React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import supabase from '../client'


const Post = () => {
    const { id } = useParams()
    const [post, setPost] = useState(null)
    const [posts, setPosts] = useState([])
    const [comments, setComments] = useState([])
    const [newComment, setnewComment] = useState('')

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
            console.log (comments)
            if (error) console.log('error', error)
            else setComments(comments)
        }

        fetchPost()
        fetchComments()
    }, [id, posts])

    const handleSubmit = async (e) => {
        e.preventDefault()
        let { data: comment, error } = await supabase
            .from('comments')
            .insert([
                {
                    post_id: id,
                    content: newComment,
                    created_at: new Date().toISOString(),
                }
            ])
        if (error) console.log('error', error)
        else {
            setComments([...comments, comment])
            setnewComment('')
        }
    }

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


    if (!post) return <div>Loading...</div>


  return (
    <div>Post
        <h1>{post.title}</h1>
        {post.image && <img src={post.image} alt="post" />}
        <p>{post.content}</p>
        <p>{post.upvotes} upvotes</p>
        <p>{post.downvotes} downvotes</p>
        <button onClick={() => upvotePost(post.id)}>Upvote</button>
        <button onClick={() => downvotePost(post.id)}>Downvote</button>

        <h2>Comments</h2>
        <div className="comments">
            {comments.map((comment) => (
                <div key={comment.id}>
                    <p>{comment.content}</p>
                </div>
            ))}

            <form onSubmit={handleSubmit}>
                <input type="text" value={newComment} onChange={(e) => setnewComment(e.target.value)} />
                <button type="submit">Add Comment</button>
            </form>

        </div>

    </div>
  )
}

export default Post