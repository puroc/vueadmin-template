<template>
  <section class="app-main">
    <el-row>
      <el-col :span="4">
        <Org></Org>
      </el-col>
      <el-col :span="20">
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import Org from '@/components/Org'
export default {
  name: 'AppMain',
  components: {
    Org
  }
}
</script>
