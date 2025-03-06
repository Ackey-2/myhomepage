<template>
  <div class="page-container">
    <div class="page-content">
      <h1 class="page-title">我的项目</h1>
      
      <v-row>
        <v-col v-for="(project, index) in projects" :key="index" cols="12" sm="6" md="4">
          <v-card class="project-card" height="100%" variant="tonal">
            <v-img
              :src="project.image"
              height="200px"
              cover
              class="project-image"
            ></v-img>
            <v-card-title>{{ project.title }}</v-card-title>
            <v-card-subtitle>{{ project.technology }}</v-card-subtitle>
            <v-card-text>{{ project.description }}</v-card-text>
            <v-card-actions>
              <v-btn
                variant="tonal"
                color="var(--leleo-vcard-color)"
                :href="project.link"
                target="_blank"
              >
                查看项目
              </v-btn>
              <v-spacer></v-spacer>
              <v-chip size="small" v-for="tag in project.tags" :key="tag" class="ma-1">
                {{ tag }}
              </v-chip>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProjectPage',
  data() {
    return {
      projects: [
        {
          title: '个人网站',
          technology: 'Vue 3 + Vuetify',
          description: '这是我的个人网站项目，使用Vue 3和Vuetify构建。包含响应式设计和多种交互功能。',
          image: '/img/1.png',
          link: 'https://github.com',
          tags: ['Vue', 'Vuetify', '前端']
        },
        {
          title: '机器学习模型',
          technology: 'PyTorch + Python',
          description: '基于PyTorch的机器学习模型，用于图像识别和分类任务。',
          image: '/img/1.png',
          link: 'https://github.com',
          tags: ['ML', 'PyTorch', 'Python']
        },
        {
          title: '容器化部署系统',
          technology: 'Docker + Linux',
          description: '一个基于Docker的应用程序部署系统，支持自动化构建和部署。',
          image: '/img/1.png',
          link: 'https://github.com',
          tags: ['Docker', 'Linux', 'DevOps']
        },
        {
          title: '目标检测算法',
          technology: 'YOLO + Python',
          description: '基于YOLO算法的实时目标检测系统，可应用于安防监控和智能识别。',
          image: '/img/1.png',
          link: 'https://github.com',
          tags: ['YOLO', 'ML', '计算机视觉']
        },
        {
          title: '高性能计算库',
          technology: 'C++',
          description: '使用C++开发的高性能计算库，针对大规模数据处理进行了优化。',
          image: '/img/1.png',
          link: 'https://github.com',
          tags: ['C++', '高性能', '并行计算']
        }
      ]
    }
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

.project-card {
  transition: transform 0.3s ease;
  margin-bottom: 20px;
}

.project-card:hover {
  transform: translateY(-5px);
}

.project-image {
  opacity: 0.85;
}
</style> 