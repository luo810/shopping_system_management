<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 用户列表卡片视图区域开始 -->
    <el-card>
      <!-- 搜索与添加用户区域开始 -->
      <!-- :gutter="20"是列与列间隔，这里是输入框与按钮 -->
      <!-- query是搜索关键字 -->
      <!-- clearable是可清空的文本输入框 -->
      <!-- @clear="getUserList"是清空文本框时触发的事件，重新发起请求 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
          placeholder="请输入内容"
          v-model="queryInfo.query"
          clearable
          @clear="getUserList"
          >
            <el-button
            slot="append"
            icon="el-icon-search"
            @click="getUserList"
            >
            </el-button>
          </el-input>
        </el-col>
         <!-- @click="addDialogVisible = true"点击添加用户按钮弹出添加用户的对话框 -->
        <el-col :span="4">
          <el-button
          type="primary"
          @click="addDialogVisible = true">
          添加用户
          </el-button>
        </el-col>
      </el-row>
      <!-- 搜索与添加用户区域结束 -->
      <!-- 用户管理列表区域开始 -->
      <!-- :data="userlist"为列表绑定数据 -->
      <!-- border是加边框线 -->
      <!-- stripe实现隔行变色 -->
      <el-table :data="userlist" border stripe>
        <!-- type="index"表示这一列是索引列 -->
        <el-table-column type="index"></el-table-column>
        <!-- 第二列用label指定叫姓名，用prop绑定数据 -->
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <!-- 用插槽实现状态列的渲染 -->
        <!-- 若状态有prop会被作用域插槽覆盖 -->
        <el-table-column label="状态">
          <!-- scope.row表示当前行的数据，.mg_state在当前选中时为true -->
          <template slot-scope="scope">
            <!-- 开关的开启关闭由v-model绑定的值决定 -->
            <!-- change是switch 状态发生变化时的回调函数 -->
            <el-switch
            v-model="scope.row.mg_state"
            @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <!-- 此处宽度修改至图标能放一行 -->
        <el-table-column label="操作" width="180px">
          <!-- 作用域插槽开始 -->
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <!-- 依次为颜色图标尺寸 -->
            <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditDialog(scope.row.id)"
            >
            </el-button>
            <!-- 删除按钮 -->
            <!-- type="danger"会把按钮改成红色 -->
            <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeUserById(scope.row.id)"
            >
            </el-button>
            <!-- 分配角色按钮 -->
            <!-- tooltip用于鼠标放上去告知用户该图标对应什么功能,button包含在内部 -->
            <!-- effect="dark"表示提示内容的背景色 -->
            <!-- content="分配角色"为提示文本 -->
            <!-- placement="top"表示提示文字显示的位置 -->
            <!-- enterable是个布尔值，表示鼠标是否可进入到 tooltip 中 -->
            <!-- 设为false鼠标移开提示文字会自动隐藏 -->
            <el-tooltip
            effect="dark"
            content="分配角色"
            placement="top"
            :enterable="false"
            >
            <!-- type="warning"会把按钮改成黄色 -->
              <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="setRole(scope.row)"
              >
              </el-button>
            </el-tooltip>
          </template>
          <!-- 作用域插槽结束 -->
        </el-table-column>
      </el-table>
      <!-- 用户管理列表功能结束 -->
      <!-- 分页功能实现 -->
      <!-- @size-change="handleSizeChange"是个事件绑定，切换x条/页浏览条时触发 -->
      <!-- @current-change="handleCurrentChange"在页码值变化时触发 -->
      <!-- :current-page="queryInfo.pagenum"表示当前显示的是第几页的数据 -->
      <!-- 当前显示的是第几页的数据可以由获取的queryInfo里面的pagenum属性得到 -->
      <!-- :page-sizes="[1, 2, 5, 10]"数组里是x条/页的x值 -->
      <!-- :page-size="queryInfo.pagesize"表示当前情况下x条/页 -->
      <!-- layout="total, sizes, prev, pager, next, jumper"用来指示页面上需要展示的功能组件 -->
      <!-- total是共x条，sizes是x条/页，依次是前一页，页码，后一页，跳转 -->
      <!-- :total="total"表示总共多少条数据 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      >
      </el-pagination>
      <!-- 分页功能实现完毕 -->
    </el-card>
    <!-- 用户列表卡片视图区域结束 -->
    <!-- 用于添加用户的对话框 -->
    <!-- title="添加用户"是标题 -->
    <!-- :visible.sync="addDialogVisible"控制对话框显示隐藏 -->
     <!-- width="50%"控制对话框宽度 -->
     <!-- @close="addDialogClosed"对话框关闭时触发 -->
    <el-dialog
    title="添加用户"
    :visible.sync="addDialogVisible"
    width="50%"
    @close="addDialogClosed"
    >
      <!-- 添加用户对话框内容主体区域表单开始 -->
      <!-- :model="addForm"添加表单项 -->
      <!-- :rules="addFormRules"添加表单验证规则 -->
      <el-form
      :model="addForm"
      :rules="addFormRules"
      ref="addFormRef"
      label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 添加用户对话框内容主体区域表单结束 -->
      <!-- 对话框底部按钮区域开始 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
      <!-- 对话框底部按钮区域结束 -->
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog
    title="修改用户"
    :visible.sync="editDialogVisible"
    width="50%"
    @close="editDialogClosed"
    >
      <el-form
      :model="editForm"
      :rules="editFormRules"
      ref="editFormRef"
      label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog
    title="分配角色"
    :visible.sync="setRoleDialogVisible"
    width="50%"
    @close="setRoleDialogClosed"
    >
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    // 自定义验证邮箱的规则，本质是箭头函数
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      // 调用.test方法校验
      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 自定义验证手机号的规则
    // 验证规则，要验证的值，回调函数
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      userlist: [],
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度在3~10个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '用户名长度在6~15个字符之间', trigger: 'blur' }
        ],
        // validator: checkEmail表示需要验证checkEmail这个自定义规则
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {},
      // 修改表单的验证规则对象
      editFormRules: {
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入用户手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制分配角色对话框的显示与隐藏
      setRoleDialogVisible: false,
      // 需要被分配角色的用户信息
      userInfo: {},
      // 所有角色的数据列表
      rolesList: [],
      // 已选中的角色Id值
      selectedRoleId: ''
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 获取用户列表数据
    async getUserList () {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败！')
      }
      this.userlist = res.data.users
      this.total = res.data.total
      console.log(res)
    },
    // 监听 pagesize 改变的事件，x条/页
    handleSizeChange (newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange (newPage) {
      // console.log(newPage)
      this.queryInfo.pagenum = newPage
      // 数据发生变化后重新获取数据
      this.getUserList()
    },
    // 监听 switch 开关状态的改变
    async userStateChanged (userinfo) {
      // console.log(userinfo)
      // 调用API接口保存最新状态,put一般表示修改
      // 地址为users/:uId/state/:type需要修改模板字符串拼接动态参数
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户状态失败！')
      }
      this.$message.success('更新用户状态成功！')
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed () {
      // 获取表单的引用调用resetFields
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮，添加新用户，对其进行预校验
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败！')
        }
        this.$message.success('添加用户成功！')
        // 隐藏添加用户的对话框
        this.addDialogVisible = false
        // 重新获取用户列表数据
        this.getUserList()
      })
    },
    // 展示编辑用户的对话框
    // 通过用户id查询用户信息，并保存到editForm
    async showEditDialog (id) {
      // console.log(id)
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败！')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editUserInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 发起修改用户信息的数据请求
        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('更新用户信息失败！')
        }
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        this.getUserList()
        // 提示修改成功
        this.$message.success('更新用户信息成功！')
      })
    },
    // 根据Id删除对应的用户信息
    async removeUserById (id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          // 提示按钮文本
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          // 小图标
          type: 'warning'
        }
      ).catch(err => err)
      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消了删除，则返回值为字符串 cancel
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败！')
      }
      this.$message.success('删除用户成功！')
      this.getUserList()
    },
    // 展示分配角色的对话框
    async setRole (userInfo) {
      this.userInfo = userInfo
      // 在展示对话框之前，获取所有角色的列表
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }
      this.rolesList = res.data
      this.setRoleDialogVisible = true
    },
    // 点击按钮，分配角色
    async saveRoleInfo () {
      if (!this.selectedRoleId) {
        return this.$message.error('请选择要分配的角色！')
      }
      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.selectedRoleId
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('更新角色失败！')
      }
      this.$message.success('更新角色成功！')
      this.getUserList()
      this.setRoleDialogVisible = false
    },
    // 监听分配角色对话框的关闭事件
    setRoleDialogClosed () {
      this.selectedRoleId = ''
      this.userInfo = {}
    }
  }
}
</script>

<style lang="less" scoped>
</style>
