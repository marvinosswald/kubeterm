<template>
    <div class="message-box dialog-mask" @click="$close(false)">
        <div class="dialog-content">
            <header>{{title}}</header>
            <div class="dialog-body">
                <p>{{ content }}</p>
            </div>
            <footer>
                Press y or n
            </footer>
            <GlobalEvents
                    @keyup.prevent.n="$close(false)"
                    @keyup.prevent.y="$close(true)"
            />
        </div>
    </div>
</template>

<script>
  export default {
    name: 'Confirm',
    props: ['title', 'content', 'arguments']
  }
</script>

<style scoped>

</style>
