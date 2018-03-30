<template>
    <el-menu mode="vertical" unique-opened :default-active="$route.path" :collapse="isCollapse" background-color="#304156" text-color="#fff" active-text-color="#409EFF">
      <sidebar-item :routes="routes"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'
import { constantRouterMap } from '@/router'
export default {
  components: { SidebarItem, ScrollBar },
  computed: {
    ...mapGetters(['sidebar', 'permissions', 'token', 'roles']),
    routes() {
      const newRoutes = constantRouterMap.filter(element => {
        // 如果是不需要权限控制的路由，则保留在路由表中
        if (!element.permission) {
          return true
        }
        // 否则，判断该条路由是否在当前权限点集合中，若存在则保留在路由表中，否则去除
        return this.permissions.includes(element.permission)
      })
      this.$router.options.routes = newRoutes

      return this.$router.options.routes
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
