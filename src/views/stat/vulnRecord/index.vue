<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="crud.query.systemName" clearable placeholder="系统名称" style="width: 150px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="crud.query.orgName" clearable placeholder="组织名称" style="width: 150px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="crud.query.vulnSource" clearable placeholder="漏洞来源" style="width: 150px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="crud.query.vulnType" clearable placeholder="漏洞类型" style="width: 150px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-select v-model="crud.query.vulnLevel" clearable placeholder="漏洞等级" style="width: 120px;" class="filter-item">
          <el-option label="高" value="高" />
          <el-option label="中" value="中" />
          <el-option label="低" value="低" />
        </el-select>
        <el-date-picker
          v-model="crud.query.foundTime"
          type="date"
          placeholder="选择发现日期"
          value-format="yyyy-MM-dd"
          style="width: 200px;"
          class="filter-item"
        />
        <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="crud.toQuery">搜索</el-button>
        <el-button class="filter-item" size="mini" type="warning" icon="el-icon-refresh-left" @click="crud.resetQuery()">重置</el-button>
      </div>
      <crudOperation :permission="permission" :crud="crud" />
    </div>
    
    <!--表单组件-->
    <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="600px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
        <el-form-item label="系统名称" prop="systemName">
          <el-input v-model="form.systemName" style="width: 450px;" />
        </el-form-item>
        <el-form-item label="组织名称" prop="orgName">
          <el-input v-model="form.orgName" style="width: 450px;" />
        </el-form-item>
        <el-form-item label="漏洞来源" prop="vulnSource">
          <el-input v-model="form.vulnSource" style="width: 450px;" />
        </el-form-item>
        <el-form-item label="漏洞类型" prop="vulnType">
          <el-input v-model="form.vulnType" style="width: 450px;" />
        </el-form-item>
        <el-form-item label="漏洞等级" prop="vulnLevel">
          <el-select v-model="form.vulnLevel" style="width: 450px;">
            <el-option label="高" value="高" />
            <el-option label="中" value="中" />
            <el-option label="低" value="低" />
          </el-select>
        </el-form-item>
        <el-form-item label="发现时间" prop="foundTime">
          <el-date-picker
            v-model="form.foundTime"
            type="datetime"
            style="width: 450px;"
            value-format="yyyy-MM-ddTHH:mm:ss"
            placeholder="选择日期时间"
          />
        </el-form-item>
        <el-form-item label="修复内容" prop="fixContent">
          <el-input v-model="form.fixContent" type="textarea" :rows="3" style="width: 450px;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" highlight-current-row stripe style="width: 100%" @selection-change="crud.selectionChangeHandler">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="ID" width="80px" />
      <el-table-column prop="systemName" label="系统名称" />
      <el-table-column prop="orgName" label="组织名称" />
      <el-table-column prop="vulnSource" label="漏洞来源" />
      <el-table-column prop="vulnType" label="漏洞类型" />
      <el-table-column prop="vulnLevel" label="漏洞等级" width="100">
        <template slot-scope="scope">
          <el-tag :type="getVulnLevelType(scope.row.vulnLevel)">{{ scope.row.vulnLevel }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="foundTime" label="发现时间" width="180">
        <template slot-scope="scope">
          {{ parseTime(scope.row.foundTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="fixContent" label="修复内容" show-overflow-tooltip />
      <el-table-column prop="createdAt" label="创建时间" width="180">
        <template slot-scope="scope">
          {{ parseTime(scope.row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column prop="updatedAt" label="更新时间" width="180">
        <template slot-scope="scope">
          {{ parseTime(scope.row.updatedAt) }}
        </template>
      </el-table-column>
      <el-table-column v-if="checkPer(['admin','vulnRecord:edit','vulnRecord:del'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <udOperation
            :data="scope.row"
            :permission="permission"
            :crud="crud"
          />
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination :crud="crud" />
  </div>
</template>

<script>
import crudVulnRecord from '@/api/stat/vulnRecord'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { parseTime } from '@/utils/index'

const defaultForm = { 
  id: null,
  systemName: null,
  orgName: null,
  vulnSource: null,
  vulnType: null,
  vulnLevel: '中',
  foundTime: new Date().toISOString().split('.')[0],
  fixContent: null
}

export default {
  name: 'VulnRecord',
  components: { pagination, crudOperation, rrOperation, udOperation },
  cruds() {
    return CRUD({ 
      title: '漏洞记录',
      url: 'api/stat/vuln-record',
      sort: ['foundTime,desc'],
      crudMethod: { ...crudVulnRecord },
      optShow: {
        add: true,
        edit: true,
        del: true,
        download: false
      }
    })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
      permission: {
        add: ['admin', 'vulnRecord:add'],
        edit: ['admin', 'vulnRecord:edit'],
        del: ['admin', 'vulnRecord:del']
      },
      rules: {
        systemName: [
          { required: true, message: '请输入系统名称', trigger: 'blur' }
        ],
        orgName: [
          { required: true, message: '请输入组织名称', trigger: 'blur' }
        ],
        vulnSource: [
          { required: true, message: '请输入漏洞来源', trigger: 'blur' }
        ],
        vulnType: [
          { required: true, message: '请输入漏洞类型', trigger: 'blur' }
        ],
        vulnLevel: [
          { required: true, message: '请选择漏洞等级', trigger: 'change' }
        ],
        foundTime: [
          { required: true, message: '请选择发现时间', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    // 初始化查询参数
    this.crud.query = {
      systemName: null,
      orgName: null,
      vulnSource: null,
      vulnType: null,
      vulnLevel: null,
      foundTime: null
    }
  },
  methods: {
    // 获取漏洞等级对应的标签类型
    getVulnLevelType(level) {
      const types = {
        '高': 'danger',
        '中': 'warning',
        '低': 'info'
      };
      return types[level] || 'info';
    },
    // 权限检查
    checkPer(permissions) {
      if (permissions && permissions instanceof Array && permissions.length > 0) {
        const roles = this.$store.getters && this.$store.getters.roles
        const permissionRoles = permissions
        return roles.some(role => {
          return permissionRoles.includes(role)
        })
      } else {
        return false
      }
    },
    // 格式化时间
    parseTime
  }
}
</script>

<style scoped>
.date-item {
  display: inline-block;
  margin-right: 8px;
}
</style> 