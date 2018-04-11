<template>
  <div>
    <div style="height:60px">
      <div style="line-height:60px;margin-left:30px;">
        <el-row>
          <el-col :span="16">
            <el-button type="primary" size="medium" @click="openAddRoleDialog">添加</el-button>
            <el-button type="primary" size="medium" @click="batchDeleteRoles">删除</el-button>
          </el-col>
          <el-col :span="8">
            <div style="line-height:60px">
              <el-input placeholder="请输入内容" v-model="searchInputModel" class="input-with-select">
                <el-select v-model="searchSelectModel" slot="prepend" placeholder="请选择">
                  <el-option label="角色名" value="name"></el-option>
                </el-select>
                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
              </el-input>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-table ref="multipleTable" border stripe highlight-current-row :data="roles" tooltip-effect="dark" style="width: 100%" max-height="600" @selection-change="handleSelectionChange">
      <el-table-column type="selection" disabled/>
      <el-table-column prop="name" label="角色名"/>
      <el-table-column prop="org.name" label="所属机构"/>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="openEditRoleDialog(scope.row)" type="text" size="small">查看</el-button>
          <el-button @click="deleteRole(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="position:fixed;bottom:0">
      <div class="block" style="padding-left:25%;padding-bottom:5%">
        <el-pagination @size-change="chanagePageSize" @current-change="changePageNum" :current-page="currentPage" :page-sizes="pageSizeList" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalRecord">
        </el-pagination>
      </div>
    </div>
    <!-- details dialog -->
    <el-dialog title="角色详情" :visible.sync="editDialogFormVisible" top="5vh">
      <div>
        <el-button type="primary" icon="el-icon-edit" plain @click="switchToEdit" style="float:right;margin-right:5%"></el-button>
      </div>
      <br/>
      <!-- <div style="margin:5%; height:600px; overflow:auto"> -->
      <div style="margin:5%;">
        <el-form :model="editRoleModel" :rules="validateRoleRules" ref="editRoleForm">
          <el-form-item label="角色名" :label-width="formLabelWidth">
            <el-input v-model="editRoleModel.name" auto-complete="off" :disabled="editable"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </div>
    </el-dialog>

    <!-- add dialog -->
    <el-dialog title="添加角色" :visible.sync="addDialogFormVisible" top="5vh">
      <br/>
      <div>
        <el-form :model="addRoleModel" :rules="validateRoleRules" ref="addRoleForm">
          <el-form-item label="角色名" :label-width="formLabelWidth" prop='name'>
            <el-input v-model="addRoleModel.name" auto-complete="off"></el-input>
          </el-form-item>
          <!-- <el-form-item label="机构" :label-width="formLabelWidth" prop='orgId'>
            <el-input v-model="addRoleModel.orgId" auto-complete="off"></el-input>
          </el-form-item> -->
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import { _getRoleListByOrgId } from '@/api/org'
import { _deleteRole, _editRole, _addRole, _deleteRoleList } from '@/api/role'
import { deepCopy, showMsg, showConfirmMsg, resetForm } from '@/utils/index'
import { mapGetters } from 'vuex'
import Store from '@/store'
export default {
  data() {
    const validateUsername = (rule, value, callback) => {
      if (new RegExp('^\\w+$').test(value)) {
        callback()
      } else {
        callback(new Error('角色名只能包含字母数字和下划线'))
      }
    }

    const validatePassword = (rule, value, callback) => {
      if (new RegExp('^\\w+$').test(value)) {
        callback()
      } else {
        callback(new Error('密码只能包含字母数字和下划线'))
      }
    }

    const validateName = (rule, value, callback) => {
      if (new RegExp('^[\u4e00-\u9fa5]*$').test(value)) {
        callback()
      } else {
        callback(new Error('姓名只能包含中文'))
      }
    }

    const validatePhone = (rule, value, callback) => {
      if (
        new RegExp(
          '^((13[0-9])|(14[0-9])|(15[0-9])|(17[0-9])|(18[0-9]))\\d{8}$'
        ).test(value)
      ) {
        callback()
      } else {
        callback(new Error('请输入正确的手机号'))
      }
    }

    const validateEmail = (rule, value, callback) => {
      if (
        new RegExp(
          '^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+$'
        ).test(value)
      ) {
        callback()
      } else {
        callback(new Error('请输入正确的邮箱'))
      }
    }

    return {
      storeState: Store.state,
      roles: [],
      multipleSelection: [],
      currentPage: 1,
      pageSizeList: [10, 30, 50],
      pageSize: 10,
      totalRecord: 0,
      editDialogFormVisible: false,
      addDialogFormVisible: false,
      editRoleModel: {},
      addRoleModel: {},
      searchInputModel: '',
      searchSelectModel: 'name',
      formLabelWidth: '70px',
      editable: true,
      batchDeleteRoleList: [],
      validateRoleRules: {
        username: [
          {
            required: true,
            trigger: 'blur',
            validator: validateUsername
          }
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            validator: validatePassword
          },
          { min: 3, max: 6, message: '密码长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        name: [
          {
            required: true,
            trigger: 'blur',
            validator: validateName
          }
        ],
        orgId: [
          {
            required: true,
            trigger: 'blur'
          }
        ],
        phone: [
          {
            required: true,
            trigger: 'blur',
            validator: validatePhone
          }
        ],
        email: [
          {
            required: true,
            trigger: 'blur',
            validator: validateEmail
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['currentOrg'])
  },
  created() {
    this.getRoleList()
  },
  watch: {
    // 观察currentOrg是否变化，若变化，则根据最新的currentOrg获取角色
    'storeState.user.currentOrg': function() {
      this.getRoleList()
    }
  },
  methods: {
    getRoleList() {
      const params = {
        current: this.currentPage === 1 ? 0 : this.currentPage * this.pageSize,
        size: this.pageSize
      }
      _getRoleListByOrgId(this.currentOrg.id, params)
        .then(response => {
          this.roles = response.data.payloads
          this.totalRecord = response.data.totalNum
        })
        .catch(error => {
          console.log(error)
        })
    },
    switchToEdit() {
      this.editable = !this.editable
    },
    editRole() {
      this.$refs.editRoleForm.validate(valid => {
        if (valid) {
          _editRole(this.editRoleModel)
            .then(response => {
              if (response.data.resultCode === '1') {
                this.getRoleList()
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
    deleteRole(row) {
      showConfirmMsg(this, '此操作将永久删除该角色, 是否继续?')
        .then(() => {
          _deleteRole(row)
            .then(response => {
              if (response.data.resultCode === '1') {
                showMsg(this, 'success', '删除成功')
              } else {
                showMsg(this, 'error', '删除失败')
              }
              this.getRoleList()
            })
            .catch(error => {
              console.log(error)
            })
        })
        .catch(() => {
          showMsg(this, 'info', '已取消删除')
        })
    },
    addRole() {
      this.$refs.addRoleForm.validate(valid => {
        if (valid) {
          this.addRoleModel.orgId = this.currentOrg.id
          _addRole(this.addRoleModel)
            .then(response => {
              if (response.data.resultCode === '1') {
                showMsg(this, 'success', '添加成功')
                this.getRoleList()
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
    openAddRoleDialog() {
      this.addDialogFormVisible = true
      resetForm(this, 'addRoleForm')
    },
    openEditRoleDialog(row) {
      this.editDialogFormVisible = true
      this.editRoleModel = deepCopy(row)
      this.editable = true
    },
    handleSelectionChange(roleList) {
      this.batchDeleteRoleList = roleList
    },
    changePageNum(pageNum) {
      this.currentPage = pageNum
      this.getRoleList()
    },
    chanagePageSize(pageSize) {
      this.pageSize = pageSize
      this.getRoleList()
    },
    batchDeleteRoles() {
      showConfirmMsg(this, '此操作将永久删除该角色, 是否继续?')
        .then(() => {
          _deleteRoleList(this.batchDeleteRoleList)
          this.getRoleList()
        })
        .catch(error => {
          console.log(error)
        })
    },
    search() {
      const key = this.searchSelectModel
      const value = this.searchInputModel
      const _this = this
      if (key === 'name') {
        doSearch(1, { name: value })
      } else if (key === 'username') {
        doSearch(1, { username: value })
      } else if (key === 'email') {
        doSearch(1, { email: value })
      } else if (key === 'phone') {
        doSearch(1, { phone: value })
      } else {
        console.log('选择了错误的搜索类型')
      }
      function doSearch(orgId, condition) {
        const page = {
          current:
            _this.currentPage === 1 ? 0 : _this.currentPage * _this.pageSize,
          size: _this.pageSize
        }
        const params = Object.assign(page, condition)
        _getRoleListByOrgId(orgId, params)
          .then(response => {
            _this.roles = response.data.payloads
            _this.totalRecord = response.data.totalNum
          })
          .catch(error => {
            console.log(error)
          })
      }
    }
  }
}
</script>
<style>
.el-select .el-input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>



