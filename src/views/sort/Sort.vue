<template>
  <div class="">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>分类管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类列表</el-breadcrumb-item>

    </el-breadcrumb>
    
    <el-card :body-style="{ padding: '0px' }">

      <el-row>
      <el-col :span="12">
        <el-button type="primary" @click="showAddDialog">添加分类</el-button>        
      </el-col>
        <el-col :span="12"></el-col>
      </el-row>

      <el-divider>不允许删除1级分类</el-divider>
      <!-- 切换的标签页 -->
      <el-tabs v-model="tabActiveName"
        type="card">
        <el-tab-pane label="分类列表" name="first">
          <el-table :data="sortList" border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="sortName" label="分类名"></el-table-column>
            <el-table-column label="分类级别">
              <template slot-scope="scope">
                <el-tag type="danger" v-if="scope.row.sortLevel == 1">一级分类</el-tag>
                <el-tag type="warning" v-else-if="scope.row.sortLevel == 2">二级分类</el-tag>
                <el-tag type="success" v-else-if="scope.row.sortLevel == 3">三级分类</el-tag>
              
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="warning" @click="showEditDialog(scope.row.sortId)" size="mini">修改</el-button>
                <el-button type="danger" @click="deleteSort(scope.row.sortId)" size="mini"
                  :disabled="scope.row.sortLevel == 1">删除</el-button>                
              </template>
            </el-table-column>
              
          </el-table>

          
        </el-tab-pane>
        <el-tab-pane label="树形展示" name="second">

          <el-row :class="['bdbottom', idx1 == 0 ? '' : 'bdtop', 'vertical-center']" 
            v-for="(first, idx1) in sortTree" :key="first.sortId">
            <el-col :span="5">
              <el-tag type="danger">{{ first.sortName }}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <el-col :span="17">
              <!-- 二级菜单 -->
              <el-row :class="['vertical-center']" v-for="(second, idx2) in first.children" :key="second.sortId">
                <el-col :span="8">
                  <el-tag type="warning">{{ second.sortName }}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="12">
                  <el-tag v-for="(third) in second.children" :key="third.sortId" 
                    type="success">{{ third.sortName }}</el-tag>
                  
                </el-col>
                
              </el-row>
              
            </el-col>
            
          </el-row>
            
        </el-tab-pane>
        
        
      </el-tabs>
      
    </el-card>


    <!-- 添加 -->
  <el-dialog title="" :visible.sync="addVisiable" width="50%"
    @close="clearSelectKeys">
    <el-form :model="addForm" ref="addFormRef" label-width="100px" style="width: 80%;">
      <el-form-item label="分类名">
        <el-input v-model="addForm.sortName"></el-input>
      </el-form-item>
      <el-form-item label="父级分类名">
        <el-cascader :options="sortTree" :props="cascaderProp"
          v-model="selectedKeys" @change="handleAddChange">
        </el-cascader>
        
      </el-form-item>
    </el-form>
    

    <span slot="footer">
      <el-button @click="addVisiable = false">取 消</el-button>
      <el-button type="primary" @click="addSort">确 定</el-button>
    </span>
  </el-dialog>
  
    <!-- 修改 -->
  <el-dialog title="" :visible.sync="editVisiable" width="50%"
    @close="clearSelectKeys">
    <el-form :model="editForm" ref="editFormRef" label-width="80px">
      <el-form-item label="分类名">
        <el-input v-model="editForm.sortName"></el-input>
      </el-form-item>
      <el-form-item label="父级分类">
        <el-cascader :options="sortTree" v-model="selectedKeys" :props="cascaderProp"
          @change="handleChange" clearable>
        </el-cascader>
        
      </el-form-item>
    </el-form>
    
    <span slot="footer">
      <el-button @click="editVisiable = false">取 消</el-button>
      <el-button type="primary" @click="updateSort">确 定</el-button>
    </span>
  </el-dialog>
    
  </div>


</template>

<script>
export default {
  name: '',
  data() {
    return {
      tabActiveName: 'first',
      sortList: [],
      editVisiable: false,
      editForm: {},
      //级联选择器
      sortTree: [],
      selectedKeys: [],
      cascaderProp: {
        expandTrigger: 'hover',
        label: 'sortName',
        value: 'sortId',
        checkStrictly: true
      },
      addVisiable: false,
      addForm: {}
    }
  },
  created() {
    this.getSortList()
    this.getSortTree()
  },
  methods: {
    async getSortList() {
      const { data: res }
        = await this.$http.get('/sort/list')
      // console.log(res)
      if(res.code !== 200)  return this.$message.error('获取分类信息失败!')

      this.sortList = res.data 
    },
    async getSortTree() {
      const { data: res }
        = await this.$http.get('/sort/list?type=tree')
      console.log(res)
      if(res.code !== 200)  return this.$message.error('获取分类信息失败!')

      this.sortTree = res.data 
    },
    async showEditDialog(sid) {
      const { data: res }
        = await this.$http.get(`/sort/${sid}`) 
      if(res.code !== 200)  return this.$http.error('获取信息失败!')

      this.editForm = res.data 
      this.selectedKeys = [this.editForm.sortPid]
      console.log(this.selectedKeys)
      this.editVisiable = true
    },
    //处理Cascader事件
    handleChange() {
      const level = this.selectedKeys == null ? 1 : this.selectedKeys.length + 1
      this.editForm.sortPid = this.getParentId() 
      this.editForm.sortLevel = level 
      console.log(this.editForm) 
    },
    getParentId() {
      if(this.selectedKeys && this.selectedKeys.length != 0) {
        return this.selectedKeys[this.selectedKeys.length - 1] 
      }
      return 0
    },
    //修改分类
    async updateSort() {
      const { data: res }
        = await this.$http.put(`/sort/${this.editForm.sortId}`, this.editForm)
      if(res.code !== 200)  return this.$message.error('修改分类失败!')


      this.getSortList()
      this.getSortTree()
      this.clearSelectKeys()
      this.editForm = {}
      this.$message.success('修改成功!')
      this.editVisiable = false
    },
    //显示添加分类的Dialog
    showAddDialog() {
      this.addVisiable = true 
    },
    handleAddChange() {
      const level = this.selectedKeys == null ? 1 : this.selectedKeys.length + 1
      this.addForm.sortPid = this.getParentId() 
      this.addForm.sortLevel = level 
      console.log(this.addForm) 
    },
    //添加分类
    async addSort() {
      const { data: res }
        = await this.$http.post('/sort', this.addForm)
      if(res.code !== 200)  return this.$message.error('添加分类失败!')

      this.getSortList()
      this.getSortTree()
      this.clearSelectKeys()
      this.$message.success('添加成功!')
      this.addVisiable = false
    },
    clearSelectKeys() {
      this.selectedKeys = []
    },
    //删除分类
    async deleteSort(sid) {
      const rsText
        = await this.$confirm('此操作将永久删除分类,是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

      if(rsText != 'confirm') {
        return this.$message.info('取消删除')
      }

      const { data: res }
        = await this.$http.delete(`/sort/${sid}`)
      if(res.code !== 200)  return this.$message.error('删除失败!')

      this.getSortList()
      this.getSortTree()
      this.$message.success('删除成功!')
    }
  },
}
</script>

<style lang="less" scoped>
.el-card {
  padding: 20px;
}
.el-tag {
  margin: 3px 0;
}
.el-divider__text {
  color: red;
}
.bdtop {
  border: 1px solid #eee;
}
.bdbottom {
  border: 1px solid #eee;
}
.vertical-center {
  display: flex;
  align-items: center;
}
</style>