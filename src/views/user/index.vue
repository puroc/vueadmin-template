<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-button type="primary">添加</el-button>
        <el-button type="primary">操作</el-button>
      </el-col>
    </el-row>
    <el-table ref="multipleTable" border stripe highlight-current-row :data="users" tooltip-effect="dark" style="width: 100%" max-height="600" @selection-change="handleSelectionChange">
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
    <el-dialog title="用户详情" :visible.sync="dialogFormVisible" top="5vh">
      <div>
        <el-button type="primary" icon="el-icon-edit" plain @click="switchToEdit" style="float:right;margin-right:5%"></el-button>
      </div>
      <br/>
      <!-- <div style="margin:5%; height:600px; overflow:auto"> -->
      <div style="margin:5%;">
        <el-form :model="selectedUserForm" :rules="validateUserRules" ref="selectedUserForm">
          <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-input v-model="selectedUserForm.username" auto-complete="off" disabled></el-input>
          </el-form-item>
          <el-form-item label="姓名" :label-width="formLabelWidth">
            <el-input v-model="selectedUserForm.name" auto-complete="off" :disabled="editable"></el-input>
          </el-form-item>
          <el-form-item label="机构" :label-width="formLabelWidth">
            <el-input v-model="selectedUserForm.orgId" auto-complete="off" :disabled="editable"></el-input>
          </el-form-item>
          <el-form-item label="性别" :label-width="formLabelWidth">
            <el-input v-model="selectedUserForm.sex" auto-complete="off" :disabled="editable"></el-input>
          </el-form-item>
          <el-form-item label="生日" :label-width="formLabelWidth">
            <el-input v-model="selectedUserForm.birthday" auto-complete="off" :disabled="editable"></el-input>
          </el-form-item>
          <el-form-item label="手机" :label-width="formLabelWidth">
            <el-input v-model="selectedUserForm.phone" auto-complete="off" :disabled="editable"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth">
            <el-input v-model="selectedUserForm.email" auto-complete="off" :disabled="editable"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getUserListByOrgId } from '@/api/org'
import { deleteUserByUsername, editUserByUsername } from '@/api/user'
export default {
  data() {
    return {
      users: [],
      multipleSelection: [],
      currentPage: 1,
      dialogFormVisible: false,
      selectedUserForm: {},
      formLabelWidth: '70px',
      editable: true,
      validateUserRules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      }
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
    switchToEdit() {
      this.editable = !this.editable
    },
    editUser() {
      this.$refs.selectedUserForm.validate(valid => {
        if (valid) {
          editUserByUsername(this.selectedUserForm)
            .then(response => {
              if (response.data.resultCode === '1') {
                this.$message({
                  showClose: true,
                  message: '修改成功',
                  type: 'success',
                  center: true
                })
              } else {
                this.$refs.selectedUserForm.resetFields()
                this.$message({
                  showClose: true,
                  message: '修改失败',
                  type: 'error',
                  center: true
                })
              }
            })
            .catch(error => {
              console.log(error)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
      this.dialogFormVisible = false
    },
    deleteUser(row) {
      deleteUserByUsername(row.username)
        .then(response => {
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
      this.selectedUserForm = row
      this.editable = true
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


