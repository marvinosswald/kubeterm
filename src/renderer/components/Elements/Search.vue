<template>
    <div class="row">
        <input type="text" class="minimal"
               autofocus
               v-model="input"
               ref="input">
    </div>
</template>

<script>
  const filterable = require('filterable')

  export default {
    name: 'Search',
    props: ['filterOptions'],
    data () {
      return {
        input: '',
        filter: {},
        output: ''
      }
    },
    watch: {
      input () {
        const query = filterable.Query(this.input).parse()
        this.$emit('filter', query.toMongo())
        this.$emit('input', this.input)
        this.output = this.input
      }
    },
    methods: {
      focus () {
        this.$refs.input.focus()
      }
    }
  }
</script>

<style scoped lang="sass">
    .completion
        border: 1px #fff solid
        width: 40vw
        position: absolute
        background: #23272A
        padding: 5px
        top: 30px
        display: none
        ul
            list-style-type: none
        &.show
            display: block
    input
        &:focus
            outline: none
</style>
