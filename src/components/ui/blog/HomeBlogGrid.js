import React from 'react'
import Grid from '@mui/material/Grid';
import BlogCard from './BlogCard';


function HomeBlogGrid({posts}) {
  return (
    <Grid container spacing={2} columns={12} mt={4}>
      {posts.slice(0,3).map((post, index) => (
        <Grid item size={{ xs: 12, md: 4 }} key={index}>
          <BlogCard {...post} />
        </Grid>
      ))}
    </Grid>
  )
}

export default HomeBlogGrid