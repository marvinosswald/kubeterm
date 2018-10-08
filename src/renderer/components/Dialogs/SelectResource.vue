<template>
    <div class="message-box dialog-mask" @click="$close(false)">
        <div class="dialog-content">
            <header>Select Resource</header>
            <div class="dialog-body">
                <input type="text" class="minimal"
                       autofocus
                       ref="search"
                       @keydown.up="up"
                       @keydown.down="down"
                       v-model="search"
                       @keyup.enter="submit">
                <ul>
                    <li v-for="(resource, index) in filteredItems" :class="{active: index === selectedIndex}">
                        <span class="label">
                            {{resource.label}}
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'SelectResource',
    props: ['items'],
    data () {
      return {
        selectedIndex: undefined,
        search: ''
      }
    },
    computed: {
      filteredItems () {
        return this.items.filter((item) => {
          this.selectedIndex = undefined
          return item.label.indexOf(this.search) !== -1
        }).sort((a, b) => {
          if (a.label < b.label) {
            return -1
          } else if (a.label > b.label) {
            return 1
          }
          return 0
        })
      }
    },
    methods: {
      up () {
        this.setSelectedIndex(this.selectedIndex - 1)
      },
      down () {
        this.setSelectedIndex(this.selectedIndex + 1)
      },
      submit () {
        if (this.filteredItems.length === 1) {
          this.selectedIndex = 0
        }
        this.setCurrentNamespace(this.filteredItems[this.selectedIndex])
        this.$modal.hide('select-resource')
      },
      setSelectedIndex (value) {
        if (this.selectedIndex !== undefined && value >= 0 && value < Object.keys(this.items).length) {
          this.selectedIndex = value
        } else if (this.selectedIndex === undefined) {
          this.selectedIndex = 0
        }
      }
    }
  }
</script>

<style scoped lang="sass">
    .active
        .label
            background: #e6375a
</style>
