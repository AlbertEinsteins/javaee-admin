<template>
  <div class="">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>分类管理</el-breadcrumb-item>
      <el-breadcrumb-item>标签管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- el-card -->

    <el-card>

      <el-divider>所有标签</el-divider>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-divider>添加标签</el-divider>
          <div class="box">

            <h5>添加</h5>
            <el-input v-model="tag.tagName" placeholder="请输入标签内容"></el-input>
            <span style="font-size: 12px; color: #7c9398;">页面上显示的名称</span>
            <el-divider></el-divider>
            <el-button type="primary" @click="addTag">确定添加</el-button>
          </div>
        </el-col>

        <el-col :span="12" :offset="4">
          <div class="box">
            <el-tag v-for="(item) in tagList" :key="item.tagId" 
              type="default" closable>{{ item.tagName }}</el-tag>
            
          </div>
          <el-pagination :total="total" 
            :current-page="queryVo.pagenum" 
            :page-size="queryVo.pagesize"
            @current-change="handleCurrentChange" layout="prev, pager, next, jumper" 
            :hide-on-single-page="false">
          </el-pagination>
        </el-col>
      </el-row>

    </el-card>

  </div>
</template>

<script>
  export default {
    name: '',
    data() {
      return {
        queryVo: {
          key: null,
          pagenum: 1,
          pagesize: 35
        },
        total: 0,
        tagList: [],
        tag: {}
      }
    },
    created() {
      this.getTagList()
    },
    methods: {
      async getTagList() {
        const {
          data: res
        } = await this.$http.get('/tag/page', { params: this.queryVo })
        console.log(res)
        if (res.code !== 200) return this.$message.error('拉取标签列表失败!')

        this.tagList = res.data.data
        this.total = res.total 
        this.queryVo = res.data.queryVo
      },
      handleCurrentChange(newPage) {
        console.log(newPage)
      },
      async addTag() {
        const { data: res }
          = await this.$http.post('/tag', this.tag)
        if(res.code !== 200)  return this.$message.error('添加失败!')

        this.tag = { }
        this.getTagList()
        this.$message.success('添加成功!') 
      }
    },
  }
</script>

<style lang="less" scoped>
  .box {
    border: 1px solid #eee;
    padding: 5px;
  }

  .box::after {}

  .el-tag {
    margin: 5px 6px;
  }
</style>