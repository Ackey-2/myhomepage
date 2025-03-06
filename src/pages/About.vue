<template>
  <div class="about-container">
    <!-- 返回按钮 -->
    <div class="back-button-container">
      <v-btn
        class="back-button"
        icon="mdi-arrow-left"
        color="primary"
        variant="tonal"
        @click="goBack"
        size="large"
        title="返回上一页"
      ></v-btn>
    </div>

    <!-- 页面头部 -->
    <div class="about-header">
      <h1 class="about-title">关于我</h1>
      <p class="about-subtitle">一个热爱编程和技术的开发者</p>
    </div>

    <!-- 关于我板块 -->
    <div class="about-section">
      <div class="section-header">
        <div class="section-icon">
          <v-icon icon="mdi-account" size="x-large" color="primary"></v-icon>
        </div>
        <h2 class="section-title">关于我</h2>
      </div>
      <div class="section-content">
        <div class="about-me-content">
          <div class="about-me-avatar">
            <v-avatar size="180" rounded="0">
              <v-img src="/img/wukong.jpg" alt="Avatar" fallback-src="/img/1.png"></v-img>
            </v-avatar>
          </div>
          <div class="about-me-text">
            <p>欢迎来到我的个人空间！我是Ackey，一个充满热情的开发者。</p>
            <p>我热爱编程、探索新技术，并且喜欢将想法转化为现实。在这个空间里，我会分享我的项目、博客和一些个人经历。</p>
            <p>除了编程，我还喜欢骑自行车、打羽毛球和烹饪。我相信技术可以改变世界，而学习是终身的旅程。</p>
            
          </div>
        </div>
      </div>
    </div>

    <!-- 我的工具板块 -->
    <div class="about-section">
      <div class="section-header">
        <div class="section-icon">
          <v-icon icon="mdi-tools" size="x-large" color="primary"></v-icon>
        </div>
        <h2 class="section-title">我的工具</h2>
      </div>
      <div class="section-content">
        <div class="tools-grid">
          <div v-for="(tool, index) in tools" :key="index" class="tool-card">
            <v-icon :icon="tool.icon" size="x-large" :color="tool.color"></v-icon>
            <h3>{{ tool.name }}</h3>
            <p>{{ tool.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 教育经历板块 -->
    <div class="about-section">
      <div class="section-header">
        <div class="section-icon">
          <v-icon icon="mdi-school" size="x-large" color="primary"></v-icon>
        </div>
        <h2 class="section-title">教育经历</h2>
      </div>
      <div class="section-content">
        <div class="education-cards">
          <div v-for="(edu, index) in education" :key="index" 
               class="education-card" 
               :style="{ backgroundImage: `url(${edu.logoUrl})` }"
               @click="openWebsite(edu.websiteUrl)"
               :title="`${edu.institution}`">
            <div class="education-card-overlay">
              <div class="education-card-content">
                <h3>{{ edu.institution }}</h3>
                <h4>{{ edu.degree }}</h4>
                <div class="education-year-badge">{{ edu.year }}</div>
                <p>{{ edu.description }}</p>
                <div class="visit-website-btn">
                  <v-icon icon="mdi-open-in-new" size="small" class="mr-1"></v-icon>
                 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 点赞按钮区域 -->
    <div class="like-section">
      <div class="like-container">
        <div class="like-count">{{ likeCount }}</div>
        <v-btn
          class="like-button"
          :color="hasLiked ? 'error' : 'primary'"
          :variant="hasLiked ? 'flat' : 'tonal'"
          @click="toggleLike"
          size="large"
          rounded="xl"
        >
          <v-icon :icon="hasLiked ? 'mdi-heart' : 'mdi-heart-outline'" class="mr-2"></v-icon>
          {{ hasLiked ? '已点赞' : '点赞' }}
        </v-btn>
        <div class="like-text">
          {{ hasLiked ? '感谢您的点赞！' : '如果您喜欢我的个人页面，请点赞支持！' }}
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { onMounted, ref } from 'vue';

export default {
  name: 'AboutPage',
  setup() {
    // 点赞状态
    const likeCount = ref(localStorage.getItem('aboutPageLikes') ? parseInt(localStorage.getItem('aboutPageLikes')) : 0);
    const hasLiked = ref(localStorage.getItem('hasLikedAboutPage') === 'true');

    // 工具列表
    const tools = [
      {
        name: 'C++',
        icon: 'mdi-language-cpp',
        color: '#00599C',
        description: '擅长使用C++进行系统编程和高性能应用开发'
      },
      {
        name: 'Python',
        icon: 'mdi-language-python',
        color: '#3776AB',
        description: '用于数据分析、机器学习和快速原型开发'
      },
      {
        name: 'Docker',
        icon: 'mdi-docker',
        color: '#2496ED',
        description: '容器化应用部署和微服务架构'
      },
      {
        name: 'Linux',
        icon: 'mdi-linux',
        color: '#FCC624',
        description: '熟悉Linux系统管理和Shell脚本编程'
      },
      {
        name: 'Vue.js',
        icon: 'mdi-vuejs',
        color: '#4FC08D',
        description: '前端框架，用于构建交互式网页应用'
      },
      {
        name: '机器学习',
        icon: 'mdi-brain',
        color: '#FF6F61',
        description: '深度学习和自然语言处理模型开发'
      }
    ];

    // 教育经历
    const education = [
      {
        year: '2024 - 至今',
        degree: '新一代电子信息技术',
        institution: '电子科技大学',
        description: '求实求真、大气大为',
        logoUrl: '/img/schools/uestc.jpg',
        websiteUrl: 'https://www.uestc.edu.cn/'
      },
      {
        year: '2019 - 2023',
        degree: '电子信息工程',
        institution: '华中科技大学',
        description: '明德厚学，求是创新',
        logoUrl: '/img/schools/hust.jpg',
        websiteUrl: 'https://www.hust.edu.cn/'
      },
      {
        year: '2016 - 2019',
        degree: '高中',
        institution: '成都棠湖外国语学校',
        description: '仁、德、志、譞',
        logoUrl: '/img/schools/tanghu.jpg',
        websiteUrl: 'https://www.tangwai.com/ver6/home/index.htm'
      }
    ];

    // 打开网站方法
    const openWebsite = (url) => {
      if (url) {
        window.open(url, '_blank');
      }
    };

    // 返回上一页
    const goBack = () => {
      window.history.length > 1 
        ? window.history.back() 
        : window.location.href = '/';
    };

    // 点赞功能
    const toggleLike = () => {
      if (hasLiked.value) {
        likeCount.value--;
        hasLiked.value = false;
      } else {
        likeCount.value++;
        hasLiked.value = true;
      }
      
      // 保存到localStorage
      localStorage.setItem('aboutPageLikes', likeCount.value);
      localStorage.setItem('hasLikedAboutPage', hasLiked.value);
    };

    return {
      tools,
      education,
      openWebsite,
      goBack,
      likeCount,
      hasLiked,
      toggleLike
    };
  }
}
</script>

<style scoped>
.about-container {
  background-color: #f8f9fa;
  min-height: 100vh;
  color: #333;
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
  padding-bottom: 60px;
  position: relative;
}

/* 返回按钮样式 */
.back-button-container {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
}

.back-button {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.back-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

/* 点赞按钮样式 */
.like-section {
  margin: 60px auto 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.like-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 30px;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  max-width: 400px;
  width: 100%;
}

.like-count {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1976D2;
}

.like-button {
  min-width: 120px;
  font-weight: 600;
}

.like-text {
  color: #666;
  text-align: center;
  font-size: 0.95rem;
}

.about-header {
  background-color: #ffffff;
  padding: 60px 20px;
  text-align: center;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
}

.about-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: #3a3a3a;
}

.about-subtitle {
  font-size: 1.2rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
}

.about-section {
  max-width: 1000px;
  margin: 40px auto;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.section-header {
  display: flex;
  align-items: center;
  padding: 20px 30px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eee;
}

.section-icon {
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: rgba(25, 118, 210, 0.1);
}

.section-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #3a3a3a;
  margin: 0;
}

.section-content {
  padding: 30px;
}

/* 关于我样式 */
.about-me-content {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  align-items: flex-start;
}

.about-me-avatar {
  flex: 0 0 180px;
}

.about-me-text {
  flex: 1;
  min-width: 300px;
}

.about-me-text p {
  margin-bottom: 15px;
  line-height: 1.6;
}

/* 工具卡片样式 */
.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

.tool-card {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
}

.tool-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.tool-card h3 {
  margin: 15px 0 10px;
  font-size: 1.3rem;
}

.tool-card p {
  color: #666;
  font-size: 0.9rem;
}

/* 教育经历样式 - 新的卡片样式 */
.education-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  margin-top: 10px;
}

.education-card {
  height: 250px;
  border-radius: 12px;
  
  overflow: hidden;
  position: relative;
  background-size: cover;
  background-position: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer; /* 添加指针样式，表明可点击 */
}

.education-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  
}

.education-card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  transition: background 0.3s ease;
}

.education-card:hover .education-card-overlay {
  background: rgba(0, 0, 0, 0.1);
  
}

.education-card-content {
  color: white;
  text-align: center;
  width: 100%;
}

.education-card-content h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  font-weight: 700;
}

.education-card-content h4 {
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: rgba(255, 255, 255, 0.9);
}

.education-year-badge {
  display: inline-block;
  background-color: #1976D2;
  color: white;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.education-card-content p {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 15px;
}

.visit-website-btn {
  display: inline-flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.education-card:hover .visit-website-btn {
  background-color: rgba(255, 255, 255, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .about-title {
    font-size: 2.5rem;
  }
  
  .about-me-content {
    flex-direction: column;
    align-items: center;
  }
  
  .like-container {
    padding: 20px;
  }
  
  .back-button-container {
    top: 10px;
    left: 10px;
  }
}
</style> 