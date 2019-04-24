<template>
<div>
    <el-table
            :data="configMaps"
            style="width: 100%">
        <el-table-column
                prop="metadata.name"
                label="Name"
                width="300">
        </el-table-column>
        <el-table-column
                prop="metadata.namespace"
                label="Namespace"
                width="180">
        </el-table-column>
        <el-table-column
                prop="metadata.creationTimestamp"
                label="CreatedAt">
        </el-table-column>
        <el-table-column type="expand">
            <template slot-scope="props">
                <el-tag v-for="(item, key) in props.row.data" :key="key" type="success">{{key}}</el-tag>
            </template>
        </el-table-column>
    </el-table>
</div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  export default {
    name: 'ConfigMapList',
    computed: {
      ...mapState({
        currentNamespace: state => state.global.currentNamespace,
        configMaps: state => state.configmaps.items
      })
    },
    watch: {
      currentNamespace () {
        this.getAll()
      }
    },
    methods: {
      ...mapActions({
        getAll: 'configmaps/getAll'
      })
    },
    mounted () {
      this.getAll()
    }
  }
</script>

<style scoped>

</style>
