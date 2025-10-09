<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 统计时间段搜索 -->
        <el-date-picker
          v-model="crud.query.startDate"
          type="date"
          placeholder="开始日期"
          value-format="yyyy-MM-dd"
          style="width: 150px;"
          class="filter-item"
        />
        <el-date-picker
          v-model="crud.query.endDate"
          type="date"
          placeholder="结束日期"
          value-format="yyyy-MM-dd"
          style="width: 150px;"
          class="filter-item"
        />
        <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="crud.toQuery">搜索</el-button>
        <el-button class="filter-item" size="mini" type="warning" icon="el-icon-refresh-left" @click="crud.resetQuery()">重置</el-button>
      </div>
      <crudOperation :permission="permission" />
    </div>
    
    <!--表单组件-->
    <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="600px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px">
        <el-form-item label="统计时间" prop="statTime">
          <el-date-picker
            v-model="form.statTime"
            type="datetime"
            style="width: 450px;"
            value-format="yyyy-MM-ddTHH:mm:ss"
            placeholder="选择日期时间"
          />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="出站异常" prop="outbound">
              <el-input-number v-model="form.outbound" :min="0" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="外到内异常" prop="outsideToInside">
              <el-input-number v-model="form.outsideToInside" :min="0" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="横向移动" prop="lateralMove">
              <el-input-number v-model="form.lateralMove" :min="0" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="其他异常" prop="other">
              <el-input-number v-model="form.other" :min="0" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>
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
      <el-table-column prop="statTime" label="统计时间" width="180">
        <template slot-scope="scope">
          {{ parseTime(scope.row.statTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="outbound" label="出站异常" width="100">
        <template slot-scope="scope">
          <el-tag type="danger">{{ scope.row.outbound }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="outsideToInside" label="外到内异常" width="120">
        <template slot-scope="scope">
          <el-tag type="warning">{{ scope.row.outsideToInside }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="lateralMove" label="横向移动" width="100">
        <template slot-scope="scope">
          <el-tag type="info">{{ scope.row.lateralMove }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="other" label="其他异常" width="100">
        <template slot-scope="scope">
          <el-tag type="primary">{{ scope.row.other }}</el-tag>
        </template>
      </el-table-column>
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
      <el-table-column v-if="checkPer(['admin','abnormal:edit','abnormal:del'])" label="操作" width="150px" align="center">
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
import crudAbnormal from '@/api/stat/abnormal'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { parseTime } from '@/utils/index'

const defaultForm = { 
  id: null,
  statTime: new Date().toISOString().split('.')[0],
  outbound: 0,
  outsideToInside: 0,
  lateralMove: 0,
  other: 0
}

export default {
  name: 'AbnormalEventStat',
  components: { pagination, crudOperation, rrOperation, udOperation },
  cruds() {
    return CRUD({ 
      title: '异常事件统计',
      url: 'api/stat/abnormal',
      sort: ['statTime,desc'],
      crudMethod: { ...crudAbnormal },
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
        add: ['admin', 'abnormal:add'],
        edit: ['admin', 'abnormal:edit'],
        del: ['admin', 'abnormal:del']
      },
      rules: {
        statTime: [
          { required: true, message: '请选择统计时间', trigger: 'change' }
        ],
        outbound: [
          { required: true, message: '请输入出站异常数量', trigger: 'blur' },
          { type: 'number', message: '数量必须为数字', trigger: 'blur' }
        ],
        outsideToInside: [
          { required: true, message: '请输入外到内异常数量', trigger: 'blur' },
          { type: 'number', message: '数量必须为数字', trigger: 'blur' }
        ],
        lateralMove: [
          { required: true, message: '请输入横向移动数量', trigger: 'blur' },
          { type: 'number', message: '数量必须为数字', trigger: 'blur' }
        ],
        other: [
          { required: true, message: '请输入其他异常数量', trigger: 'blur' },
          { type: 'number', message: '数量必须为数字', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    // 初始化查询参数 - 仅保留日期范围搜索
    this.crud.query = {
      startDate: null,
      endDate: null
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