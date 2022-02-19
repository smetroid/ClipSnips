<template>
  <v-app>
    <v-main>
      <ClipList />
    </v-main>
  </v-app>
</template>

<script>
// import HelloWorld from './components/HelloWorld';
import ClipList from './components/ClipList'

export default {
  name: 'App',

  components: {
    ClipList
  },

  data: () => ({
    //
  }),
};
</script>
