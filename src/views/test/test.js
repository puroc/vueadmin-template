import { _getUserListByOrgId } from '@/api/org'
import { _deleteUser, _editUser, _addUser, _deleteUserList } from '@/api/user'
import { deepCopy, showMsg, showConfirmMsg, resetForm } from '@/utils/index'
import { mapGetters } from 'vuex'
import Store from '@/store'
export default {
  data() {
    const validateUsername = (rule, value, callback) => {
      if (new RegExp('^\\w+$').test(value)) {
        callback()
      } else {
        callback(new Error('用户名只能包含字母数字和下划线'))
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
        new RegExp('^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+$').test(
          value
        )
      ) {
        callback()
      } else {
        callback(new Error('请输入正确的邮箱'))
      }
    }

    return {
      storeState: Store.state,
      users: [],
      multipleSelection: [],
      currentPage: 1,
      pageSizeList: [10, 30, 50],
      pageSize: 10,
      totalRecord: 0,
      editDialogFormVisible: false,
      addDialogFormVisible: false,
      editUserModel: {},
      addUserModel: {},
      searchInputModel: '',
      searchSelectModel: 'name',
      formLabelWidth: '70px',
      editable: true,
      batchDeleteUserList: [],
      validateUserRules: {
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
          {
            min: 3,
            max: 6,
            message: '密码长度在 3 到 6 个字符',
            trigger: 'blur'
          }
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
    this.getUserList()
  },
  watch: {
    // 观察currentOrg是否变化，若变化，则根据最新的currentOrg获取用户
    'storeState.user.currentOrg': function() {
      this.getUserList()
    }
  },
  methods: {
    getUserList() {
      const params = {
        current: this.currentPage === 1 ? 0 : this.currentPage * this.pageSize,
        size: this.pageSize
      }
      _getUserListByOrgId(this.currentOrg.id, params)
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
          _editUser(this.editUserModel)
            .then(response => {
              if (response.data.resultCode === '1') {
                this.getUserList()
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
      showConfirmMsg(this, '此操作将永久删除该用户, 是否继续?')
        .then(() => {
          _deleteUser(row)
            .then(response => {
              if (response.data.resultCode === '1') {
                showMsg(this, 'success', '删除成功')
              } else {
                showMsg(this, 'error', '删除失败')
              }
              this.getUserList()
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
          this.addUserModel.orgId = this.currentOrg.id
          _addUser(this.addUserModel)
            .then(response => {
              if (response.data.resultCode === '1') {
                showMsg(this, 'success', '添加成功')
                this.getUserList()
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
      resetForm(this, 'addUserForm')
    },
    openEditUserDialog(row) {
      this.editDialogFormVisible = true
      this.editUserModel = deepCopy(row)
      this.editable = true
    },
    handleSelectionChange(userList) {
      this.batchDeleteUserList = userList
    },
    changePageNum(pageNum) {
      this.currentPage = pageNum
      this.getUserList()
    },
    chanagePageSize(pageSize) {
      this.pageSize = pageSize
      this.getUserList()
    },
    batchDeleteUsers() {
      showConfirmMsg(this, '此操作将永久删除该用户, 是否继续?')
        .then(() => {
          _deleteUserList(this.batchDeleteUserList)
            .then(() => {
              this.getUserList()
            })
            .catch(error => {
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
      } else if (key === 'username') {
        doSearch({ username: value })
      } else if (key === 'email') {
        doSearch({ email: value })
      } else if (key === 'phone') {
        doSearch(1, { phone: value })
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
        _getUserListByOrgId(_this.currentOrg.id, params)
          .then(response => {
            _this.users = response.data.payloads
            _this.totalRecord = response.data.totalNum
          })
          .catch(error => {
            console.log(error)
          })
      }
    }
  }
}
