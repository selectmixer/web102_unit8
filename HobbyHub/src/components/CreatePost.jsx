import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../client'


const CreatePost = () => {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [image, setImage] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true);
        const { data, error } = await supabase.from('posts').insert([
            {
                title,
                content,
                image_url: image,
                upvotes: 0,
                downvotes: 0,
                created_at: new Date().toISOString(),
            }
        ])        
        setLoading(false);

        if (error) {
            console.log('error', error)
        } else {
            console.log('data', data)
            navigate('/post/' + data[0].id)
        }
    }

  return (
    <div>
        <h1>Create Post</h1>
        <form onSubmit={handleSubmit}> 
            <label>Post Title</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} />

            <label>Post Content</label>
            <textarea required value={content} onChange={(e) => setContent(e.target.value)} />

            <label>Post Image</label>
            <input type="text" value={image} onChange={(e) => setImage(e.target.value)} />

            {!loading && <button>Create Post</button>}
            {loading && <button disabled>Creating Post...</button>}
        </form>

    </div>
  )
}


export default CreatePost
