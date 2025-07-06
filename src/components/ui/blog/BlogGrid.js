import React from 'react'
import Grid from '@mui/material/Grid';
import BlogCard from './BlogCard';


function BlogGrid({ posts }) {
  return (
    <Grid container spacing={2} columns={12} mt={4}>
      {posts.map((post, index) => (
        <Grid item size={{ xs: 12, md: 6 }} key={index}>
          <BlogCard {...post} />
        </Grid>
      ))}
    </Grid>
  )
}

export default BlogGrid