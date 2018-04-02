<template>
  <div>
    <div style="height:60px">
      <div style="line-height:60px;margin-left:30px">
        <el-row>
          <el-col :span="24">
            <el-button type="primary" size="medium" @click="addOrg">添加</el-button>
            <el-button type="primary" size="medium" @click="deleteOrg">删除</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-row>
      <el-col :span="6" style="border:1px solid gray;height:600px;">
        <el-tree :data=" orgTree " :props="defaultProps " @node-click="handleNodeClick "></el-tree>
      </el-col>
      <el-col :span="18" style="border:1px solid gray;height:600px;">
        ahha
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { _getOrgTree } from '@/api/org'
export default {
  data() {
    return {
      orgTree: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created() {
    _getOrgTree(1)
      .then(response => {
        this.orgTree = response.data.payloads
      })
      .catch(error => {
        console.log(error)
      })
  },
  methods: {
    handleNodeClick(data) {
      console.log(data)
    },
    addOrg() {},
    deleteOrg() {}
  }
}
</script>