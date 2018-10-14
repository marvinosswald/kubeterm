<template>
    <input type="text" class="minimal"
           autofocus
           v-model="input"
           ref="input">
</template>

<script>
  const REGEX = /(?:(?:\/)([A-z|0-9]+)(?::\s)(\S+)(?:\s))/g
  export default {
    name: 'Search',
    data () {
      return {
        input: '',
        filter: [],
        output: ''
      }
    },
    watch: {
      input () {
        this.processInput()
        this.output = this.input
        this.filter.every((filter) => {
          this.output = this.output.replace(filter.input, '')
          return true
        })
        this.$emit('input', this.output)
      },
      filter () {
        this.$emit('filter', this.filter)
      }
    },
    methods: {
      focus () {
        this.$refs.input.focus()
      },
      processInput () {
        const reg = this.input.match(REGEX)
        if (reg !== null) {
          this.filter = reg.map(s => {
            const match = new RegExp(REGEX).exec(s)
            return {key: match[1], value: match[2], input: match[0]}
          })
        }
      }
    }
  }
</script>

<style scoped>

</style>
