<template>
  <div class="alert-rules">
    <el-card>
      <template #header>
        <div class="card-header">
          <el-button type="primary" @click="createRule">
            新建规则
          </el-button>
          <div class="header-right">
            <el-input
              v-model="searchKey"
              placeholder="搜索规则"
              style="width: 200px"
              clearable
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-button type="success" @click="exportRules">
              导出规则
            </el-button>
          </div>
        </div>
      </template>

      <!-- 规则列表 -->
      <el-table :data="filteredRules" style="width: 100%">
        <el-table-column type="expand">
          <template #default="props">
            <div class="rule-detail">
              <el-descriptions :column="2" border>
                <el-descriptions-item label="触发条件" :span="2">
                  <div class="condition-list">
                    <div 
                      v-for="(condition, index) in props.row.conditions"
                      :key="index"
                      class="condition-item"
                    >
                      <span>{{ condition.parameter }}</span>
                      <span>{{ condition.operator }}</span>
                      <span>{{ condition.value }}{{ condition.unit }}</span>
                      <span v-if="index < props.row.conditions.length - 1">
                        {{ props.row.logic }}
                      </span>
                    </div>
                  </div>
                </el-descriptions-item>
                <el-descriptions-item label="预警动作" :span="2">
                  <el-tag 
                    v-for="action in props.row.actions"
                    :key="action"
                    style="margin-right: 10px"
                  >
                    {{ action }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="通知对象">
                  {{ props.row.notifyUsers.join(', ') }}
                </el-descriptions-item>
                <el-descriptions-item label="创建时间">
                  {{ props.row.createTime }}
                </el-descriptions-item>
              </el-descriptions>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="id" label="规则编号" width="120" />
        <el-table-column prop="name" label="规则名称" width="180" />
        <el-table-column prop="type" label="规则类型" width="120" />
        <el-table-column prop="level" label="预警等级" width="100">
          <template #default="scope">
            <el-tag :type="getAlertType(scope.row.level)">
              {{ scope.row.level }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              active-text="启用"
              inactive-text="禁用"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button 
              size="small"
              @click="editRule(scope.row)"
            >
              编辑
            </el-button>
            <el-button 
              size="small"
              type="danger"
              @click="deleteRule(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 规则配置对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑规则' : '新建规则'"
      width="60%"
    >
      <el-form :model="ruleForm" label-width="100px">
        <el-form-item label="规则名称">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="规则类型">
          <el-select v-model="ruleForm.type" style="width: 100%">
            <el-option label="设备参数" value="device" />
            <el-option label="环境参数" value="environment" />
            <el-option label="工艺参数" value="process" />
          </el-select>
        </el-form-item>
        <el-form-item label="预警等级">
          <el-select v-model="ruleForm.level" style="width: 100%">
            <el-option label="一般" value="normal" />
            <el-option label="警告" value="warning" />
            <el-option label="严重" value="critical" />
          </el-select>
        </el-form-item>

        <!-- 触发条件配置 -->
        <el-form-item label="触发条件">
          <div 
            v-for="(condition, index) in ruleForm.conditions"
            :key="index"
            class="condition-config"
          >
            <el-select 
              v-model="condition.parameter"
              placeholder="参数"
              style="width: 150px"
            >
              <el-option 
                v-for="param in parameters"
                :key="param.value"
                :label="param.label"
                :value="param.value"
              />
            </el-select>
            <el-select 
              v-model="condition.operator"
              placeholder="运算符"
              style="width: 100px"
            >
              <el-option label="大于" value=">" />
              <el-option label="小于" value="<" />
              <el-option label="等于" value="=" />
              <el-option label="不等于" value="!=" />
            </el-select>
            <el-input-number 
              v-model="condition.value"
              :min="0"
              style="width: 150px"
            />
            <el-input 
              v-model="condition.unit"
              placeholder="单位"
              style="width: 80px"
            />
            <el-button 
              type="danger" 
              circle
              @click="removeCondition(index)"
            >
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
          <div class="condition-actions">
            <el-button type="primary" @click="addCondition">
              添加条件
            </el-button>
            <el-radio-group v-model="ruleForm.logic">
              <el-radio label="AND">满足所有条件</el-radio>
              <el-radio label="OR">满足任一条件</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>

        <!-- 预警动作配置 -->
        <el-form-item label="预警动作">
          <el-checkbox-group v-model="ruleForm.actions">
            <el-checkbox label="系统报警">系统报警</el-checkbox>
            <el-checkbox label="短信通知">短信通知</el-checkbox>
            <el-checkbox label="邮件通知">邮件通知</el-checkbox>
            <el-checkbox label="声光报警">声光报警</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <!-- 通知对象配置 -->
        <el-form-item label="通知对象">
          <el-select
            v-model="ruleForm.notifyUsers"
            multiple
            style="width: 100%"
          >
            <el-option 
              v-for="user in users"
              :key="user.id"
              :label="user.name"
              :value="user.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="备注">
          <el-input 
            v-model="ruleForm.remark" 
            type="textarea" 
            rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveRule">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 规则数据
const rules = ref([
  {
    id: 'R001',
    name: '反应釜温度预警',
    type: '设备参数',
    level: '严重',
    status: true,
    conditions: [
      {
        parameter: '温度',
        operator: '>',
        value: 80,
        unit: '°C'
      }
    ],
    logic: 'AND',
    actions: ['系统报警', '短信通知'],
    notifyUsers: ['张三', '李四'],
    createTime: '2024-03-20 10:00:00'
  }
  // ... 更多规则
])

// 搜索和筛选
const searchKey = ref('')
const filteredRules = computed(() => {
  if (!searchKey.value) return rules.value
  return rules.value.filter(rule => 
    rule.name.includes(searchKey.value) ||
    rule.id.includes(searchKey.value)
  )
})

// 表单数据
const dialogVisible = ref(false)
const isEdit = ref(false)
const ruleForm = ref({
  name: '',
  type: '',
  level: '',
  conditions: [],
  logic: 'AND',
  actions: [],
  notifyUsers: [],
  remark: ''
})

// 参数选项
const parameters = [
  { label: '温度', value: 'temperature' },
  { label: '压力', value: 'pressure' },
  { label: '流量', value: 'flow' },
  { label: '液位', value: 'level' }
]

// 用户列表
const users = [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
  { id: 3, name: '王五' }
]

// 新建规则
const createRule = () => {
  isEdit.value = false
  ruleForm.value = {
    name: '',
    type: '',
    level: '',
    conditions: [{
      parameter: '',
      operator: '',
      value: 0,
      unit: ''
    }],
    logic: 'AND',
    actions: [],
    notifyUsers: [],
    remark: ''
  }
  dialogVisible.value = true
}

// 编辑规则
const editRule = (rule) => {
  isEdit.value = true
  ruleForm.value = { ...rule }
  dialogVisible.value = true
}

// 删除规则
const deleteRule = (rule) => {
  ElMessageBox.confirm(
    '确定要删除该规则吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    rules.value = rules.value.filter(r => r.id !== rule.id)
    ElMessage.success('删除成功')
  })
}

// 添加/删除条件
const addCondition = () => {
  ruleForm.value.conditions.push({
    parameter: '',
    operator: '',
    value: 0,
    unit: ''
  })
}

const removeCondition = (index) => {
  ruleForm.value.conditions.splice(index, 1)
}

// 保存规则
const saveRule = () => {
  if (isEdit.value) {
    const index = rules.value.findIndex(r => r.id === ruleForm.value.id)
    rules.value[index] = { ...ruleForm.value }
  } else {
    const newRule = {
      ...ruleForm.value,
      id: `R${Date.now()}`,
      status: true,
      createTime: new Date().toLocaleString()
    }
    rules.value.unshift(newRule)
  }
  dialogVisible.value = false
  ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
}

// 规则状态变更
const handleStatusChange = (rule) => {
  ElMessage.success(`规则${rule.status ? '启用' : '禁用'}成功`)
}

// 导出规则
const exportRules = () => {
  // 实现导出逻辑
  ElMessage.success('导出成功')
}

const getAlertType = (level) => {
  const map = {
    '一般': 'info',
    '警告': 'warning',
    '严重': 'danger'
  }
  return map[level]
}
</script>

<style scoped>
.alert-rules {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-right {
  display: flex;
  gap: 10px;
}

.rule-detail {
  padding: 20px;
}

.condition-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.condition-item {
  display: flex;
  gap: 10px;
  align-items: center;
}

.condition-config {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
}

.condition-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}
</style> 