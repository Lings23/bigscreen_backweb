<template>
  <div class="app-container">
    <!-- 工具栏 -->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <date-range-picker
          v-model="crud.query.statDateRange"
          class="date-item"
          placeholder="选择统计日期范围"
        />
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

        <el-form-item label="恶意代码攻击数量" prop="maliciousCodeAttack">
          <el-input v-model="form.maliciousCodeAttack" style="width: 400px;" type="number" min="0" />
        </el-form-item>

        <el-form-item label="漏洞攻击数量" prop="vulnerabilityAttack">
          <el-input v-model="form.vulnerabilityAttack" style="width: 400px;" type="number" min="0" />
        </el-form-item>

        <el-form-item label="拒绝服务攻击数量（DoS）" prop="dosAttack">
          <el-input v-model="form.dosAttack" style="width: 400px;" type="number" min="0" />
        </el-form-item>

        <el-form-item label="扫描探测数量" prop="scanProbe">
          <el-input v-model="form.scanProbe" style="width: 400px;" type="number" min="0" />
        </el-form-item>

        <el-form-item label="其他类型攻击数量" prop="otherAttack">
          <el-input v-model="form.otherAttack" style="width: 400px;" type="number" min="0" />
        </el-form-item>

        <el-form-item label="统计日期" prop="statDate">
          <el-date-picker
            v-model="form.statDate"
            type="datetime"
            style="width: 400px;"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择统计日期"
          />
        </el-form-item>

        <el-form-item v-if="crud.status.cu === 2" label="创建时间" prop="createdAt">
          <el-date-picker
            v-model="form.createdAt"
            type="datetime"
            style="width: 400px;"
            value-format="yyyy-MM-dd HH:mm:ss"
            disabled
          />
        </el-form-item>
        <el-form-item v-if="crud.status.cu === 2" label="更新时间" prop="updatedAt">
          <el-date-picker
            v-model="form.updatedAt"
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
      <el-table-column prop="maliciousCodeAttack" label="恶意代码攻击数量" />
      <el-table-column prop="vulnerabilityAttack" label="漏洞攻击数量" />
      <el-table-column prop="dosAttack" label="DoS攻击数量" />
      <el-table-column prop="scanProbe" label="扫描探测数量" />
      <el-table-column prop="otherAttack" label="其他攻击数量" />
      <el-table-column prop="statDate" label="统计日期" width="180">
        <template slot-scope="scope">{{ parseTime(scope.row.statDate) }}</template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="180">
        <template slot-scope="scope">{{ parseTime(scope.row.createdAt) }}</template>
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
import attackStatsApi from '@/api/stat/attackStats'

const defaultForm = {
  id: null,
  maliciousCodeAttack: 0,
  vulnerabilityAttack: 0,
  dosAttack: 0,
  scanProbe: 0,
  otherAttack: 0,
  statDate: null,
  createdAt: null,
  updatedAt: null
}

export default {
  name: 'AttackStats',
  components: { pagination, crudOperation, udOperation, DateRangePicker },
  cruds() {
    return CRUD({
      title: '攻击统计管理',
      crudMethod: {
        query: attackStatsApi.getList,
        get: attackStatsApi.getById,
        add: attackStatsApi.add,
        update: attackStatsApi.edit,
        delete: attackStatsApi.del,
        batchDelete: attackStatsApi.batchDel
      },
      page: {
        pageNum: 1,
        pageSize: 10
      },
      sort: ['statDate,desc'],
      optShow: {
        add: true,
        edit: true,
        del: true
      }
    })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
      permission: {
        add: ['admin', 'attackStats:add'],
        edit: ['admin', 'attackStats:edit'],
        del: ['admin', 'attackStats:del']
      },
      rules: {
        maliciousCodeAttack: [
          { required: true, message: '请输入恶意代码攻击数量', trigger: 'blur' },
          { type: 'number', min: 0, message: '数量不能为负数', trigger: 'blur' }
        ],
        vulnerabilityAttack: [
          { required: true, message: '请输入漏洞攻击数量', trigger: 'blur' },
          { type: 'number', min: 0, message: '数量不能为负数', trigger: 'blur' }
        ],
        dosAttack: [
          { required: true, message: '请输入DoS攻击数量', trigger: 'blur' },
          { type: 'number', min: 0, message: '数量不能为负数', trigger: 'blur' }
        ],
        scanProbe: [
          { required: true, message: '请输入扫描探测数量', trigger: 'blur' },
          { type: 'number', min: 0, message: '数量不能为负数', trigger: 'blur' }
        ],
        otherAttack: [
          { required: true, message: '请输入其他攻击数量', trigger: 'blur' },
          { type: 'number', min: 0, message: '数量不能为负数', trigger: 'blur' }
        ],
        statDate: [
          { required: true, message: '请选择统计日期', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.crud.query = {
      statDateRange: null
    }
  },
  methods: {
    parseTime
  }
}
</script>
