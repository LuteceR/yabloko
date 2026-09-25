<script setup lang="ts">

</script>

<template>
  <header>
    <img alt="Vue logo" src="./assets/cat.png" width="300" height="125" />

    <div>
      <h1>You did it bro!</h1>
      <router-link to="/yabloko/page">page</router-link>
    </div>
  </header>

  <main class='birder-2'>
    <router-view></router-view>
  </main>
</template>
