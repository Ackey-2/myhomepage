<template>
  <div>
    <v-row>
      <v-col cols="12" md="8" lg="9">
        <homeright :configdata="configdata" :formattedTime="formattedTime" 
        :formattedDate="formattedDate" :projectcards="projectcards"></homeright>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import homeright from '../components/hoemright.vue';

export default {
  name: 'HomePage',
  components: {
    homeright
  },
  props: ['configdata', 'formattedTime', 'formattedDate', 'projectcards']
}
</script>

<style scoped>
/* 主页样式 */
</style> 