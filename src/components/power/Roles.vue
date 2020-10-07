<template>
  <div>
    <!-- 面包屑导航区域开始 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑导航结束 -->

    <!-- 卡片视图开始 -->
    <!-- 在里面放行列后再放按钮 -->
    <el-card>
      <!-- 添加角色按钮区域开始 -->
      <!-- 行 -->
      <el-row>
        <!-- 列 -->
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 添加角色按钮区域结束 -->
      <!-- 角色列表区域开始 -->
      <el-table :data="rolelist" border stripe>
        <!-- 展开功能开始 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 栅格系统布局组件 -->
            <!-- 循环及样式要写在el-row -->
            <el-row
            :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
            v-for="(item1, i1) in scope.row.children"
            :key="item1.id"
            >
              <!-- 渲染一级权限，占5列 -->
              <!-- 每行加下边框，第一行加上边框，按钮居中 -->
              <el-col
              :span="5">
                <el-tag
                closable
                @close="removeRightById(scope.row,item1.id)"
                >{{item1.authName}}</el-tag>
                <!-- 加小图标 -->
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 一级权限渲染结束 -->
              <!-- 渲染二级三级权限，24列剩下内容都占满 -->
              <el-col :span="19">
                <!-- 通过for循环渲染二级权限，列里面弄成一行，行内弄列。。 -->
                <!-- 把循环写在行上 -->
                <el-row
                :class="[i2 === 0 ?'':'bdtop','vcenter']"
                v-for="(item2, i2) in item1.children"
                :key="item2.id"
                >
                  <!-- 左边列二级权限 -->
                  <el-col :span="6">
                    <el-tag
                    type="success"
                    closable
                    @close="removeRightById(scope.row,item2.id)"
                    >{{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 右边列三级权限 -->
                  <el-col :span="18">
                    <!-- 循环后在tag按钮里展示 -->
                    <el-tag
                    v-for="(item3) in item2.children"
                    :key="item3.id"
                    type="warning"
                    closable
                    @close="removeRightById(scope.row,item3.id)"
                    >
                    {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
              <!-- 二三级权限渲染结束 -->
            </el-row>
            <!-- <pre>{{scope.row}}</pre> -->
          </template>
        </el-table-column>
        <!-- 展开功能结束 -->
        <!-- 索引列开始 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button
            size="mini"
            type="warning"
            icon="el-icon-setting"
            @click="showSetRightDialog(scope.row)"
            >
            分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 角色列表区域结束 -->
    </el-card>
    <!-- 卡片视图结束 -->
    <!-- 分配权限的对话框开始 -->
    <!-- @close="setRightDialogClosed"关闭树形控件清空权限数组 -->
    <el-dialog
    title="分配权限"
    :visible.sync="setRightDialogVisible"
    width="50%"
    @close="setRightDialogClosed"
    >
      <!-- 树形控件 -->
      <!-- :data="rightslist"数据源 -->
      <!-- :props="treeProps"数据绑定字段 -->
      <!-- show-checkbox实现复选框 -->
      <!-- node-key="id"说明选中的时候选中的是id，接收string，为唯一值 -->
      <!-- default-expand-all打开默认展示所有节点 -->
      <!-- :default-checked-keys="defKeys"设置默认勾选节点的数组 -->
      <el-tree
      :data="rightslist"
      :props="treeProps"
      show-checkbox
      node-key="id"
      default-expand-all
      :default-checked-keys="defKeys"
      ref="treeRef"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限的对话框结束 -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 所有角色列表数据
      rolelist: [],
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 所有权限的数据
      rightslist: [],
      // 树形控件的属性绑定对象
      treeProps: {
        // 看到哪一个值
        label: 'authName',
        // 父子接点通过该属性实现嵌套
        children: 'children'
      },
      // 默认选中的节点Id值数组，打开权限树形控件自动勾选的权限数组
      defKeys: [],
      // 当前即将分配权限的角色id
      roleId: ''
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    // 获取所有角色列表数据
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }
      this.rolelist = res.data
      console.log(this.rolelist)
    },
    // 根据id删除对应权限
    async removeRightById (role, rightId) {
      // 弹框提示用户是否要删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // 上面是错误捕获
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除！')
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败！')
      }
      // 重新渲染会导致页面刷新，对话框关闭
      // this.getRolesList()
      // 把更新后的数据重新赋值即可
      role.children = res.data
    },
    // 展示分配权限的对话框
    async showSetRightDialog (role) {
      this.roleId = role.id
      // 获取所有权限的数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败！')
      }
      // 把获取到的权限数据保存到 data 中
      this.rightslist = res.data
      // console.log(this.rightslist)
      // 递归获取三级节点的Id
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到 defKeys 数组中
    getLeafKeys (node, arr) {
      // 如果当前 node 节点不包含 children 属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }

      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 监听分配权限对话框的关闭事件，清空数组
    setRightDialogClosed () {
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]

      const idStr = keys.join(',')

      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败！')
      }

      this.$message.success('分配权限成功！')
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
// 权限按钮间隔
.el-tag {
  margin: 7px;
}
// 顶部边框线
.bdtop {
  border-top: 1px solid #eee;
}
// 底部边框线
.bdbottom {
  border-bottom: 1px solid #eee;
}
//纵向居中对齐
.vcenter {
  display: flex;
  align-items: center;
}
</style>
