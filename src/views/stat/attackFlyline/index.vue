<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="crud.query.sourceIp" clearable placeholder="源IP" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="crud.query.targetIp" clearable placeholder="目标IP" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="crud.query.sourceLocationName" clearable placeholder="源位置" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="crud.query.targetLocationName" clearable placeholder="目标位置" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-select v-model="crud.query.sourceIsDomestic" clearable placeholder="来源类型" style="width: 120px;" class="filter-item">
          <el-option label="国内" :value="true" />
          <el-option label="国外" :value="false" />
        </el-select>
        <date-range-picker v-model="crud.query.attackTime" class="date-item" />
        <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="crud.toQuery">搜索</el-button>
        <el-button class="filter-item" size="mini" type="warning" icon="el-icon-refresh-left" @click="crud.resetQuery()">重置</el-button>
      </div>
      <crudOperation :permission="permission" :crud="crud" />
    </div>

    <!--表单组件-->
    <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="600px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="源IP" prop="sourceIp">
              <el-input v-model="form.sourceIp" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目标IP" prop="targetIp">
              <el-input v-model="form.targetIp" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="源位置名称" prop="sourceLocationName">
              <el-input v-model="form.sourceLocationName" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目标位置名称" prop="targetLocationName">
              <el-input v-model="form.targetLocationName" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="源经度" prop="sourceLng">
              <el-input v-model.number="form.sourceLng" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="源纬度" prop="sourceLat">
              <el-input v-model.number="form.sourceLat" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="目标经度" prop="targetLng">
              <el-input v-model.number="form.targetLng" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目标纬度" prop="targetLat">
              <el-input v-model.number="form.targetLat" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="攻击方法" prop="attackMethod">
              <el-input v-model="form.attackMethod" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目标系统" prop="targetSystem">
              <el-input v-model="form.targetSystem" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="攻击时间" prop="attackTime">
              <el-date-picker
                v-model="form.attackTime"
                type="datetime"
                style="width: 100%"
                value-format="yyyy-MM-dd'T'HH:mm:ss"
                placeholder="选择日期时间"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否国内来源" prop="sourceIsDomestic">
              <el-radio-group v-model="form.sourceIsDomestic">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
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
      <el-table-column prop="sourceIp" label="源IP" />
      <el-table-column prop="targetIp" label="目标IP" />
      <el-table-column prop="sourceLocationName" label="源位置" />
      <el-table-column prop="targetLocationName" label="目标位置" />
      <el-table-column prop="attackMethod" label="攻击方法" />
      <el-table-column prop="targetSystem" label="目标系统" />
      <el-table-column prop="attackTime" label="攻击时间" width="180">
        <template slot-scope="scope">
          {{ parseTime(scope.row.attackTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="sourceIsDomestic" label="来源类型" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.sourceIsDomestic ? 'success' : 'danger'">{{ scope.row.sourceIsDomestic ? '国内' : '国外' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPer(['admin','attackFlyline:edit','attackFlyline:del'])" label="操作" width="150px" align="center">
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
import crudAttackFlyline from '@/api/stat/attackFlyline'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import DateRangePicker from '@/components/DateRangePicker'
import { parseTime } from '@/utils/index'

const defaultForm = { 
  id: null, 
  sourceIp: null, 
  targetIp: null, 
  sourceLocationName: null, 
  sourceLng: null, 
  sourceLat: null, 
  targetLocationName: null, 
  targetLng: null, 
  targetLat: null, 
  attackMethod: null, 
  targetSystem: null, 
  attackTime: null, 
  sourceIsDomestic: true 
}

export default {
  name: 'AttackFlyline',
  components: { pagination, crudOperation, rrOperation, udOperation, DateRangePicker },
  cruds() {
    return CRUD({ title: '攻击飞线', url: 'api/stat/attack', sort: ['attackTime,desc'], crudMethod: { ...crudAttackFlyline }})
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
      permission: {
        add: ['admin', 'attackFlyline:add'],
        edit: ['admin', 'attackFlyline:edit'],
        del: ['admin', 'attackFlyline:del']
      },
      rules: {
        sourceIp: [
          { required: true, message: '请输入源IP', trigger: 'blur' }
        ],
        targetIp: [
          { required: true, message: '请输入目标IP', trigger: 'blur' }
        ],
        sourceLocationName: [
          { required: true, message: '请输入源位置名称', trigger: 'blur' }
        ],
        targetLocationName: [
          { required: true, message: '请输入目标位置名称', trigger: 'blur' }
        ],
        sourceLng: [
          { required: true, message: '请输入源经度', trigger: 'blur' },
          { type: 'number', message: '经度必须为数字', trigger: 'blur' }
        ],
        sourceLat: [
          { required: true, message: '请输入源纬度', trigger: 'blur' },
          { type: 'number', message: '纬度必须为数字', trigger: 'blur' }
        ],
        targetLng: [
          { required: true, message: '请输入目标经度', trigger: 'blur' },
          { type: 'number', message: '经度必须为数字', trigger: 'blur' }
        ],
        targetLat: [
          { required: true, message: '请输入目标纬度', trigger: 'blur' },
          { type: 'number', message: '纬度必须为数字', trigger: 'blur' }
        ],
        attackMethod: [
          { required: true, message: '请输入攻击方法', trigger: 'blur' }
        ],
        targetSystem: [
          { required: true, message: '请输入目标系统', trigger: 'blur' }
        ],
        attackTime: [
          { required: true, message: '请选择攻击时间', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    // 初始化查询参数
    this.crud.query = {
      sourceIp: null,
      targetIp: null,
      sourceLocationName: null,
      targetLocationName: null,
      sourceIsDomestic: null,
      attackTime: null
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