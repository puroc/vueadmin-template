<template>
  <div>
    <el-table ref="multipleTable" stripe highlight-current-row :data="users" tooltip-effect="dark" style="width: 100%" max-height="600" @selection-change="handleSelectionChange">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="name" label="姓名">
      </el-table-column>
      <el-table-column prop="username" label="用户名">
      </el-table-column>
      <el-table-column prop="sex" label="性别">
      </el-table-column>
      <el-table-column prop="phone" label="手机">
      </el-table-column>
      <el-table-column prop="email" label="邮箱">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="showUserDetails(scope.row)" type="text" size="small">查看</el-button>
          <el-button @click="deleteUser(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="position:fixed;bottom:0">
      <div class="block" style="padding-left:25%;padding-bottom:5%">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10,20, 50]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="400">
        </el-pagination>
      </div>
    </div>
    <!-- details dialog -->
    <el-dialog title="用户详情" :visible.sync="dialogFormVisible">
      <div style="margin:5%">
        <el-form :model="selectedUser">
          <el-form-item label="姓名" :label-width="formLabelWidth">
            <el-input v-model="selectedUser.name" auto-complete="off" width="150">{{name}}</el-input>
          </el-form-item>
          <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-input v-model="selectedUser.username" auto-complete="off">{{username}}</el-input>
          </el-form-item>
          <el-form-item label="性别" :label-width="formLabelWidth">
            <el-input v-model="selectedUser.sex" auto-complete="off">{{sex}}</el-input>
          </el-form-item>
          <el-form-item label="生日" :label-width="formLabelWidth">
            <el-input v-model="selectedUser.birthday" auto-complete="off">{{birthday}}</el-input>
          </el-form-item>
          <el-form-item label="手机" :label-width="formLabelWidth">
            <el-input v-model="selectedUser.phone" auto-complete="off">{{phone}}</el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth">
            <el-input v-model="selectedUser.email" auto-complete="off">{{email}}</el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
import { getUserListByOrgId } from '@/api/org'
import { deleteUserByUsername } from '@/api/user'
export default {
  data() {
    return {
      users: [],
      multipleSelection: [],
      currentPage: 1,
      dialogFormVisible: false,
      selectedUser: {},
      formLabelWidth: '70px'
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
    deleteUser(row) {
      deleteUserByUsername(row.username)
        .then(response => {
          console.log(response)
          if (response.data.resultCode === '1') {
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success',
              center: true
            })
          } else {
            this.$message({
              showClose: true,
              message: '删除失败',
              type: 'error',
              center: true
            })
          }
          this.getUserList(1)
        })
        .catch(error => {
          console.log(error)
        })
    },
    showUserDetails(row) {
      this.dialogFormVisible = true
      this.selectedUser = row
    },
    handleSelectionChange() {
      alert('handleSelectionChange')
    },
    handleCurrentChange() {
      alert('handleCurrentChange')
    },
    handleSizeChange() {
      alert('handleSizeChange')
    }
  }
}
</script>


