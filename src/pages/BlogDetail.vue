<template>
  <div class="blog-layout">
    <!-- 左侧音乐播放器和返回按钮 -->
    <div class="music-sidebar" v-if="blog">
      <v-btn
        class="back-btn" 
        icon="mdi-arrow-left" 
        color="primary" 
        variant="tonal" 
        to="/blog"
        size="large"
      ></v-btn>
      
      <div class="like-section">
        <v-btn
          class="like-btn"
          :color="isLiked ? 'error' : 'primary'"
          :variant="isLiked ? 'flat' : 'tonal'"
          @click="toggleLike"
          prepend-icon="mdi-heart"
          rounded="xl"
          size="small"
        >
          {{ likeCount }} 点赞
        </v-btn>
      </div>
    </div>

    <!-- 中央博客内容 -->
    <div class="blog-content-area" ref="contentArea" @scroll="updateReadingProgress">
      <div v-if="loading" class="text-center ma-5">
        <v-progress-circular indeterminate color="primary" size="60"></v-progress-circular>
        <p class="mt-3">加载博客内容中...</p>
      </div>
      
      <div v-else-if="blog" class="blog-container">
        <div class="blog-header">
          <h1 class="blog-title">{{ blog.title }}</h1>
          <div class="blog-meta">
            <v-chip size="small" class="mr-2" color="primary" variant="flat">{{ formatDate(blog.publishDate) }}</v-chip>
            <v-chip size="small" v-for="tag in blog.tags" :key="tag" class="mr-2" color="secondary" variant="flat">
              {{ tag }}
            </v-chip>
            <span class="reading-time">{{ estimatedReadingTime }} 分钟阅读</span>
          </div>
        </div>
        
        <div class="blog-main-content">
          <div class="markdown-content" v-html="blogContent" ref="markdownContent"></div>
        </div>
      </div>
      
      <div v-else class="text-center ma-5">
        <v-alert type="error">博客不存在或加载失败</v-alert>
        <v-btn class="mt-4" variant="tonal" color="primary" to="/blog">
          返回博客列表
        </v-btn>
      </div>
    </div>

    <!-- 右侧目录 -->
    <div class="toc-sidebar" v-if="blog && !loading">
      <div class="toc-container">
        <h3 class="toc-title">TABLE OF CONTENTS</h3>
        <div class="toc-content">
          <ul class="toc-list">
            <li v-for="(item, index) in tocItems" :key="index" 
                :class="{
                  'toc-h1': item.level === 1, 
                  'toc-h2': item.level === 2, 
                  'toc-h3': item.level === 3,
                  'active': activeHeadingId === item.id
                }" 
                @click="scrollToHeading(item.id)">
              {{ item.text }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 阅读进度条 -->
    <div class="reading-progress-container">
      <div class="reading-progress-bar" :style="{ width: readingProgress + '%' }"></div>
      <div class="reading-progress-text">{{ readingProgress }} %</div>
    </div>

    <!-- 返回顶部按钮 -->
    <v-btn
      v-show="showBackToTop"
      class="back-to-top-btn"
      icon="mdi-arrow-up"
      color="primary"
      variant="tonal"
      size="large"
      @click="scrollToTop"
    ></v-btn>
  </div>
</template>

<script>
import { getBlogList, formatDate, getBlogLikes, hasUserLiked, toggleLikeBlog, getFullBlogContent } from '../utils/blogUtils';
import { marked } from 'marked';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export default {
  name: 'BlogDetailPage',
  data() {
    return {
      blog: null,
      blogContent: '',
      loading: true,
      likeCount: 0,
      isLiked: false,
      tocItems: [],
      readingProgress: 0,
      showBackToTop: false,
      activeHeadingId: null,
      estimatedReadingTime: 0
    }
  },
  async mounted() {
    const blogId = this.$route.params.id;
    try {
      this.loading = true;
      // 获取博客列表
      const blogs = await getBlogList();
      this.blog = blogs.find(blog => blog.id === blogId);
      
      if (this.blog) {
        // 获取点赞信息
        this.likeCount = getBlogLikes(this.blog.id);
        this.isLiked = hasUserLiked(this.blog.id);
        
        // 获取完整博客内容
        await this.fetchBlogContent();
        
        // 添加一个小延迟，确保DOM更新后再生成目录
        setTimeout(() => {
          this.generateTOC();
          this.calculateReadingTime();
          // 添加滚动事件监听
          this.setupScrollListener();
          // 直接渲染数学公式
          this.renderMathInElement();
        }, 100);
      }
    } catch (error) {
      console.error('Failed to load blog details:', error);
    } finally {
      this.loading = false;
    }
  },
  beforeUnmount() {
    // 移除滚动事件监听
    if (this.$refs.contentArea) {
      this.$refs.contentArea.removeEventListener('scroll', this.handleScroll);
    }
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    formatDate,
    async fetchBlogContent() {
      try {
        if (!this.blog || !this.blog.folder) {
          throw new Error('Blog or folder not found');
        }
        
        // 获取完整博客内容（Markdown格式）
        const markdownContent = await getFullBlogContent(this.blog.folder);
        
        if (markdownContent) {
          // 去除Markdown的前部元数据
          const contentWithoutFrontmatter = this.removeFrontMatter(markdownContent);
          
          // 使用基本的marked渲染，不处理数学公式
          this.blogContent = marked(contentWithoutFrontmatter);
        } else {
          // 如果无法获取博客内容，则显示一个后备内容
          this.blogContent = this.getSimulatedContent(this.blog.id);
        }
      } catch (error) {
        console.error('Error fetching blog content:', error);
        // 如果出错，则显示一个后备内容
        this.blogContent = this.getSimulatedContent(this.blog.id);
      }
    },
    removeFrontMatter(markdown) {
      const match = markdown.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
      return match ? match[2] : markdown;
    },
    getSimulatedContent(id) {
      // 后备内容，当无法获取实际博客内容时使用
      const contents = {
        'computer-network': `
          <h1>计算机网络基础</h1>
          <h3>用寄送快递的例子来理解整个通信流程</h3>
          <ol>
            <li>主机（<code>10.11.2.151</code>）=寄件人</li>
            <li>交换机 = 小区快递柜（负责本楼栋的快递收发）</li>
            <li>网关（<code>10.11.2.1</code>） = 小区门卫（整个小区的出入口）</li>
          </ol>
          <p>无法加载完整内容，请检查网络连接。</p>
        `,
        'machine-learning': `
          <h1>机器学习入门基础</h1>
          <h2>什么是机器学习？</h2>
          <p>机器学习是人工智能的一个分支，它专注于开发能够从数据中学习并做出预测的算法。与传统编程不同，机器学习不需要显式的规则编程，而是通过从数据中学习模式来执行任务。</p>
          <p>无法加载完整内容，请检查网络连接。</p>
        `,
        'docker': `
          <h1>Docker容器化技术入门</h1>
          <h2>什么是Docker？</h2>
          <p>Docker是一个开源的容器化平台，它使开发者能够将应用程序与其依赖项打包到一个称为容器的可移植单元中，以确保应用程序在任何环境中都能一致地运行。</p>
          <p>无法加载完整内容，请检查网络连接。</p>
        `
      };
      
      return contents[id] || '<p>内容不可用</p>';
    },
    toggleLike() {
      if (this.blog) {
        this.likeCount = toggleLikeBlog(this.blog.id);
        this.isLiked = !this.isLiked;
      }
    },
    generateTOC() {
      // 查找所有标题元素
      if (!this.$refs.markdownContent) return;
      
      const headings = this.$refs.markdownContent.querySelectorAll('h1, h2, h3');
      this.tocItems = [];
      
      // 为每个标题添加ID并创建目录项
      headings.forEach((heading, index) => {
        const id = `heading-${index}`;
        heading.id = id;
        
        const level = parseInt(heading.tagName.substring(1)); // 获取标题级别 (1, 2, 3)
        this.tocItems.push({
          id,
          text: heading.textContent,
          level,
          element: heading
        });
      });
    },
    scrollToHeading(id) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        this.activeHeadingId = id;
      }
    },
    setupScrollListener() {
      // 使用内容区域的滚动事件来更新进度
      const contentArea = this.$refs.contentArea;
      if (contentArea) {
        contentArea.addEventListener('scroll', this.handleScroll);
        
        // 初始检查一次滚动状态
        this.$nextTick(() => {
          this.handleScroll();
        });
      } else {
        // 如果没有找到内容区域，使用窗口滚动事件
        window.addEventListener('scroll', this.handleScroll);
      }
    },
    handleScroll() {
      this.updateReadingProgress();
      this.checkBackToTopButton();
      this.updateActiveHeading();
    },
    updateReadingProgress() {
      if (!this.$refs.contentArea) return;
      
      const contentArea = this.$refs.contentArea;
      const scrollTop = contentArea.scrollTop;
      const scrollHeight = contentArea.scrollHeight;
      const clientHeight = contentArea.clientHeight;
      
      // 计算阅读进度百分比
      const scrollPercent = Math.round((scrollTop / (scrollHeight - clientHeight)) * 100);
      this.readingProgress = Math.min(Math.max(scrollPercent, 0), 100);
    },
    checkBackToTopButton() {
      if (!this.$refs.contentArea) return;
      
      const scrollTop = this.$refs.contentArea.scrollTop;
      this.showBackToTop = scrollTop > 300;
    },
    scrollToTop() {
      if (this.$refs.contentArea) {
        this.$refs.contentArea.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    },
    updateActiveHeading() {
      if (!this.tocItems.length || !this.$refs.contentArea) return;
      
      const scrollTop = this.$refs.contentArea.scrollTop;
      const contentArea = this.$refs.contentArea;
      const scrollPosition = scrollTop + 100; // 添加一点偏移量
      
      // 找到当前视口中最顶部的标题
      let activeHeading = null;
      
      for (let i = 0; i < this.tocItems.length; i++) {
        const item = this.tocItems[i];
        const element = document.getElementById(item.id);
        
        if (element && element.offsetTop <= scrollPosition) {
          activeHeading = item;
        } else if (element && element.offsetTop > scrollPosition && activeHeading) {
          break;
        }
      }
      
      if (activeHeading) {
        this.activeHeadingId = activeHeading.id;
      }
    },
    calculateReadingTime() {
      if (!this.$refs.markdownContent) return;
      
      // 获取文本内容
      const text = this.$refs.markdownContent.textContent || '';
      // 粗略估计阅读时间：以每分钟阅读200字为基准
      const wordCount = text.trim().split(/\s+/).length;
      const readingTime = Math.max(1, Math.ceil(wordCount / 200));
      
      this.estimatedReadingTime = readingTime;
    },
    // 新增方法：直接在DOM中查找和渲染数学公式
    renderMathInElement() {
      if (!this.$refs.markdownContent) return;
      
      try {
        const content = this.$refs.markdownContent;
        
        // 查找所有文本节点
        const textNodes = [];
        const walker = document.createTreeWalker(
          content,
          NodeFilter.SHOW_TEXT,
          null,
          false
        );
        
        let node;
        while (node = walker.nextNode()) {
          textNodes.push(node);
        }
        
        // 处理包含数学公式的文本节点
        textNodes.forEach(textNode => {
          const text = textNode.nodeValue;
          
          // 检查是否包含数学公式
          if (text.includes('$$') || text.includes('$')) {
            const parent = textNode.parentNode;
            
            // 处理行间公式 $$...$$
            if (text.includes('$$')) {
              const parts = text.split(/(\$\$[\s\S]+?\$\$)/g);
              if (parts.length > 1) {
                const fragment = document.createDocumentFragment();
                
                parts.forEach(part => {
                  if (part.startsWith('$$') && part.endsWith('$$')) {
                    try {
                      // 提取公式内容
                      const formula = part.substring(2, part.length - 2).trim();
                      
                      // 创建一个新元素来放置渲染后的公式
                      const span = document.createElement('span');
                      span.innerHTML = katex.renderToString(formula, {
                        displayMode: true,
                        throwOnError: false
                      });
                      fragment.appendChild(span);
                    } catch (e) {
                      console.error('渲染行间公式错误:', e);
                      const textNode = document.createTextNode(part);
                      fragment.appendChild(textNode);
                    }
                  } else {
                    const textNode = document.createTextNode(part);
                    fragment.appendChild(textNode);
                  }
                });
                
                // 替换原始节点
                parent.replaceChild(fragment, textNode);
              }
            }
            
            // 处理行内公式 $...$
            else if (text.includes('$')) {
              const parts = text.split(/(\$[^\$]+?\$)/g);
              if (parts.length > 1) {
                const fragment = document.createDocumentFragment();
                
                parts.forEach(part => {
                  if (part.startsWith('$') && part.endsWith('$')) {
                    try {
                      // 提取公式内容
                      const formula = part.substring(1, part.length - 1).trim();
                      
                      // 创建一个新元素来放置渲染后的公式
                      const span = document.createElement('span');
                      span.innerHTML = katex.renderToString(formula, {
                        displayMode: false,
                        throwOnError: false
                      });
                      fragment.appendChild(span);
                    } catch (e) {
                      console.error('渲染行内公式错误:', e);
                      const textNode = document.createTextNode(part);
                      fragment.appendChild(textNode);
                    }
                  } else {
                    const textNode = document.createTextNode(part);
                    fragment.appendChild(textNode);
                  }
                });
                
                // 替换原始节点
                parent.replaceChild(fragment, textNode);
              }
            }
          }
        });
      } catch (e) {
        console.error('渲染数学公式时出错:', e);
      }
    }
  }
}
</script>

