<template>
  <div>
    <el-tree node-key="id" default-expand-all :expand-on-click-node="false" :data="orgTree" :props="defaultProps" @node-click="handleNodeClick" @node-contextmenu="rightClick">
    </el-tree>

    <el-dialog title="机构详情" :visible.sync="orgDialogFormVisible">
      <div style="float:right;margin-right:5%">
        <el-button type="primary" icon="el-icon-edit" plain @click="switchToEdit"></el-button>
        <el-button type="primary" icon="el-icon-delete" plain @click="deleteOrg"></el-button>
      </div>
      <div style="margin:5%;">
        <el-form :model="orgModel" ref="addOrgForm">
          <el-form-item label="机构名称" prop='upperOrg.label'>
            <el-input v-model="orgModel.upperOrg.label" :disabled="editable"></el-input>
          </el-form-item>
          <el-button type="text" @click="showSonOrgInput" v-show="!editable">添加下级机构</el-button>
          <el-form-item label="下级机构名称" prop='label' v-show="isShowSonOrg">
            <el-input v-model="orgModel.label"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeOrgDialog">取 消</el-button>
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
import { showMsg, showConfirmMsg } from '@/utils/index'
export default {
  data() {
    return {
      // 机构树数据
      orgTree: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 添加机构表单对应的model
      orgModel: {
        upperOrg: {}
      },
      // 控制添加机构dialog是否可见
      orgDialogFormVisible: false,
      editable: true,
      isShowSonOrg: false
    }
  },
  computed: {
    // 获取当前角色
    ...mapGetters(['currentRole'])
  },
  created() {
    // 获取角色绑定的机构树
    this.getOrgTree()
  },
  methods: {
    // 获取机构树
    getOrgTree() {
      _getOrgTree(this.currentRole.org.id)
        .then(response => {
          this.orgTree = response.data.payloads
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 处理机构数节点点击事件
    handleNodeClick(data) {
      this.$store.dispatch('SwitchOrg', data.id)
    },
    // 添加机构
    addOrg() {
      this.closeOrgDialog()
      if (!this.orgModel.label) {
        return
      }
      const org = []
      org.push({
        label: this.orgModel.label
      })
      _addOrg(this.orgModel.upperOrg.id, org)
        .then(() => {
          this.getOrgTree()
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 删除机构
    deleteOrg() {
      showConfirmMsg(this, '此操作将永久删除该机构, 是否继续?')
        .then(() => {
          _deleteOrg(this.orgModel.upperOrg.id)
            .then(response => {
              // 关闭对话框
              this.closeOrgDialog()
              // 存在下级机构，不允许删除
              if (response.data.resultCode === '10001') {
                Message({
                  message: response.data.message,
                  type: 'error',
                  duration: 5 * 1000
                })
              } else {
                this.getOrgTree()
              }
            })
            .catch(error => {
              console.log(error)
            })
        })
        .catch(() => {
          showMsg(this, 'info', '已取消删除')
        })
    },
    closeOrgDialog() {
      this.orgDialogFormVisible = false
      this.isShowSonOrg = false
      this.editable = true
    },
    // 打开添加机构对话框
    openOrgDialog(org) {
      // 充值表单内容
      resetForm(this, 'addOrgForm')
      this.orgDialogFormVisible = true
      // 将选中的机构设置为上级机构，即在该机构下面添加机构
      this.orgModel.upperOrg = org
    },
    rightClick(event, data, node, component) {
      this.openOrgDialog(data)
    },
    switchToEdit() {
      this.editable = !this.editable
    },
    showSonOrgInput() {
      this.isShowSonOrg = !this.isShowSonOrg
    }
  }
}
</script>
