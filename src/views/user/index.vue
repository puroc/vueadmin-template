<template>
  <div>
    <div style="height:60px">
      <div style="line-height:60px;margin-left:30px">
        <el-row>
          <el-col :span="24">
            <el-button type="primary" size="medium" @click="openAddUserDialog">添加</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
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
          <el-button @click="openEditUserDialog(scope.row)" type="text" size="small">查看</el-button>
          <el-button @click="deleteUser(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="position:fixed;bottom:0">
      <div class="block" style="padding-left:25%;padding-bottom:5%">
        <el-pagination @size-change="chanagePageSize" @current-change="changePageNum" :current-page="currentPage" :page-sizes="[1,10,20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalRecord">
        </el-pagination>
      </div>
    </div>
    <!-- details dialog -->
    <el-dialog title="用户详情" :visible.sync="editDialogFormVisible" top="5vh">
      <div>
        <el-button type="primary" icon="el-icon-edit" plain @click="switchToEdit" style="float:right;margin-right:5%"></el-button>
      </div>
      <br/>
      <!-- <div style="margin:5%; height:600px; overflow:auto"> -->
      <div style="margin:5%;">
        <el-form :model="editUserForm" :rules="validateUserRules" ref="editUserForm">
          <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-input v-model="editUserForm.username" auto-complete="off" disabled></el-input>
          </el-form-item>
          <el-form-item label="姓名" :label-width="formLabelWidth">
            <el-input v-model="editUserForm.name" auto-complete="off" :disabled="editable"></el-input>
          </el-form-item>
          <el-form-item label="机构" :label-width="formLabelWidth">
            <el-input v-model="editUserForm.orgId" auto-complete="off" :disabled="editable"></el-input>
          </el-form-item>
          <el-form-item label="性别" :label-width="formLabelWidth">
            <el-input v-model="editUserForm.sex" auto-complete="off" :disabled="editable"></el-input>
          </el-form-item>
          <el-form-item label="生日" :label-width="formLabelWidth">
            <el-input v-model="editUserForm.birthday" auto-complete="off" :disabled="editable"></el-input>
          </el-form-item>
          <el-form-item label="手机" :label-width="formLabelWidth">
            <el-input v-model="editUserForm.phone" auto-complete="off" :disabled="editable"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth">
            <el-input v-model="editUserForm.email" auto-complete="off" :disabled="editable"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- add dialog -->
    <el-dialog title="添加用户" :visible.sync="addDialogFormVisible" top="5vh">
      <br/>
      <div>
        <el-form :model="addUserForm" :rules="validateUserRules" ref="addUserForm">
          <el-form-item label="用户名" :label-width="formLabelWidth" prop='username'>
            <el-input v-model="addUserForm.username" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth" prop='password'>
            <el-input v-model="addUserForm.password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="姓名" :label-width="formLabelWidth" prop='name'>
            <el-input v-model="addUserForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="机构" :label-width="formLabelWidth" prop='orgId'>
            <el-input v-model="addUserForm.orgId" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别" :label-width="formLabelWidth" prop='sex'>
            <el-input v-model="addUserForm.sex" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="生日" :label-width="formLabelWidth" prop='birthday'>
            <el-input v-model="addUserForm.birthday" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机" :label-width="formLabelWidth" prop='phone'>
            <el-input v-model="addUserForm.phone" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth" prop='email'>
            <el-input v-model="addUserForm.email" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import { _getUserListByOrgId } from '@/api/org'
import { _deleteUser, _editUser, _addUser } from '@/api/user'
import { deepCopy, showMsg, showConfirmMsg } from '@/utils/index'
export default {
  data() {
    return {
      users: [],
      multipleSelection: [],
      currentPage: 0,
      pageSize: 1,
      totalRecord: 0,
      editDialogFormVisible: false,
      addDialogFormVisible: false,
      editUserForm: {},
      addUserForm: {},
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
      _getUserListByOrgId(orgId, {
        current: (this.currentPage - 1) * this.pageSize + 1,
        size: this.pageSize
      })
        .then(response => {
          this.users = response.data.payloads
          this.totalRecord = response.data.totalNum
        })
        .catch(error => {
          console.log(error)
        })
    },
    switchToEdit() {
      this.editable = !this.editable
    },
    editUser() {
      this.$refs.editUserForm.validate(valid => {
        if (valid) {
          _editUser(this.editUserForm)
            .then(response => {
              if (response.data.resultCode === '1') {
                this.getUserList(1)
                showMsg(this, 'success', '修改成功')
              } else {
                showMsg(this, 'error', '修改失败')
              }
            })
            .catch(error => {
              console.log(error)
            })
        } else {
          return false
        }
      })
      this.editDialogFormVisible = false
    },
    deleteUser(row) {
      showConfirmMsg(this, '此操作将永久删除该文件, 是否继续?')
        .then(() => {
          _deleteUser(row)
            .then(response => {
              if (response.data.resultCode === '1') {
                showMsg(this, 'success', '删除成功')
              } else {
                showMsg(this, 'error', '删除失败')
              }
              this.getUserList(1)
            })
            .catch(error => {
              console.log(error)
            })
        })
        .catch(() => {
          showMsg(this, 'info', '已取消删除')
        })
    },
    addUser() {
      this.$refs.addUserForm.validate(valid => {
        if (valid) {
          _addUser(this.addUserForm)
            .then(response => {
              if (response.data.resultCode === '1') {
                showMsg(this, 'success', '添加成功')
                this.getUserList(1)
              } else {
                showMsg(this, 'error', '添加失败')
              }
            })
            .catch(error => {
              console.log(error)
            })
        } else {
          return false
        }
      })
      this.addDialogFormVisible = false
    },
    openAddUserDialog() {
      this.addDialogFormVisible = true
      this.resetForm('addUserForm')
    },
    openEditUserDialog(row) {
      this.editDialogFormVisible = true
      this.editUserForm = deepCopy(row)
      this.editable = true
    },
    resetForm(formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields()
      }
    },
    handleSelectionChange() {
      alert('handleSelectionChange')
    },
    changePageNum(pageNum) {
      this.currentPage = pageNum
      this.getUserList(1)
    },
    chanagePageSize(pageSize) {
      this.pageSize = pageSize
      this.getUserList(1)
    }
  }
}
</script>


