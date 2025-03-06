// 博客工具类

/**
 * 获取博客列表
 * @returns {Array} 博客列表
 */
export async function getBlogList() {
  try {
    // 通过fetch获取博客目录列表
    const response = await fetch('/api/blogs');
    if (!response.ok) {
      throw new Error('Failed to fetch blog list');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching blog list:', error);
    // 如果API不可用，返回固定的博客列表
    return [
      {
        id: 'csapp-2',
        title: 'CSAPP_2',
        description: 'CSAPP第二章笔记.',
        publishDate: '2024-11-30 00:08:00',
        folder: 'CSAPP_2',
        tags: ['CSAPP'],
        heroImage: {
          src: '/img/1.png', // 临时使用现有图片，稍后应替换为实际图片
          alt: 'an image targetting my article',
          color: '#B4C6DA'
        }
      },
      {
        id: 'computer-network',
        title: '计算机网络基础',
        description: '计算机网络基础.',
        publishDate: '2025-2-15 00:08:00',
        folder: '计算机网络基础笔记',
        tags: ['Markdown'],
        heroImage: {
          src: '/blog/计算机网络基础笔记/forest-9380292.jpg',
          alt: 'an image targetting my article',
          color: '#B4C6DA'
        }
      }
     
     
    ];
  }
}

/**
 * 获取博客内容
 * @param {string} id - 博客ID
 * @returns {Object} 博客内容
 */
export async function getBlogContent(id) {
  try {
    const response = await fetch(`/api/blogs/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch blog content for id: ${id}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching blog content for id: ${id}`, error);
    return null;
  }
}

/**
 * 格式化日期
 * @param {string} dateString - 日期字符串
 * @returns {string} 格式化后的日期
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * 获取博客的点赞数
 * @param {string} blogId - 博客ID
 * @returns {number} 点赞数
 */
export function getBlogLikes(blogId) {
  try {
    const likesData = JSON.parse(localStorage.getItem('blogLikes') || '{}');
    return likesData[blogId] || 0;
  } catch (error) {
    console.error('Error getting likes data:', error);
    return 0;
  }
}

/**
 * 判断用户是否已经点赞了某篇博客
 * @param {string} blogId - 博客ID
 * @returns {boolean} 是否已点赞
 */
export function hasUserLiked(blogId) {
  try {
    const userLikes = JSON.parse(localStorage.getItem('userLikes') || '[]');
    return userLikes.includes(blogId);
  } catch (error) {
    console.error('Error checking if user liked blog:', error);
    return false;
  }
}

/**
 * 给博客点赞或取消点赞
 * @param {string} blogId - 博客ID
 * @returns {number} 点赞后的点赞数
 */
export function toggleLikeBlog(blogId) {
  try {
    // 获取博客点赞数据
    const likesData = JSON.parse(localStorage.getItem('blogLikes') || '{}');
    // 获取用户点赞记录
    const userLikes = JSON.parse(localStorage.getItem('userLikes') || '[]');

    const hasLiked = userLikes.includes(blogId);
    
    if (hasLiked) {
      // 如果已经点赞，取消点赞
      const index = userLikes.indexOf(blogId);
      userLikes.splice(index, 1);
      likesData[blogId] = (likesData[blogId] || 1) - 1;
    } else {
      // 如果未点赞，添加点赞
      userLikes.push(blogId);
      likesData[blogId] = (likesData[blogId] || 0) + 1;
    }

    // 保存回localStorage
    localStorage.setItem('blogLikes', JSON.stringify(likesData));
    localStorage.setItem('userLikes', JSON.stringify(userLikes));

    return likesData[blogId];
  } catch (error) {
    console.error('Error toggling blog like:', error);
    return 0;
  }
}

/**
 * 获取完整的博客Markdown内容
 * @param {string} folder - 博客文件夹名称
 * @returns {Promise<string>} - Markdown内容
 */
export async function getFullBlogContent(folder) {
  try {
    const response = await fetch(`/blog/${folder}/index.md`);
    if (!response.ok) {
      throw new Error(`Failed to fetch markdown content from folder: ${folder}`);
    }
    return await response.text();
  } catch (error) {
    console.error(`Error fetching blog markdown: ${error}`);
    return '';
  }
} 