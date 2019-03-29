<template>
    <el-menu default-active="1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="true">
        <el-menu-item index="1">
            <i class="el-icon-menu"></i>
            <span slot="title">Pods</span>
        </el-menu-item>
        <el-menu-item index="2" disabled>
            <i class="el-icon-menu"></i>
            <span slot="title">Nodes</span>
        </el-menu-item>
        <el-menu-item index="3" disabled>
            <i class="el-icon-menu"></i>
            <span slot="title">Deployments</span>
        </el-menu-item>
        <el-menu-item index="4" disabled>
            <i class="el-icon-menu"></i>
            <span slot="title">Config Map</span>
        </el-menu-item>
        <el-menu-item index="5" disabled>
            <i class="el-icon-menu"></i>
            <span slot="title">Secret</span>
        </el-menu-item>
        <el-menu-item index="6" disabled>
            <i class="el-icon-setting"></i>
            <span slot="title">Settings</span>
        </el-menu-item>
    </el-menu>
</template>

<script>
  export default {
    name: 'Menu'
  }
</script>

<style scoped>

</style>