<style scoped>
/* 全局背景色 */
.blog-layout {
  display: grid;
  grid-template-columns: 100px 1fr 250px;
  min-height: 100vh;
  background-color: #ffffff; /* 纯白色背景 */
  padding-top: 60px; /* 为导航栏预留空间 */
  position: relative;
}

/* 左侧边栏 */
.music-sidebar {
  padding: 20px 10px;
}

.back-btn {
  margin-bottom: 20px;
}

.like-section {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

/* 中间内容区 */
.blog-content-area {
  padding: 20px;
  display: flex;
  justify-content: center;
  overflow-y: auto;
  height: calc(100vh - 60px);
  scrollbar-width: thin;
  scrollbar-color: #d0d0d0 #f5f5f5;
  overflow-x: hidden; /* 防止水平滚动 */
}

.blog-content-area::-webkit-scrollbar {
  width: 8px;
}

.blog-content-area::-webkit-scrollbar-track {
  background: #f5f5f5;
}

.blog-content-area::-webkit-scrollbar-thumb {
  background-color: #d0d0d0;
  border-radius: 4px;
}

.blog-container {
  max-width: 800px;
  width: 100%;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.05);
  overflow: visible; /* 修改为可见,允许内容溢出容器 */
}

.blog-header {
  padding: 30px 30px 20px;
  border-bottom: 1px solid #eee;
}

