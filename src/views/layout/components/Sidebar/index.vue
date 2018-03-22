<template>
  <scroll-bar>
    <el-menu mode="vertical" unique-opened :default-active="$route.path" :collapse="isCollapse" background-color="#304156" text-color="#fff" active-text-color="#409EFF">
      <sidebar-item :routes="routes"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'

export default {
  components: { SidebarItem, ScrollBar },
  computed: {
    ...mapGetters([
      'sidebar',
      'permissions'
    ]),
    routes() {
      // const isDelete = []
      // const routes = this.$router.options.routes
      console.log('sidebar:' + this.$router.options.routes)

      // const newRoutes = this.$router.options.routes.filter(element => {
      //   this.permissions.includes(element.permission)
      // })

      // console.log(newRoutes)

      // this.$router.options.routes = newRoutes

      return this.$router.options.routes
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
