<template>
  <div class="">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>博文管理</el-breadcrumb-item>
      <el-breadcrumb-item>写文章</el-breadcrumb-item>
    </el-breadcrumb>


    <div class="wrapper">
      <h3 @click="logMsg" style="margin-bottom: 4px; padding: 0; font-weight: 500;">文章编辑</h3>
    </div>
    <el-row :gutter="30">
      <el-col :span="18">
        <el-input v-model="article.articleTitle" placeholder="请输入文章标题"></el-input>
        <el-card style="margin-top: 10px;" :body-style="{ padding: '0px' }">
          <editor id="editorId" :init="editorConfig" 
            v-model="msg">

          </editor>
        </el-card>

      </el-col>
      <el-col :span="6" :offset="0">
        <el-row>
          <el-col :span="24">
            <el-card :body-style="{ padding: '5px' }">
              <div class="box">
                <div class="bd-bottom pd8px">
                  <h3>发布</h3>
                </div>
                <div class="bd-bottom pd4px">
                  <el-row class="mgtb10px">
                    <el-col :span="8" style="line-height: 40px; font-size: 14px;">
                      文章类型
                    </el-col>
                    <el-col :span="14" :offset="2">
                      <el-select v-model="article.articleType" placeholder="请选择文章类型" clearable>
                        <el-option v-for="(item) in articleType" :key="item.dictId" 
                          :label="item.dictValue" :value="item.dictId">
                        </el-option>
                      </el-select>
                    </el-col>
                  </el-row>
                </div>
                <div class="pd8px box-flex">
                  <el-button type="default" @click="" size="mini">暂代</el-button>
                  <el-button type="primary" @click="" size="mini">发布</el-button>
                </div>
              </div>
            </el-card>
            <el-card class="mt15px" :body-style="{ padding: '5px' }">
              <div class="box">
                <div class="bd-bottom pd8px">
                  <h3>分类</h3>
                </div>
                <div class="bd-bottom pd4px">
                  <el-tree :data="sortTree" ref="sortRef" node-key="sortId"
                    :props="sortProp" show-checkbox check-strictly
                    @check="check"></el-tree>
                  
                </div>
              </div>
            </el-card>
            <el-card class="mt15px" :body-style="{ padding: '5px' }">
              <div class="box">
                <div class="bd-bottom pd8px">
                  <h3>标签</h3>
                </div>
                <div class="bd-bottom pd4px">
                  <el-row class="mgtb10px">
                    <el-col :span="24" style="line-height: 40px; font-size: 14px;">
                      <el-input placeholder="请输入标签名"></el-input>
                    </el-col>
                  </el-row>
                </div>
                <div class="pd8px box-flex">
                  <el-select  placeholder="">
                    <el-option class="height15px"
                      key="item.value"
                      label="item.label"
                      value="item.value">
                    </el-option>
                  </el-select>
                  
                </div>
              </div>
            </el-card>
            
          </el-col>
        </el-row>

      </el-col>
    </el-row>


  </div>
</template>

<script>
import tinymce from 'tinymce/tinymce'
import 'tinymce/themes/silver/theme.min.js'
import Editor from '@tinymce/tinymce-vue'

//插件
import 'tinymce/plugins/image'
import 'tinymce/plugins/link'
import 'tinymce/plugins/code'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/textcolor'
import 'tinymce/plugins/hr'
import 'tinymce/plugins/advlist'


  export default {
    name: '',
    components: { 
      Editor
    },
    data() {
      return {
        msg: `aisndiansdinaisniisdubausdbuasd<h2>I am the Title</h2>`,
        editorConfig: {
          language_url: '/tinymce/langs/zh_CN.js',
          language: 'zh_CN',
          skin_url: '/tinymce/skins/ui/oxide',
          height: 600,
          emoticons_database_url: '/tinymce/emojis.js',
          autosave_database_url: '/tinymce/plugin.js',
          plugins: 
            `link lists image code table wordcount hr
            `,
          toolbar1: ` undo redo | cut copy paste pastetext | hr bold italic underline strikethrough 
            | fontsizeselect | forecolor 
            backcolor | alignleft aligncenter alignright alignjustify bullist numlist
            `,
          toolbar2: '| outdent indent blockquote |link unlink image code | removeformat',
          //文件上传url
          images_upload_url: 'http://localhost:8089/api/v1/user/upload',
          images_upload_handler: (blobInfo, sucFun, failFun) => {
            let xhr, formData
            const file = blobInfo.blob()

            xhr = new XMLHttpRequest()
            xhr.withCredentials = false
            xhr.open('POST', `http://localhost:8089/api/v1/user/upload`)
            xhr.onload = () => {
              let json
              if(xhr.status !== 200) {
                failFun('HTTP Error: ' + xhr.status)
              }

              json = JSON.parse(xhr.responseText)
              if(!json) {
                failFun('Invalid Json: ' + xhr.responseText)
                return 
              }
              sucFun(json.data)
            }
            formData = new FormData()
            formData.append('file', file, file.name)
            xhr.send(formData)
          },
          body_class: 'mybody-class'
        },
        //DATA
        article: {

        },
        articleType: [],
        //分类树
        sortTree: [],
        sortProp: {
          children: 'children',
          label: 'sortName',
        },
        //类型是否勾选检查
        typeCheck: false,
        //分类是否勾选检查
        sortCheck: false,
        //分类是单选
        sortSingle: false,
        //标签是否勾选
        tagCheck: false
      } 
    },
    created() {
      this.getArticleType() 
      this.getSortTree()
    },
    methods: {
      //打印内容
      logMsg() {
        console.log(this.msg)
      },
      //获取文章类型
      async getArticleType() {
        const { data: res }
          = await this.$http.get('/dict/articletype')
        console.log(res)
        if(res.code !== 200)  return this.$message.error('获取文章类型失败!')

        this.articleType = res.data 
      },
      //获取分类树
      async getSortTree() {
        const { data: res }
          = await this.$http.get('/sort/list?type=tree')
        console.log(res)

        this.sortTree = res.data 
      },
      //树节点点击回调函数
      check(obj, checkObj) {
        if(this.sortCheck == false) {
          this.sortCheck = true 
          return 
        }
        //第二次点击，清空选中项
        checkObj.checkedKeys.forEach(key => {
          this.$refs.sortRef.setChecked(key, false)
        })
        // console.log(checkObj)
        this.sortCheck = false
        return this.$message.info('只能选中一个分类') 
      }
    },
  }
</script>

<style lang="less" scoped>
  .box::after {
    display: block;
    content: "";
    clear: both;
  }

  .el-card {
    margin: 0;
    padding: 0;
  }

  .mt10px {
    margin-top: 10px;
  }
  .mt15px {
    margin-top: 15px;
  }

  .pd4px {
    padding: 5px;
  }

  .mgtb10px {
    margin: 10px 0;
  }

  .pd8px {
    padding: 8px;
  }

  .bd-bottom {
    border-bottom: 1px solid #eee;
  }

  h3 {
    margin: 0 0;
    font-weight: 400;
  }

  .wrapper {
    display: flex;
    flex-direction: row-reverse;
    box-shadow: 0 1px 1px 1px #eee;
  }

  .box-flex {
    display: flex;
    justify-content: space-between;
  }
  .mybody-class {
    margin: 8px 0;
  }

</style>