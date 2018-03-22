<template>
  <div>
    <el-table ref="multipleTable" :data="users" tooltip-effect="dark" style="width: 100%" max-height="600" @selection-change="handleSelectionChange">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="name" label="姓名">
      </el-table-column>
      <el-table-column prop="username" label="用户名" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="sex" label="性别" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="phone" label="手机号" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="email" label="邮箱" show-overflow-tooltip>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
          <el-button type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="position:fixed;bottom:0">
      <div class="block" style="padding-left:25%;padding-bottom:5%">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10,20, 50]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="400">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { getUserListByOrgId } from '@/api/org'
export default {
  data() {
    return {
      users: [],
      multipleSelection: [],
      currentPage: 1
    }
  },
  created() {
    this.getUserList(1)
  },
  methods: {
    getUserList(orgId) {
      getUserListByOrgId(orgId)
        .then(response => {
          this.users = response.data.payloads
        })
        .catch(error => {
          console.log(error)
        })
    },
    handleSelectionChange() {},
    handleCurrentChange() {},
    handleSizeChange() {}
  }
}
</script>


