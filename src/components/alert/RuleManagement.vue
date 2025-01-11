<template>
  <el-dialog
    v-model="visible"
    title="预警规则管理"
    width="900px"
    :close-on-click-modal="false"
  >
    <div class="rule-management">
      <!-- 工具栏 -->
      <div class="toolbar">
        <el-button type="primary" @click="handleAddRule">
          <el-icon><Plus /></el-icon>
          新增规则
        </el-button>
        <el-button @click="handleRefresh">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>

      <!-- 规则列表 -->
      <el-table
        v-loading="loading"
        :data="ruleList"
        border
        stripe
      >
        <el-table-column type="expand">
          <template #default="{ row }">
            <el-form label-position="left" inline class="rule-detail">
              <el-form-item label="触发条件">
                <div v-for="(condition, index) in row.conditions" :key="index">
                  {{ condition.field }} {{ condition.operator }} {{ condition.value }}
                  {{ condition.unit }}
                </div>
              </el-form-item>
              <el-form-item label="触发动作">
                <div v-for="(action, index) in row.actions" :key="index">
                  {{ getActionTypeLabel(action.type) }}:
                  {{ formatActionConfig(action.config) }}
                </div>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column prop="name" label="规则名称" min-width="150" />
        
        <el-table-column prop="type" label="预警类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getAlertTypeTag(row.type)">
              {{ getAlertTypeLabel(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="level" label="预警级别" width="100">
          <template #default="{ row }">
            <el-tag :type="getAlertLevelTag(row.level)">
              {{ getAlertLevelLabel(row.level) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="enabled" label="状态" width="100">
          <template #default="{ row }">
            <el-switch
              v-model="row.enabled"
              :loading="row.updating"
              @change="() => handleStatusChange(row)"
            />
          </template>
        </el-table-column>
        
        <el-table-column prop="createTime" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatTime(row.createTime) }}
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button 
                type="primary" 
                size="small"
                @click="handleEditRule(row)"
              >
                编辑
              </el-button>
              <el-button 
                type="danger" 
                size="small"
                @click="handleDeleteRule(row)"
              >
                删除
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="showEditDialog"
      :title="ruleForm.id ? '编辑规则' : '新增规则'"
      width="600px"
      append-to-body
    >
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="ruleFormRules"
        label-width="100px"
      >
        <el-form-item label="规则名称" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        
        <el-form-item label="预警类型" prop="type">
          <el-select v-model="ruleForm.type" class="w-full">
            <el-option label="设备故障" value="device_error" />
            <el-option label="超时预警" value="timeout" />
            <el-option label="异常行为" value="abnormal" />
            <el-option label="安全风险" value="risk" />
            <el-option label="环境预警" value="environment" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="预警级别" prop="level">
          <el-select v-model="ruleForm.level" class="w-full">
            <el-option label="低" value="low" />
            <el-option label="中" value="medium" />
            <el-option label="高" value="high" />
            <el-option label="紧急" value="critical" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="触发条件">
          <div 
            v-for="(condition, index) in ruleForm.conditions" 
            :key="index"
            class="condition-item"
          >
            <el-input
              v-model="condition.field"
              placeholder="字段"
              class="mr-2"
            />
            <el-select
              v-model="condition.operator"
              class="mr-2"
            >
              <el-option label="大于" value=">" />
              <el-option label="小于" value="<" />
              <el-option label="等于" value="=" />
              <el-option label="大于等于" value=">=" />
              <el-option label="小于等于" value="<=" />
              <el-option label="不等于" value="!=" />
            </el-select>
            <el-input
              v-model="condition.value"
              placeholder="值"
              class="mr-2"
            />
            <el-input
              v-model="condition.unit"
              placeholder="单位"
              class="mr-2"
            />
            <el-button
              type="danger"
              circle
              @click="removeCondition(index)"
            >
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
          <el-button
            type="primary"
            plain
            @click="addCondition"
          >
            添加条件
          </el-button>
        </el-form-item>
        
        <el-form-item label="触发动作">
          <div 
            v-for="(action, index) in ruleForm.actions" 
            :key="index"
            class="action-item"
          >
            <el-select
              v-model="action.type"
              class="mr-2"
            >
              <el-option label="通知" value="notification" />
              <el-option label="Webhook" value="webhook" />
              <el-option label="自动化" value="automation" />
            </el-select>
            
            <template v-if="action.type === 'notification'">
              <el-select
                v-model="action.config.channels"
                multiple
                class="mr-2"
                placeholder="选择通知方式"
              >
                <el-option label="短信" value="sms" />
                <el-option label="邮件" value="email" />
                <el-option label="微信" value="wechat" />
              </el-select>
            </template>
            
            <template v-else-if="action.type === 'webhook'">
              <el-input
                v-model="action.config.url"
                placeholder="Webhook URL"
                class="mr-2"
              />
            </template>
            
            <el-button
              type="danger"
              circle
              @click="removeAction(index)"
            >
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
          <el-button
            type="primary"
            plain
            @click="addAction"
          >
            添加动作
          </el-button>
        </el-form-item>
        
        <el-form-item label="启用状态">
          <el-switch v-model="ruleForm.enabled" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showEditDialog = false">取消</el-button>
        <el-button
          type="primary"
          :loading="submitting"
          @click="submitForm"
        >
          确定
        </el-button>
      </template>
    </el-dialog>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { Plus, Refresh, Delete } from '@element-plus/icons-vue'
import type { 
  AlertRule, 
  AlertType, 
  AlertLevel,
  RuleCondition,
  RuleAction 
} from '@/types/alert'
import { 
  fetchAlertRules, 
  saveAlertRule, 
  deleteAlertRule,
  updateRuleStatus
} from '@/api/alert'
import {
  getAlertTypeLabel,
  getAlertTypeTag,
  getAlertLevelLabel,
  getAlertLevelTag
} from '@/utils/alert'
import dayjs from 'dayjs'

// Props & Emits
const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

// 计算属性
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 状态定义
const loading = ref(false)
const submitting = ref(false)
const ruleList = ref<AlertRule[]>([])
const showEditDialog = ref(false)
const ruleFormRef = ref<FormInstance>()

// 表单数据
interface RuleForm {
  id?: number
  name: string
  type: AlertType
  level: AlertLevel
  conditions: RuleCondition[]
  actions: RuleAction[]
  enabled: boolean
}

const ruleForm = reactive<RuleForm>({
  name: '',
  type: 'device_error',
  level: 'medium',
  conditions: [],
  actions: [],
  enabled: true
})

// 表单校验规则
const ruleFormRules = {
  name: [
    { required: true, message: '请输入规则名称', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择预警类型', trigger: 'change' }
  ],
  level: [
    { required: true, message: '请选择预警级别', trigger: 'change' }
  ]
}

// 获取规则列表
const getRuleList = async () => {
  loading.value = true
  try {
    ruleList.value = await fetchAlertRules()
  } catch (error) {
    console.error('获取规则列表失败:', error)
    ElMessage.error('获取规则列表失败')
  } finally {
    loading.value = false
  }
}

// 添加规则
const handleAddRule = () => {
  ruleForm.id = undefined
  ruleForm.name = ''
  ruleForm.type = 'device_error'
  ruleForm.level = 'medium'
  ruleForm.conditions = [{
    field: '',
    operator: '>',
    value: null,
    unit: ''
  }]
  ruleForm.actions = [{
    type: 'notification',
    config: {
      channels: []
    }
  }]
  ruleForm.enabled = true
  showEditDialog.value = true
}

// 编辑规则
const handleEditRule = (rule: AlertRule) => {
  ruleForm.id = rule.id
  ruleForm.name = rule.name
  ruleForm.type = rule.type
  ruleForm.level = rule.level
  ruleForm.conditions = rule.conditions.map(c => ({ ...c }))
  ruleForm.actions = rule.actions.map(a => ({ ...a }))
  ruleForm.enabled = rule.enabled
  showEditDialog.value = true
}

// 删除规则
const handleDeleteRule = async (rule: AlertRule) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除规则"${rule.name}"吗？此操作不可恢复！`, 
      '删除确认', 
      {
        type: 'warning',
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        confirmButtonClass: 'el-button--danger'
      }
    )
    
    await deleteAlertRule(rule.id)
    ElMessage.success('删除成功')
    getRuleList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除规则失败:', error)
      ElMessage.error('删除规则失败')
    }
  }
}

// 刷新列表
const handleRefresh = () => {
  getRuleList()
}

// 状态切换
const handleStatusChange = async (rule: AlertRule) => {
  try {
    rule.updating = true
    await updateRuleStatus(rule.id, !rule.enabled)
    ElMessage.success('更新成功')
  } catch (error) {
    console.error('更新状态失败:', error)
    ElMessage.error('更新状态失败')
    rule.enabled = !rule.enabled
  } finally {
    rule.updating = false
  }
}

// 添加条件
const addCondition = () => {
  ruleForm.conditions.push({
    field: '',
    operator: '>',
    value: null,
    unit: ''
  })
}

// 删除条件
const removeCondition = (index: number) => {
  ruleForm.conditions.splice(index, 1)
}

// 添加动作
const addAction = () => {
  ruleForm.actions.push({
    type: 'notification',
    config: {
      channels: []
    }
  })
}

// 删除动作
const removeAction = (index: number) => {
  ruleForm.actions.splice(index, 1)
}

// 提交表单
const submitForm = async () => {
  if (!ruleFormRef.value) return
  
  try {
    await ruleFormRef.value.validate()
    submitting.value = true
    
    const ruleData: Partial<AlertRule> = {
      id: ruleForm.id,
      name: ruleForm.name,
      type: ruleForm.type,
      level: ruleForm.level,
      conditions: ruleForm.conditions.map(condition => ({
        field: condition.field,
        operator: condition.operator,
        value: condition.value,
        unit: condition.unit
      })),
      actions: ruleForm.actions.map(action => ({
        type: action.type,
        config: { ...action.config }
      })),
      enabled: ruleForm.enabled
    }
    
    await saveAlertRule(ruleData)
    ElMessage.success('保存成功')
    showEditDialog.value = false
    getRuleList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('保存规则失败:', error)
      ElMessage.error('保存规则失败')
    }
  } finally {
    submitting.value = false
  }
}

// 获取动作类型标签
const getActionTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    notification: '通知',
    webhook: 'Webhook',
    automation: '自动化'
  }
  return labels[type] || type
}

// 格式化动作配置
const formatActionConfig = (config: any): string => {
  if (!config) return ''
  
  if (config.channels) {
    const channelLabels: Record<string, string> = {
      sms: '短信',
      email: '邮件',
      wechat: '微信'
    }
    return config.channels.map((c: string) => channelLabels[c] || c).join('、')
  }
  
  if (config.url) {
    return `URL: ${config.url}`
  }
  
  return JSON.stringify(config)
}

// 格式化时间
const formatTime = (time: string) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

// 初始化
onMounted(() => {
  getRuleList()
})

defineExpose({
  getRuleList
})
</script>

<style scoped lang="scss">
.rule-management {
  .toolbar {
    margin-bottom: 16px;
  }
  
  .rule-detail {
    padding: 16px;
  }
  
  .condition-item,
  .action-item {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }
}

.w-full {
  width: 100%;
}

.mr-2 {
  margin-right: 8px;
}

.mt-2 {
  margin-top: 8px;
}
</style> 