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
      <el-table-column prop="name" label="角色名" />
      <el-table-column prop="org.name" label="所属机构" />
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
    <el-dialog title="角色详情" :visible.sync="editDialogFormVisible" top="5vh" @close="handleDialogClose">
      <div>
        <el-button type="primary" icon="el-icon-edit" plain @click="switchToEdit" style="float:right;margin-right:5%"></el-button>
      </div>
      <br/>
      <el-form :model="editRoleModel" :rules="validateRoleRules" ref="editRoleForm">
        <el-tabs value="role" type="card" tab-position="top">
          <el-tab-pane label="角色" name="role">
            <div style="margin:5%;">
              <el-form-item label="角色名" :label-width="formLabelWidth">
                <el-input v-model="editRoleModel.name" auto-complete="off" :disabled="editable"></el-input>
              </el-form-item>
            </div>
          </el-tab-pane>
          <el-tab-pane label="权限" name="permission">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" :disabled="editable">全选</el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="bindedPermissions" @change="handlecheckedPermissionsChange" :disabled="editable">
              <el-checkbox v-for="permission in permissions" :label="permission.id" :key="permission.id">{{permission.name}}</el-checkbox>
            </el-checkbox-group>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </div>
    </el-dialog>

    <!-- add dialog -->
    <el-dialog title="添加角色" :visible.sync="addDialogFormVisible" top="5vh" @close="handleDialogClose">
      <br/>
      <div>
        <el-form :model="addRoleModel" :rules="validateRoleRules" ref="addRoleForm">
          <el-tabs value="role" type="card" tab-position="top">
            <el-tab-pane label="角色" name="role">
              <div style="margin:5%;">
                <el-form-item label="角色名" :label-width="formLabelWidth" prop='name'>
                  <el-input v-model="addRoleModel.name" auto-complete="off"></el-input>
                </el-form-item>
              </div>
            </el-tab-pane>
            <el-tab-pane label="权限" name="permission">
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
              <div style="margin: 15px 0;"></div>
              <el-checkbox-group v-model="bindedPermissions" @change="handlecheckedPermissionsChange">
                <el-checkbox v-for="permission in permissions" :label="permission.id" :key="permission.id">{{permission.name}}</el-checkbox>
              </el-checkbox-group>
            </el-tab-pane>
          </el-tabs>
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
import { _getPermissions } from '@/api/permission'
import { _deleteRole, _editRole, _addRole, _deleteRoleList } from '@/api/role'
import { deepCopy, showMsg, showConfirmMsg, resetForm } from '@/utils/index'
import { mapGetters } from 'vuex'
import Store from '@/store'
export default {
  data() {
    const validateName = (rule, value, callback) => {
      if (new RegExp('^[\u4e00-\u9fa5]*$').test(value)) {
        callback()
      } else {
        callback(new Error('角色名只能包含中文'))
      }
    }

    return {
      storeState: Store.state,
      roles: [],
      permissions: [],
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
      bindedPermissions: [],
      checkAll: false,
      isIndeterminate: true,
      validateRoleRules: {
        name: [
          {
            required: true,
            trigger: 'blur',
            validator: validateName
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
    this.getPermissions()
  },
  watch: {
    // 观察currentOrg是否变化，若变化，则根据最新的currentOrg获取角色
    'storeState.user.currentOrg': function() {
      this.getRoleList()
    }
  },
  methods: {
    getPermissions() {
      _getPermissions()
        .then(response => {
          this.permissions = response.data.payloads
        })
        .catch(error => {
          console.log(error)
        })
    },
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
    addPermissionToRoleModel(permissions, model) {
      model.permissions = []
      permissions.forEach(element => {
        const permissionObj = {}
        permissionObj.id = element
        model.permissions.push(permissionObj)
      })
    },
    editRole() {
      this.$refs.editRoleForm.validate(valid => {
        if (valid) {
          this.addPermissionToRoleModel(this.bindedPermissions, this.editRoleModel)
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
          this.addPermissionToRoleModel(this.bindedPermissions, this.addRoleModel)
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
      this.bindedPermissions = this.getIdListFromPermissions(
        this.editRoleModel.permissions
      )
      this.editable = true
    },
    getIdListFromPermissions(array) {
      const targetArray = []
      array.forEach(element => {
        targetArray.push(element.id)
      })
      return targetArray
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
          _deleteRoleList(this.batchDeleteRoleList).then(() => {
            this.getRoleList()
          }).catch(error => {
            console.log(error)
          })
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
        doSearch({ name: value })
      } else {
        console.log('选择了错误的搜索类型')
      }
      function doSearch(condition) {
        const page = {
          current:
            _this.currentPage === 1 ? 0 : _this.currentPage * _this.pageSize,
          size: _this.pageSize
        }
        const params = Object.assign(page, condition)
        _getRoleListByOrgId(_this.currentOrg.id, params)
          .then(response => {
            _this.roles = response.data.payloads
            _this.totalRecord = response.data.totalNum
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
    handlecheckedPermissionsChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.permissions.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.permissions.length
      this.bindedPermissions = value
    },
    handleCheckAllChange(val) {
      this.bindedPermissions = val
        ? this.getIdListFromPermissions(this.permissions)
        : []
      this.isIndeterminate = false
    },
    handleDialogClose() {
      this.bindedPermissions = []
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



