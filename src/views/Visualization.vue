<template>
  <div class="fullscreen-background">
    <router-link to="/">返回登录页面</router-link>
    <h1>这是数据可视化端</h1>
    <h2>数据可视化</h2>
    <h2>数据可视化</h2>
    <h2>数据可视化</h2>
  </div>
</template>

<script>
export default {

}
</script>

<style>
.fullscreen-background {
  background-image: url('../../public/images/login_background.jpeg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: relative; /* Added relative positioning */
}
</style>