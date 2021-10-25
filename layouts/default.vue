<template>
  <div>
    <Header />
    <Nuxt />
    <AppFooter />
  </div>
</template>
 
<script>
import Header from '~/components/Header.vue'
import AppFooter from '~/components/AppFooter.vue'
 
export default {
  components: {
    Header,
    AppFooter
  }
}
</script>