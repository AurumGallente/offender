<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <router-link class="navbar-brand" to="/">Я обиделась</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <div class="navbar-nav">
            <router-link class="nav-link" to="/">Главная</router-link>
            <router-link class="nav-link" to="/men">Мужчины</router-link>
            <router-link class="nav-link" to="/history">История обид</router-link>
            <router-link class="nav-link" to="/about">О приложении</router-link>
          </div>
        </div>
      </div>
    </nav>
    <router-view />
  </div>
</template>
<script setup lang="ts">
</script>