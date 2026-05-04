<template>
  <div class="container">
    <slot/>
  </div>
</template>

<style lang="scss" scoped>
  .container {
    width: 100vw;
    min-height: 100vh;

    display: flex;
    justify-content: center;
    align-items: center;
    padding: 80px 20px 40px;
  }
</style>
