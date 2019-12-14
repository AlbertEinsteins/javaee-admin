<template>
  <el-container class="home-container">
    <el-header>
      <div class="left">
        <img src="../assets/bg2.jpeg" alt="">
        <span>博客后台管理系统</span>
      </div>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <el-menu :default-active="activePath" router :unique-opened="true" :collapse="isCollapse"
          background-color="#373d41" text-color="#fff" active-text-color="#409eff">

          <!-- 一级菜单 -->
          <el-submenu :index="item.adminId + ''" 
            v-for="item in menuList" :key="item.adminId">
            <template slot="title">
              <i class="el-icon-s-home"></i>
              <span> {{ item.adminName }} </span>
            </template>

            <el-menu-item :index="'/' + subItem.adminPath" 
              v-for="subItem in item.children" :key="subItem.adminId" 
              @click="savePath('/' + subItem.adminPath)">
              
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span> {{ subItem.adminName }} </span>
              </template>
            </el-menu-item>

          </el-submenu>
        </el-menu>


      </el-aside>
      <!-- 内容显示 -->
      <el-container>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>


    </el-container>
  </el-container>
</template>

<script>
  export default {
    data() {
      return {
        menuList: [],
        isCollapse: false,
        activePath: ''
      }
    },
    created() {
      this.activePath = sessionStorage.getItem('activePath')
      this.getMenuList()
    },
    methods: {
      async getMenuList() {
        const { data: res } =
          await this.$http.get('/admin/list')
          console.log(res) ;
        if (res.code !== 200) return this.$message.error(res.msg)

        this.menuList = res.data
      },
      savePath(path) {
        sessionStorage.setItem('activePath', path)
      }
    },
    components: {}
  }
</script>
<style lang="less" scoped>
  .home-container {
    height: 657px;
  }

  .el-header {
    background-color: #373d41;  
    color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 20px;

    .left {
      display: flex;
      align-items: center;

      img {
        height: 60px;
      }

      span {
        margin-left: 15px;
      }
    }
  }

  .el-aside {
    background-color: #373d41;

    .el-menu {
      border-right: 0;
    }
  }
  .el-main {
    background-color: #eaedf1;
  }

</style>