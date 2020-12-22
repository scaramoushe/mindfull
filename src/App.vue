<template>
  <div id="app">
    <GoodMood/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import GoodMood from './components/GoodMood.vue';

@Component({
  components: {
    GoodMood,
  },
})
export default class App extends Vue {}
</script>
