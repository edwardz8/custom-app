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
  <div
    v-editable="blok"
    class="prose my-24 mx-auto">
    <h1>{{ blok.name }}</h1>
    <p>{{ blok.intro }}</p>
    <p>{{ blok.seo.title }}</p>
    <p>{{ blok.seo.description }}</p>
    <rich-text-renderer
      :document="blok.body"
    />
  </div>
</template>