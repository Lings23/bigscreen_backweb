<template>
  <div class="app-container">
    <!-- 工具栏 -->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <date-range-picker
          v-model="crud.query.statisticTimeRange"
          class="date-item"
          placeholder="选择统计时间范围"
        />
        <el-select
          v-model="crud.query.status"
          placeholder="选择状态"
          class="filter-item"
          clearable
        >
          <el-option :value="0" label="未发布" />
          <el-option :value="1" label="已发布" />
        </el-select>
        <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="crud.toQuery">搜索</el-button>
        <el-button class="filter-item" size="mini" type="warning" icon="el-icon-refresh-left" @click="crud.resetQuery()">重置</el-button>
      </div>
      <crudOperation :permission="permission" :crud="crud" />
    </div>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu > 0"
      :title="crud.status.title"
      width="600px"
    >
      <!-- 核心修正：表单绑定form变量（由form混入提供） -->
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        size="small"
        label-width="160px"
      >
        <el-form-item v-if="crud.status.cu === 2" label="ID" prop="id">
          <el-input v-model="form.id" style="width: 400px;" disabled />
        </el-form-item>

        <el-form-item label="统计时间（季度末）" prop="statisticTime">
          <el-date-picker
            v-model="form.statisticTime"
            type="date"
            style="width: 400px;"
            value-format="yyyy-MM-dd"
            placeholder="例如：2025-03-31（第一季度末）"
          />
        </el-form-item>

        <el-form-item label="信息安全检索数量" prop="searchCount">
          <el-input v-model="form.searchCount" style="width: 400px;" type="number" min="0" />
        </el-form-item>

        <el-form-item label="信息安全培训数量" prop="trainingCount">
          <el-input v-model="form.trainingCount" style="width: 400px;" type="number" min="0" />
        </el-form-item>

        <el-form-item label="信息系统建设整改数量" prop="rectificationCount">
          <el-input v-model="form.rectificationCount" style="width: 400px;" type="number" min="0" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">未发布</el-radio>
            <el-radio :label="1">已发布</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="crud.status.cu === 2" label="创建时间" prop="createTime">
          <el-date-picker
            v-model="form.createTime"
            type="datetime"
            style="width: 400px;"
            value-format="yyyy-MM-dd HH:mm:ss"
            disabled
          />
        </el-form-item>
        <el-form-item v-if="crud.status.cu === 2" label="更新时间" prop="updateTime">
          <el-date-picker
            v-model="form.updateTime"
            type="datetime"
            style="width: 400px;"
            value-format="yyyy-MM-dd HH:mm:ss"
            disabled
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button :loading="crud.status.loading" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>

    <!-- 表格 -->
    <el-table
      ref="table"
      v-loading="crud.loading"
      :data="crud.data"
      highlight-current-row
      stripe
      style="width: 100%"
      @selection-change="crud.selectionChangeHandler"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="ID" width="80px" />
      <el-table-column prop="statisticTime" label="统计时间" width="120">
        <template slot-scope="scope">{{ parseTime(scope.row.statisticTime, '{y}-{m}-{d}') }}</template>
      </el-table-column>
      <el-table-column prop="searchCount" label="信息安全检索数量" />
      <el-table-column prop="trainingCount" label="信息安全培训数量" />
      <el-table-column prop="rectificationCount" label="整改数量" />
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'info'">
            {{ scope.row.status === 1 ? '已发布' : '未发布' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180">
        <template slot-scope="scope">{{ parseTime(scope.row.createTime) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <udOperation :data="scope.row" :permission="permission" :crud="crud" />
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
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
import quarterlyReportApi from '@/api/stat/quarterlyReport'

// 核心修正：定义表单默认值（通过form混入注入到this.form）
const defaultForm = {
  id: null,
  statisticTime: null,
  searchCount: 0,
  trainingCount: 0,
  rectificationCount: 0,
  status: 0, // 默认未发布
  createTime: null,
  updateTime: null
}

export default {
  name: 'QuarterlyReport',
  components: { pagination, crudOperation, udOperation, DateRangePicker },
  // 核心修正：通过cruds()方法配置CRUD逻辑
  cruds() {
    return CRUD({
      title: '安全季报管理',
      crudMethod: {
        query: quarterlyReportApi.getPage,
        get: quarterlyReportApi.getById,
        add: quarterlyReportApi.add,
        update: quarterlyReportApi.update,
        delete: quarterlyReportApi.delete,
        batchDelete: quarterlyReportApi.batchDelete
      },
      page: {
        pageNum: 1,
        pageSize: 10
      },
      sort: ['statisticTime,desc'],
      optShow: {
        add: true,
        edit: true,
        del: true
      }
    })
  },
  // 核心修正：混入form(defaultForm)，自动生成this.form变量
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
      permission: {
        add: ['admin', 'quarterlyReport:add'],
        edit: ['admin', 'quarterlyReport:edit'],
        del: ['admin', 'quarterlyReport:del']
      },
      rules: {
        statisticTime: [
          { required: true, message: '请选择统计时间', trigger: 'change' }
        ],
        searchCount: [
          { required: true, message: '请输入检索数量', trigger: 'blur' },
          { type: 'number', min: 0, message: '数量不能为负数', trigger: 'blur' }
        ],
        trainingCount: [
          { required: true, message: '请输入培训数量', trigger: 'blur' },
          { type: 'number', min: 0, message: '数量不能为负数', trigger: 'blur' }
        ],
        rectificationCount: [
          { required: true, message: '请输入整改数量', trigger: 'blur' },
          { type: 'number', min: 0, message: '数量不能为负数', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.crud.query = {
      statisticTimeRange: null,
      status: null
    }
  },
  methods: {
    parseTime
  }
}
</script>
