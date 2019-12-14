<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/', name: '' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 搜索框 -->
      <el-row :gutter="10">
        <el-col :span="7">
          <el-input v-model="queryVo.key" placeholder="输入用户名" clearable=""></el-input>
        </el-col>
        <el-col :span="2" style="margin-right: 3px;">
          <el-button icon="el-icon-search" type="success" @click="getUserList" size="medium">查找</el-button>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="showAddUserDialog" size="medium">新增用户</el-button>

        </el-col>

      </el-row>

      <!-- 用户列表 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="Avator" width="70">
          <template slot-scope="scope">
            <el-avatar :src="scope.row.imgUrl" @error="errorHandler">
              <template slot="default">
                <div>
                  sry
                </div>
              </template>
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column label="角色">
          <template slot-scope="scope">
            <span v-if="scope.row.priorityId == 1">管理员</span>
            <span v-else>普通用户</span>
          </template>
        </el-table-column>
        <el-table-column label="密码">
          <template slot-scope="scope">
            <span>******</span>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="电子邮件"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" type="primary" @click="showEditUserDialog(scope.row.userId)" circle
              size="small"></el-button>
          </template>
        </el-table-column>

      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryVo.pagenum" :page-sizes="[1, 5, 10, 15]" :page-size="queryVo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total" background>
      </el-pagination>

    </el-card>


    <!-- 添加Dialog -->
    <el-dialog title="添加用户" :visible.sync="addFormVisible" width="50%" @close="">

      <el-form :model="addForm" ref="addFormRef" :rules="addRules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="repassword">
          <el-input type="password" v-model="addForm.repassword"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input type="email" v-model="addForm.email" placeholder=""></el-input>
        </el-form-item>

      </el-form>


      <span slot="footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!--修改dialog  -->
    <el-dialog title="个人信息" :visible.sync="editFormVisible" width="50%" @close="">

      <el-form :model="editForm" :rules="addRules" ref="editFormRef" label-width="100px">
        <el-form-item label="姓名">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="editForm.password"></el-input>
        </el-form-item>
        <el-form-item label="电子邮件" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="个人头像">
          <el-avatar :size="100" style="" @error="errorHandler" :src="editForm.imgUrl">
          </el-avatar>
        </el-form-item>
        <el-form-item label="" style="margin-top: -20px;">
          <el-button type="primary" @click="uploadVisible = true">修改头像</el-button>
        </el-form-item>

      </el-form>


      <span slot="footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改头像 -->
    <el-dialog title="修改头像" :visible.sync="uploadVisible" width="30%" @close="">
      <el-upload ref="upload" class="avatar-uploader" 
        action="http://localhost:8089/api/v1/user/upload" 
        :auto-upload="true" :show-file-list="false"
        :on-success="handleAvatarSuccess" 
        :before-upload="beforeAvatarUpload">
        <img v-if="editForm.imgUrl" :src="editForm.imgUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>


      <span slot="footer">
        <el-button @click="uploadVisible = false">取 消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: '',
    data() {
      //checkUsername
      var checkUsername = async (rule, value, cb) => {
        const {
          data: res
        } = await this.$http.get('/user/exist', {
          params: {
            'username': value
          }
        })
        if (res.code !== 200) return cb(new Error('用户已存在'))
        cb()
      }

      //自定义校验规则
      var checkPassword = (rule, value, cb) => {
        // console.log(value)
        if (!value || this.addForm.password != value) {
          return cb(new Error('密码不一致'))
        }
        cb()
      }
      var checkEmail = (rule, value, cb) => {
        var email = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/

        // console.log(value)
        if (!email.test(value)) {
          return cb(new Error('请输入正确的邮件格式'))
        }
        cb()
      }
      return {
        queryVo: {
          pagenum: 1,
          pagesize: 5,
          key: ''
        },
        total: 0,
        userList: [],
        //添加表单
        addForm: {},
        addFormVisible: false,
        addRules: {
          username: [{
              required: true,
              message: '请输入用户名',
              trigger: 'blur'
            },
            {
              validator: checkUsername,
              trigger: 'blur'
            }
          ],
          password: [{
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            },
            {
              min: 5,
              message: '最小5个字符',
              trigger: 'blur'
            }
          ],
          repassword: [{
              required: true,
              message: '请重复输入密码',
              trigger: 'blur'
            },
            {
              validator: checkPassword,
              trigger: 'blur'
            }
          ],
          email: [{
            validator: checkEmail,
            trigger: 'blur'
          }]
        },
        editFormVisible: false,
        editForm: {},
        uploadVisible: false,
      }
    },
    created() {
      this.getUserList()
    },
    methods: {
      async getUserList() {
        const {
          data: res
        } =
        await this.$http.get('/user/list', {
          params: this.queryVo
        })
        if (res.code !== 200) return this.$message.error('用户列表加载失败')

        // console.log(res) 
        this.userList = res.data.data
        this.queryVo = res.data.queryVo
        this.total = res.data.total
      },
      handleSizeChange(newSize) {
        // console.log(newSize) 
        this.queryVo.pagesize = newSize
        this.getUserList()
      },
      handleCurrentChange(pagenum) {
        this.queryVo.pagenum = pagenum
        this.getUserList()
      },
      showAddUserDialog() {
        this.addFormVisible = true
      },
      //添加用户
      addUser() {
        //判断是否校验成功
        this.$refs.addFormRef.validate(async isvalid => {
          if (isvalid) {
            console.log(this.addForm)
            const {
              data: res
            } = await this.$http.post('/user/add', this.$qs.stringify(this.addForm))
            if (res.code !== 200) return this.$message.error('添加失败')

            this.getUserList()
            this.addFormVisible = false
            this.$message.success('添加成功')
            this.$refs.addFormRef.fields.reset()
          } else {
            return this.$message.error('请认真填写表单')
          }
        })

      },
      async showEditUserDialog(userId) {
        const {
          data: res
        } = await this.$http.get(`/user/${userId}`)
        if (res.code !== 200) return this.$message.error('用户信息查询失败!')

        this.editForm = res.data
        this.editFormVisible = true
      },
      handleAvatarSuccess(res, file) {
        console.log(res)
        // console.log(file)
        this.editForm.imgUrl = res.data 
      },
      beforeAvatarUpload(file) {
        const imgReg = /\/(png|jpe?g|gif|svg)(\?.*)?$/
        
        const isLt2M = file.size / 1024 / 1024 < 2;
        const isTypeOK = imgReg.test(file.type) 

        if(!isTypeOK) {
          this.$message.error('图片只能是png、jpeg、gif、svg格式!')
        }
        if(!isLt2M) {
          this.$message.error('上传图片的大小不能超过2MB')
        }

        return isTypeOK && isLt2M
      },
      //图片未加载出来
      errorHandler() {
        return false
      },
      async editUser() {
        const { data: res }
          = await this.$http.put('/user', this.editForm)
        if(res.code !== 200)  return this.$message.error('更新用户信息失败!')

        this.$message.success('用户信息更新成功!')
        this.getUserList()
        this.editFormVisible = false
      }
    },
  }
</script>

<style lang="less" scoped>
  .el-table {
    margin-top: 15px;
  }

  .el-pagination {
    margin-top: 5px;
  }



  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 143px;
    height: 143px;
    display: block;
  }
</style>