.blog-title {
  color: #333;
  margin-bottom: 15px;
  font-size: 2.2rem;
}

.blog-meta {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
  align-items: center;
}

.reading-time {
  color: #888;
  font-size: 0.9rem;
  margin-left: auto;
}

.blog-main-content {
  padding: 30px;
}

/* 右侧目录 */
.toc-sidebar {
  padding: 20px 10px;
}

.toc-container {
  position: sticky;
  top: 80px;
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.toc-title {
  margin-bottom: 15px;
  color: #333;
  font-size: 1.2rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.toc-list {
  list-style-type: none;
  padding-left: 0;
  margin-top: 10px;
}

.toc-list li {
  margin-bottom: 8px;
  cursor: pointer;
  color: #555;
  transition: all 0.2s;
  padding: 3px 0;
  border-left: 2px solid transparent;
  padding-left: 10px;
}

.toc-list li:hover {
  color: #1976D2;
  border-left-color: #1976D2;
}

.toc-list li.active {
  color: #1976D2;
  border-left-color: #1976D2;
  font-weight: bold;
}

.toc-h1 {
  font-weight: bold;
  margin-top: 10px;
}

.toc-h2 {
  padding-left: 15px !important;
  font-size: 0.95rem;
}

.toc-h3 {
  padding-left: 30px !important;
  font-size: 0.9rem;
  color: #777;
}

/* 阅读进度条 */
.reading-progress-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.reading-progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  background-color: #1976D2;
  transition: width 0.3s;
}

.reading-progress-text {
  color: #1976D2;
  font-size: 0.85rem;
  font-weight: bold;
}

/* 返回顶部按钮 */
.back-to-top-btn {
  position: fixed;
  bottom: 80px;
  right: 20px;
  z-index: 100;
  opacity: 0.8;
  transition: opacity 0.3s;
}

.back-to-top-btn:hover {
  opacity: 1;
}

/* Markdown 内容样式 */
.markdown-content {
  line-height: 1.8;
}

.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3) {
  margin-top: 25px;
  margin-bottom: 15px;
  color: #333;
}

