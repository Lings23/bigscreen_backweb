<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="crud.query.systemName" clearable placeholder="系统名称" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input-number v-model="crud.query.riskScore" placeholder="风险评分" style="width: 150px;" class="filter-item" :min="0" :max="100" :precision="1" />
        <el-date-picker
          v-model="crud.query.scoreDate"
          type="date"
          placeholder="选择评分日期"
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
    <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
        <el-form-item label="系统名称" prop="systemName">
          <el-input v-model="form.systemName" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="风险评分" prop="riskScore">
          <el-input-number v-model="form.riskScore" :min="0" :max="100" :precision="1" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="评分日期" prop="scoreDate">
          <el-date-picker
            v-model="form.scoreDate"
            type="date"
            style="width: 370px;"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
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
      <el-table-column prop="riskScore" label="风险评分" width="120">
        <template slot-scope="scope">
          <el-tag :type="getRiskScoreType(scope.row.riskScore)">{{ scope.row.riskScore }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="scoreDate" label="评分日期" width="120" />
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
      <el-table-column v-if="checkPer(['admin','risk:edit','risk:del'])" label="操作" width="150px" align="center">
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
import crudRisk from '@/api/stat/risk'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { parseTime } from '@/utils/index'

const defaultForm = { 
  id: null,
  systemName: null,
  riskScore: 0,
  scoreDate: new Date().toISOString().split('T')[0]
}

export default {
  name: 'RiskScore',
  components: { pagination, crudOperation, rrOperation, udOperation },
  cruds() {
    return CRUD({ 
      title: '系统风险评分',
      url: 'api/stat/risk',
      sort: ['scoreDate,desc'],
      crudMethod: { ...crudRisk },
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
        add: ['admin', 'risk:add'],
        edit: ['admin', 'risk:edit'],
        del: ['admin', 'risk:del']
      },
      rules: {
        systemName: [
          { required: true, message: '请输入系统名称', trigger: 'blur' }
        ],
        riskScore: [
          { required: true, message: '请输入风险评分', trigger: 'blur' },
          { type: 'number', message: '评分必须为数字', trigger: 'blur' }
        ],
        scoreDate: [
          { required: true, message: '请选择评分日期', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    // 初始化查询参数
    this.crud.query = {
      systemName: null,
      riskScore: null,
      scoreDate: null
    }
  },
  methods: {
    // 获取风险评分对应的标签类型
    getRiskScoreType(score) {
      if (score >= 80) return 'danger';
      if (score >= 60) return 'warning';
      if (score >= 40) return 'info';
      return 'success';
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