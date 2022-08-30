<template>
  <nav>
    <router-link to="/" class="home">Home</router-link>
  </nav>
  <router-view />
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $color;
  background: $brandColor;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: $color;
}

nav a.router-link-exact-active {
  color: $color;
}
.home {
  font-size: 24px;
}
</style>
