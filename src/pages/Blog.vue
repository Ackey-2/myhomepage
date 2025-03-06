<template>
  <div class="page-container">
    <div class="page-content">
      <h1 class="page-title">我的博客</h1>
      
      <div v-if="loading" class="text-center ma-5">
        <v-progress-circular indeterminate color="primary" size="60"></v-progress-circular>
        <p class="mt-3">加载博客内容中...</p>
      </div>
      
      <v-row v-else>
        <v-col v-for="(blog, index) in blogs" :key="index" cols="12" sm="6" md="4">
          <v-card class="blog-card" height="100%" variant="tonal">
            <v-img
              :src="blog.heroImage.src"
              height="200px"
              cover
              class="blog-image"
              :style="{ backgroundColor: blog.heroImage.color }"
            ></v-img>
            <v-card-title>{{ blog.title }}</v-card-title>
            <v-card-subtitle>
              {{ formatDate(blog.publishDate) }}
              <v-chip size="x-small" class="ml-2 like-chip" prepend-icon="mdi-heart" variant="outlined">
                {{ getBlogLikes(blog.id) }}
              </v-chip>
            </v-card-subtitle>
            <v-card-text>{{ blog.description }}</v-card-text>
            <v-card-actions>
              <v-btn
                variant="tonal"
                color="var(--leleo-vcard-color)"
                :to="'/blog/' + blog.id"
              >
                阅读更多
              </v-btn>
              <v-spacer></v-spacer>
              <v-chip size="small" v-for="tag in blog.tags" :key="tag" class="ma-1">
                {{ tag }}
              </v-chip>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <div v-if="blogs.length === 0 && !loading" class="text-center ma-5">
        <v-alert type="info">暂无博客内容</v-alert>
      </div>
    </div>
  </div>
</template>

<script>
import { getBlogList, formatDate, getBlogLikes } from '../utils/blogUtils';

export default {
  name: 'BlogPage',
  data() {
    return {
      blogs: [],
      loading: true
    }
  },
  async mounted() {
    try {
      this.loading = true;
      this.blogs = await getBlogList();
    } catch (error) {
      console.error('Failed to load blogs:', error);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    formatDate,
    getBlogLikes
  }
}
</script>

<style scoped>
.page-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  color: var(--leleo-welcometitle-color, #FFFFFF);
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.5rem;
}

.page-content {
  backdrop-filter: blur(10px);
  padding: 20px;
  border-radius: 10px;
}

.blog-card {
  transition: transform 0.3s ease;
  margin-bottom: 20px;
}

.blog-card:hover {
  transform: translateY(-5px);
}

.blog-image {
  opacity: 0.85;
}

.like-chip {
  color: #e57373;
}
</style> 