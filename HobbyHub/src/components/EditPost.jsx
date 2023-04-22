import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import supabase from '../client'

const EditPost = ({posts, setPosts, upvotePost, downvotePost, addPost, deletePost, fetchPosts}) => {
    const { id } = useParams()
    const [post, setPost] = useState(null)
    const [newTitle, setNewTitle] = useState('')
    const [newContent, setNewContent] = useState('')
    const [newImage, setNewImage] = useState('')
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate();
    
    const fetchPost = async () => {
        let { data: post, error } = await supabase
            .from('posts')
            .select('*')
            .eq('id', id)
            .single()
        if (error) console.log('error', error)
        else {
            setPost(post)
            setNewTitle(post.title)
            setNewContent(post.content)
            setNewImage(post.image_url)
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPost()
    }, [id, posts])

    if (loading) return <div>Loading...</div>


    const handleSubmit = async (e) => {
        e.preventDefault()
        let { data: post, error } = await supabase
            .from('posts')
            .update([
                {
                    title: newTitle,
                    content: newContent,
                    image_url: newImage,
                }
            ])
            .eq('id', id)
        if (error) console.log('error', error)
        else {
            console.log(post, 'post')
            setPosts(posts.map((post) => post.id === id ? {...post, title: newTitle, content: newContent, image: newImage, upvotes: post.upvotes, downvotes: post.downvotes, created_at: post.created_at} : post))
            navigate('/')
        }
    }

    return (
        <div >
            <h2>Edit Post</h2>

            {/* back to post page button */}
            <Link to={`/post/${id}`}> Back to Post </Link>

            <form onSubmit={handleSubmit} className='create-post-form'> 
                <label>Title</label>
                <input 
                    className='create-post-field'
                    type="text" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                />
                <label>Content</label>
                <input 
                    className='create-post-field'
                    type="text" 
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                />
                <label>Image</label>
                <input 
                    className='create-post-field'
                    type="text" 
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                />

                <button>Update Post</button>
            </form>
        </div>
    )
}

export default EditPost

