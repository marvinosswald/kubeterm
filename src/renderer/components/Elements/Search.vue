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
        filter: null,
        output: ''
      }
    },
    watch: {
      input () {
        const query = filterable.Query(this.input).parse()
        this.filter = query.toMongo()
        this.$emit('filter', this.filter)
        if (this.filter !== null && this.filter.tags) {
          this.$emit('input', this.filter.tags.$in.join(' '))
        } else if (this.filter !== null) {
          this.$emit('input', '')
        } else {
          this.$emit('input', this.input)
        }
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
