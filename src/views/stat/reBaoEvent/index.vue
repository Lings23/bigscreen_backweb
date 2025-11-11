<template>
  <div class="app-container">
    <!-- 工具栏 -->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索：字段对齐后端 participatingUnits -->
        <el-input v-model="crud.query.eventName" clearable placeholder="事件名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="crud.query.participatingUnits" clearable placeholder="参与单位" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <date-range-picker v-model="crud.query.timeRange" class="date-item" />
        <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="crud.toQuery">搜索</el-button>
        <el-button class="filter-item" size="mini" type="warning" icon="el-icon-refresh-left" @click="crud.resetQuery()">重置</el-button>
      </div>
      <crudOperation :permission="permission" :crud="crud" />
    </div>
    <!-- 表单组件：字段对齐后端 participatingUnits -->
    <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="600px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
        <el-form-item label="事件名称" prop="eventName">
          <el-input v-model="form.eventName" style="width: 450px;" />
        </el-form-item>
        <el-form-item label="参与单位" prop="participatingUnits">
          <el-input v-model="form.participatingUnits" style="width: 450px;" placeholder="多个单位用逗号分隔" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="form.startTime"
            type="datetime"
            style="width: 450px;"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择开始时间"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="form.endTime"
            type="datetime"
            style="width: 450px;"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择结束时间"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>
    <!-- 表格渲染：字段对齐后端 participatingUnits -->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" highlight-current-row stripe style="width: 100%" @selection-change="crud.selectionChangeHandler">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="ID" width="80px" />
      <el-table-column prop="eventName" label="事件名称" />
      <el-table-column prop="participatingUnits" label="参与单位" show-overflow-tooltip />
      <el-table-column prop="startTime" label="开始时间" width="180">
        <template slot-scope="scope">
          {{ parseTime(scope.row.startTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="endTime" label="结束时间" width="180">
        <template slot-scope="scope">
          {{ parseTime(scope.row.endTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="180">
        <template slot-scope="scope">
          {{ parseTime(scope.row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column v-if="checkPer(['admin','reinsuranceEvent:edit','reinsuranceEvent:del'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <udOperation
            :data="scope.row"
            :permission="permission"
            :crud="crud"
          />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination :crud="crud" />
  </div>
</template>

<script>
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import DateRangePicker from '@/components/DateRangePicker'
import { parseTime } from '@/utils/index'
// 导入真实后端接口（需先创建reBaoEvent.js文件）
import reBaoEventApi from '@/api/stat/reBaoEvent'
// 真实表单字段（与后端ReBaoEvent实体类完全对齐）
const defaultForm = {
  id: null,
  eventName: null,
  participatingUnits: null, // 对齐后端字段名称
  startTime: null,
  endTime: null
}

export default {
  name: 'ReBaoEvent',
  components: { pagination, crudOperation, udOperation, DateRangePicker },
  cruds() {
    return CRUD({
      title: '重保事件',
      url: 'api/stat/reBaoEvent', // 与后端Controller路径完全一致
      sort: ['startTime,desc'],
      crudMethod: { ...reBaoEventApi }, // 替换为真实API调用
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
        add: ['admin', 'reBaoEvent:add'],
        edit: ['admin', 'reBaoEvent:edit'],
        del: ['admin', 'reBaoEvent:del']
      },
      rules: {
        eventName: [
          { required: true, message: '请输入事件名称', trigger: 'blur' }
        ],
        participatingUnits: [ // 校验规则字段对齐
          { required: true, message: '请输入参与单位', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '请选择开始时间', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '请选择结束时间', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    // 初始化查询参数（字段对齐后端）
    this.crud.query = {
      eventName: null,
      participatingUnits: null, // 替换原organization
      timeRange: null
    }
  },
  methods: {
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
