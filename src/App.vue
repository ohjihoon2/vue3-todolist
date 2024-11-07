<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <router-link class="navbar-brand" :to="{name: 'Home'}">Jihoon's</router-link>
    <ul class="navbar-nav mr-auto">
      <li class="nav-item active">
        <router-link class="nav-link" to="/todos">Todos</router-link>
      </li>
    </ul>
  </nav>
  <div class="container">
    <router-view/>
  </div>
</template>

<script>
export default {

}
</script>

<style>
</style>