.markdown-content :deep(h1) {
  font-size: 2rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.markdown-content :deep(h2) {
  font-size: 1.7rem;
}

.markdown-content :deep(h3) {
  font-size: 1.4rem;
}

.markdown-content :deep(p) {
  margin-bottom: 15px;
}

.markdown-content :deep(code) {
  background-color: #f0f0f0;
  padding: 2px 5px;
  border-radius: 3px;
  font-family: 'Courier New', Courier, monospace;
}

.markdown-content :deep(pre) {
  background-color: #f8f8f8;
  padding: 15px;
  border-radius: 5px;
  overflow-x: auto;
  margin-bottom: 20px;
}

.markdown-content :deep(img) {
  max-width: 100%;
  border-radius: 5px;
  margin: 10px 0;
}

.markdown-content :deep(blockquote) {
  border-left: 4px solid #1976D2;
  padding-left: 15px;
  color: #555;
  font-style: italic;
  margin: 20px 0;
}

/* 添加数学公式相关样式 */
.markdown-content :deep(.katex-display) {
  overflow-x: auto;
  overflow-y: hidden;
  padding: 10px 0;
}

.markdown-content :deep(.katex) {
  font-size: 1.1em;
}

.markdown-content :deep(.katex-error) {
  color: #f44336;
}

/* 响应式设计 */
@media (max-width: 900px) {
  .blog-layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
  }
  
  .music-sidebar {
    grid-row: 1;
    display: flex;
    justify-content: space-between;
    padding: 10px 20px;
  }
  
  .blog-content-area {
    grid-row: 2;
    height: calc(100vh - 120px); /* 调整高度以适应移动设备 */
    max-height: none;
    padding-bottom: 80px; /* 为底部导航和进度条留出空间 */
  }
  
  .toc-sidebar {
    grid-row: 3;
    padding: 20px;
  }
  
  .toc-container {
    position: static;
  }
  
  .reading-progress-container {
    bottom: 10px;
    right: 10px;
  }
}
</style> 