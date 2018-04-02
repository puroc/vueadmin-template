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
        <el-tree node-key="id" :default-expanded-keys="[1]" :data="orgTree" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
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
import { _getOrgTree, _addOrg } from '@/api/org';
import { resetForm } from '@/utils/index';
export default {
  data() {
    return {
      orgTree: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      selectedOrg: {},
      addOrgModel: {
        upperOrg: {}
      },
      addOrgDialogFormVisible: false
    }
  },
  created() {
    this.getOrgTree(1)
  },
  methods: {
    getOrgTree(orgId) {
      _getOrgTree(orgId)
        .then(response => {
          this.orgTree = response.data.payloads
        })
        .catch(error => {
          console.log(error)
        })
    },
    handleNodeClick(data) {
      this.selectedOrg = data
    },
    addOrg() {
      this.addOrgDialogFormVisible = false
      const org = []
      org.push({
        label: this.addOrgModel.label
      })
      _addOrg(this.addOrgModel.upperOrg.id, org)
        .then(() => {
          this.selectedOrg = {}
          this.getOrgTree(1)
        })
        .catch(error => {
          console.log(error)
        })
    },
    deleteOrg() {},
    openAddOrgDialog() {
      // 没有选择上级机构时，不允许添加机构
      if (!this.selectedOrg.label) {
        return
      }
      this.addOrgDialogFormVisible = true
      resetForm(this, 'addOrgForm')
      this.addOrgModel.upperOrg = this.selectedOrg
    }
  }
}
</script>
