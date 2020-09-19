<template>
  <!-- 组件名称就是类名 -->
  <!-- 使用element-ui自定义颜色的导航菜单 -->
  <el-container class="home-container">
    <!-- 头部区域开始 -->
    <el-header>
      <div>
        <img src="../assets/images/slider-icon.png">
        <span>购物商城后台管理系统</span>
      </div>
      <!-- type="info"渲染灰色按钮 -->
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 头部区域结束 -->
    <!-- 页面主体区域开始 -->
    <el-container>
      <!-- 侧边栏开始 -->
      <!-- 宽度根据isCollapse的值进行动态切换 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 折叠小图标 -->
        <div
        class="toggle-button"
        @click="toggleCollapse"
        >
        |||
        </div>
        <!-- 侧边栏菜单区域开始 -->
        <!-- unique-opened为true表示只保持一个子菜单的展开 -->
        <!-- unique-opened等价于:unique-opened="true" -->
        <!-- :collapse="isCollapse"动态绑定布尔值实现折叠展开功能 -->
        <!-- :collapse-transition="false"表示element-ui的折叠动画不启用 -->
        <!-- 注意布尔值一定要动态绑定 -->
        <!-- router是个布尔值，表示是否使用 vue-router 的模式 -->
        <!-- 启用该模式会在激活导航时以 index 作为 path 进行路由跳转 -->
        <!-- router表示为整个侧边栏开启路由模式 -->
        <!-- default-active是个字符串，表示当前激活菜单的 index -->
        <!-- 想要哪个菜单被激活就把它的index赋值给default-active属性 -->
        <el-menu
        background-color="#333744"
        text-color="#fff"
        active-text-color="#409EFF"
        unique-opened
        :collapse="isCollapse"
        :collapse-transition="false"
        router
        :default-active="activePath"
        >
          <!-- 一级菜单开始 -->
          <el-submenu
          :index="item.id + ''"
          v-for="item in menulist"
          :key="item.id"
          >
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <!-- 为不同的图标根据id添加类 -->
              <!-- iconsObj[item.id]表示iconsObj对象里面的item.id属性 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单开始 -->
            <!-- :index="'/'是因为index只接收字符串不接收数值 -->
            <!-- 用subItem.path做路由跳转地址，把/补上 -->
            <el-menu-item :index="'/' + subItem.path"
            v-for="subItem in item.children"
            :key="subItem.id"
            @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
            <!-- 二级菜单结束 -->
          </el-submenu>
          <!-- 一级菜单结束 -->
        </el-menu>
        <!-- 侧边栏菜单区域结束 -->
      </el-aside>
      <!-- 侧边栏结束 -->
      <!-- 右侧内容主体开始 -->
      <el-main>
        <!-- 路由占位符 -->
        <!-- 这里的占位符加上重定向是在/home展示Home组件时 -->
        <!-- 重定向到Welcome在该区域展示Welcome组件 -->
        <router-view></router-view>
      </el-main>
      <!-- 右侧内容主体结束 -->
    </el-container>
    <!-- 页面下方主体区域结束 -->
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      // 左侧菜单数据
      menulist: [],
      // 图标对象，为id指定类名
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // element-ui提供的属性，决定是否水平折叠菜单
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  // 组件一被创建就要获取左侧菜单数据并挂载
  created () {
    // 获取菜单
    this.getMenuList()
    // 获取菜单index赋值给default-active保持高亮
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      // 退出登录先销毁存储的token再返回登录页面
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // 获取的数据克隆到menulist
      this.menulist = res.data
      // console.log(res)
    },
    // 点击按钮，切换菜单的折叠与展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  // 页面撑满全屏
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    img {
      width: 60px;
      padding: 5px 5px 5px 15px;
      border-radius: 50%;
    }
    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    // 表示没有边框线，这样二级菜单不会凸出
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  // 防止|||挨得太近
  letter-spacing: 0.2em;
  // 鼠标放上去是小手
  cursor: pointer;
}
</style>
