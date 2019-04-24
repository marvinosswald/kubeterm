<template>
    <div>
        <Container v-for="container in containers" :key="container.metadata.id" :container="container"></Container>
    </div>
</template>

<script>
  import Container from './Containers/Container'
  export default {
    name: 'Containers',
    components: {Container},
    props: ['containers']
  }
</script>

<style scoped>

</style>
