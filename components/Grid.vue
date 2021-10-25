<script>
export default {
    props: {
        blok: {
            type: Object,
            required: true 
        }
    }
}
</script>

<template>
  <ul v-editable="blok" class="container mx-auto flex justify-content-center py-8 mb-6">
    <li :key="blok._uid" v-for="blok in blok.columns" class="ml-4 mr-4 px-6">
        <component :blok="blok" :is="blok.component" />
    </li>
  </ul>
</template>