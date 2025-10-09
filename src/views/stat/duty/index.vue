<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="crud.query.orgName" clearable placeholder="组织名称" style="width: 150px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="crud.query.leaderName" clearable placeholder="负责人" style="width: 150px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="crud.query.dutyPerson" clearable placeholder="值班人员" style="width: 150px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="crud.query.eventName" clearable placeholder="事件名称" style="width: 150px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-date-picker
          v-model="crud.query.dutyDate"
          type="date"
          placeholder="选择值班日期"
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
        <el-form-item label="组织名称" prop="orgName">
          <el-input v-model="form.orgName" style="width: 450px;" />
        </el-form-item>
        <el-form-item label="负责人" prop="leaderName">
          <el-input v-model="form.leaderName" style="width: 450px;" />
        </el-form-item>
        <el-form-item label="负责人电话" prop="leaderPhone">
          <el-input v-model="form.leaderPhone" style="width: 450px;" />
        </el-form-item>
        <el-form-item label="值班人员" prop="dutyPerson">
          <el-input v-model="form.dutyPerson" type="textarea" :rows="2" style="width: 450px;" placeholder="多个人员用逗号分隔" />
        </el-form-item>
        <el-form-item label="值班电话" prop="dutyPhone">
          <el-input v-model="form.dutyPhone" type="textarea" :rows="2" style="width: 450px;" placeholder="多个电话用逗号分隔" />
        </el-form-item>
        <el-form-item label="值班日期" prop="dutyDate">
          <el-date-picker
            v-model="form.dutyDate"
            type="date"
            style="width: 450px;"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="事件名称" prop="eventName">
          <el-input v-model="form.eventName" style="width: 450px;" />
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
      <el-table-column prop="orgName" label="组织名称" width="120" />
      <el-table-column prop="leaderName" label="负责人" width="100" />
      <el-table-column prop="leaderPhone" label="负责人电话" width="130" />
      <el-table-column prop="dutyPerson" label="值班人员" show-overflow-tooltip />
      <el-table-column prop="dutyPhone" label="值班电话" show-overflow-tooltip />
      <el-table-column prop="dutyDate" label="值班日期" width="120" />
      <el-table-column prop="eventName" label="事件名称" show-overflow-tooltip />
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
      <el-table-column v-if="checkPer(['admin','duty:edit','duty:del'])" label="操作" width="150px" align="center">
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
import crudDuty from '@/api/stat/duty'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { parseTime } from '@/utils/index'

const defaultForm = { 
  id: null,
  orgName: null,
  leaderName: null,
  leaderPhone: null,
  dutyPerson: null,
  dutyPhone: null,
  dutyDate: new Date().toISOString().split('T')[0],
  eventName: null
}

export default {
  name: 'DutySchedule',
  components: { pagination, crudOperation, rrOperation, udOperation },
  cruds() {
    return CRUD({ 
      title: '值班排班',
      url: 'api/stat/duty',
      sort: ['dutyDate,desc'],
      crudMethod: { ...crudDuty },
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
        add: ['admin', 'duty:add'],
        edit: ['admin', 'duty:edit'],
        del: ['admin', 'duty:del']
      },
      rules: {
        orgName: [
          { required: true, message: '请输入组织名称', trigger: 'blur' }
        ],
        leaderName: [
          { required: true, message: '请输入负责人', trigger: 'blur' }
        ],
        leaderPhone: [
          { required: true, message: '请输入负责人电话', trigger: 'blur' }
        ],
        dutyPerson: [
          { required: true, message: '请输入值班人员', trigger: 'blur' }
        ],
        dutyPhone: [
          { required: true, message: '请输入值班电话', trigger: 'blur' }
        ],
        dutyDate: [
          { required: true, message: '请选择值班日期', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    // 初始化查询参数
    this.crud.query = {
      orgName: null,
      leaderName: null,
      dutyPerson: null,
      dutyDate: null,
      eventName: null
    }
  },
  methods: {
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