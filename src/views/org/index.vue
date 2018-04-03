<template>
  <div>
    <div style="height:60px">
      <div style="line-height:60px;margin-left:30px">
        <el-row>
          <el-col :span="24">
            <el-button type="primary" size="medium" @click="openAddOrgDialog">添加</el-button>
            <el-button type="primary" size="medium" @click="deleteOrg">删除</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-row>
      <el-col :span="6" style="border:1px solid gray;height:600px;">
        <el-tree node-key="id" :default-expanded-keys="roleBindOrg" :data="orgTree" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </el-col>
      <el-col :span="18" style="border:1px solid gray;height:600px;">
        ahha
      </el-col>
    </el-row>
    <el-dialog title="添加机构" :visible.sync="addOrgDialogFormVisible">
      <el-form :model="addOrgModel" ref="addOrgForm">
        <el-form-item label="上级机构" prop='upperOrg.label'>
          <el-input v-model="addOrgModel.upperOrg.label" :disabled="false"></el-input>
        </el-form-item>
        <el-form-item label="机构名称" prop='label'>
          <el-input v-model="addOrgModel.label"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addOrgDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrg">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { _getOrgTree, _addOrg, _deleteOrg } from '@/api/org'
import { resetForm } from '@/utils/index'
import { Message } from 'element-ui'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      // 机构树数据
      orgTree: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 选中的机构
      selectedOrg: {},
      // 添加机构表单对应的model
      addOrgModel: {
        upperOrg: {}
      },
      // 控制添加机构dialog是否可见
      addOrgDialogFormVisible: false,
      // 角色绑定机构
      roleBindOrg: []
    }
  },
  computed: {
    // 获取当前角色
    ...mapGetters(['currentRole'])
  },
  created() {
    // 将用户角色绑定的机构设置为默认展开的机构
    this.roleBindOrg.push(this.currentRole.orgId)
    // 获取角色绑定的机构树
    this.getOrgTree(this.currentRole.orgId)
  },
  methods: {
    // 获取机构树
    getOrgTree(orgId) {
      _getOrgTree(orgId)
        .then(response => {
          this.orgTree = response.data.payloads
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 处理机构数节点点击事件
    handleNodeClick(data) {
      this.selectedOrg = data
    },
    // 添加机构
    addOrg() {
      this.addOrgDialogFormVisible = false
      const org = []
      org.push({
        label: this.addOrgModel.label
      })
      _addOrg(this.addOrgModel.upperOrg.id, org)
        .then(() => {
          // 添加成功，将选中的机构清空，同时获取最新的机构树
          this.selectedOrg = {}
          this.getOrgTree(1)
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 删除机构
    deleteOrg() {
      // 如果没有选择机构，则不允许删除
      if (!this.selectedOrg.label) {
        return
      }
      _deleteOrg(this.selectedOrg.id)
        .then(response => {
          if (response.data.resultCode === '10001') {
            Message({
              message: response.data.message,
              type: 'error',
              duration: 5 * 1000
            })
          } else {
            this.getOrgTree(1)
          }
          this.selectedOrg = {}
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 打开添加机构对话框
    openAddOrgDialog() {
      // 没有选择上级机构时，不允许添加机构
      if (!this.selectedOrg.label) {
        return
      }
      // 充值表单内容
      resetForm(this, 'addOrgForm')
      this.addOrgDialogFormVisible = true
      // 将选中的机构设置为上级机构，即在该机构下面添加机构
      this.addOrgModel.upperOrg = this.selectedOrg
    }
  }
}
</script>
