<template>
<!-- 登陆组件 -->
  <div class="login_container">
    <!-- 登录盒子开始 -->
    <div class="login_box">
      <!-- avatar用户头像区域开始 -->
      <div class="avatar_box">
        <img
        src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1599933144065&di=de936889be9f3b4df367ba1a91ed9650&imgtype=0&src=http%3A%2F%2Fpic.51yuansu.com%2Fpic3%2Fcover%2F03%2F02%2F14%2F5ae82e4dee186_610.jpg"
        >
      </div>
      <!-- 头像区域结束 -->
      <!-- 登录表单区域开始-->
      <!-- 使用了element-uiForm表单的典型表单以及表单验证 -->
      <!-- ref="loginFormRef"表示ref是表单实例对象，以此获取它 -->
      <!-- :model="loginForm"中是loginForm表单数据绑定对象 -->
      <!-- :rules="loginFormRules"表示rules绑定的值是表单的数据验证规则对象 -->
      <!-- label-width="0px"左侧提示文本占的尺寸设为0px -->
      <el-form
      ref="loginFormRef"
      :model="loginForm"
      :rules="loginFormRules"
      label-width="0px"
      class="login_form"
      >
        <!-- 用户名 -->
        <!-- prop表示为其添加具体的验证规则，不写无效，验证规则加给item而非input -->
        <el-form-item
        prop="username"
        >
          <!-- prefix-icon里面是显示图标内容，按需加载 -->
          <!-- iconfont是必要的，后面是图标名称，复制去掉. -->
          <!-- :model="loginForm.username"绑定到表单数据绑定对象的属性上 -->
          <el-input
          v-model="loginForm.username"
          prefix-icon="iconfont icon-user"
          >
          </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item
        prop="password"
        >
          <el-input
          v-model="loginForm.password"
          prefix-icon="iconfont icon-3702mima"
          type="password"
          >
          </el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button
          type="primary"
          @click="login"
          >登录
          </el-button>
          <el-button
          type="info"
          @click="resetLoginForm"
          >重置
          </el-button>
        </el-form-item>
      </el-form>
    <!-- 登录盒子结束 -->
    </div>
  </div>
</template>

<script>
export default {
  // 注意写法，是data () {}子组件data必须是函数
  data () {
    return {
      // 登录表单的数据绑定对象，表单所有获取的数据都在其中
      loginForm: {
        // 定义具体的数据，绑定的属性值
        username: 'admin',
        password: '123456'
      },
      // 表单验证规则对象
      loginFormRules: {
        // 验证用户名是否合法，每个都是对象数组
        // message是校验失败错误信息
        //  trigger: 'blur' 表示失去焦点时候触发验证
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击重置按钮，重置表单内容
    // resetFields是element-ui提供的重置方法
    // 拿到表单的数据对象然后调用该方法实现数据重置
    resetLoginForm () {
      // this指向表单实例，看$Ref里面内容
      // console.log(this)
      // 对获取的表单对象执行resetFields方法重置内容
      // 获取表单的引用，获取表单的引用对象，对其执行函数
      // 用;会报错
      this.$refs.loginFormRef.resetFields()
    },
    // 登录前的预验证
    login () {
      // validate官方说明Function(callback: Function(boolean【验证结果】, object))
      // validate接收一个回调函数，从而拿到验证结果，第一个值是个布尔值，表示预验证结果
      // 用async修饰成异步函数
      // 用await直接拿到结果
      this.$refs.loginFormRef.validate(async valid => {
        // console.log(valid)
        // 验证失败就返回，没返回就是验证成功可以登录
        if (!valid) return
        // 第一个参数是路径，第二个是请求参数
        // 验证要保证后端服务器处于启动状态
        // async及await把返回的Promise转化为具体返回对象
        // 对象解构，拿到返回的数据，把data解构为res
        // 发起post请求，请求路径+请求参数
        const { data: res } = await this.$http.post('login', this.loginForm)
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.error('登录失败！')
        // 没返回就登陆成功，这里用到element-ui的Message弹窗提示，这个是全局Vue组件挂载的
        this.$message.success('登录成功！')
        // 1. 将登录成功之后的 token，保存到客户端的 sessionStorage会话期间存储机制中
        //   1.1 项目中出了登录之外的其他API接口，必须在登录之后才能访问
        //   1.2 token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
        window.sessionStorage.setItem('token', res.data.token)
        // 2. 通过编程式导航跳转到后台主页，路由地址是 /home
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .login_container {
    background-color: #2b4b6b;
    height: 100%;
  }
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 8px;
    // 为了添加页面位移
    position: absolute;
    left: 50%;
    top: 50%;
    // 上面的50%是父盒子以及自身的50%
    transform: translate(-50%, -50%);
    // 以上放了个固定宽高的盒子在正中央

    .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    // 横向纵向，50%相对于盒子
    transform: translate(-50%, -50%);
    // 不加背景会透明
    background-color: #fff;
      img {
        // 图片宽高等于父盒子宽高即充满
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
  .login_form {
    position: absolute;
    // 距底部靠但没有全部显示
    bottom: 0;
    // 全部显示
    width: 100%;
    // 下面加完右边会超出
    padding: 0 20px;
    // 可以实现效果
    box-sizing: border-box;
  }
  .btns {
  display: flex;
  // 横轴上尾部对齐
  justify-content: flex-end;
  }
</style>
