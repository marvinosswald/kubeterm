<template>
    <div class="row">
        <input type="text" class="minimal"
               autofocus
               v-model="input"
               ref="input">
        <div :class="{completion: true, show: showCompletition}" :style="completitionStyle">
            <ul>
                <li v-for="key in filterKeyOptions">{{key}}</li>
            </ul>
        </div>
    </div>
</template>

<script>
  const CaretCoordinates = require('textarea-caret-position')

  const REGEX = /(?:(?:\/)([A-z|0-9]+)(?::\s)(\S+)(?:\s))/g
  export default {
    name: 'Search',
    props: ['filterOptions'],
    data () {
      return {
        input: '',
        filter: [],
        output: '',
        completitionStyle: {},
        showCompletition: false
      }
    },
    computed: {
      filterKeyOptions () {
        if (this.filterOptions !== null) {
          return Object.keys(this.filterOptions).filter((k) => {
            return k.indexOf(this.output.substring(1)) !== -1
          })
        }
        return []
      }
    },
    watch: {
      input () {
        this.moveCompletiton()
        this.processInput()
        this.output = this.input
        this.filter.every((filter) => {
          this.output = this.output.replace(filter.input, '')
          return true
        })
        if (!this.showCompletition) {
          this.$emit('input', this.output.replace('/', ''))
        }
      },
      filter () {
        this.$emit('filter', this.filter)
      }
    },
    methods: {
      moveCompletiton () {
        const a = new CaretCoordinates(this.$refs.input).get(50)
        this.completitionStyle = {
          left: a.left + 'px'
        }
      },
      focus () {
        this.$refs.input.focus()
      },
      processInput () {
        this.showCompletition = this.output.charAt(0) === '/'
        const reg = this.input.match(REGEX)
        this.filter = []
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
