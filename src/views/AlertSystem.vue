<template>
  <el-container>
    <el-main>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="预警规则" name="rules">
          <el-button type="primary" @click="dialogVisible = true">
            添加规则
          </el-button>
          
          <el-table :data="rules" style="margin-top: 20px">
            <el-table-column prop="name" label="规则名称" />
            <el-table-column prop="type" label="监控类型" />
            <el-table-column prop="threshold" label="阈值" />
            <el-table-column prop="level" label="预警等级" />
            <el-table-column label="操作">
              <template #default="scope">
                <el-button type="danger" @click="deleteRule(scope.$index)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        
        <el-tab-pane label="预警记录" name="alerts">
          <el-table :data="alerts">
            <el-table-column prop="time" label="时间" />
            <el-table-column prop="type" label="类型" />
            <el-table-column prop="message" label="预警信息" />
            <el-table-column prop="status" label="状态" />
            <el-table-column label="操作">
              <template #default="scope">
                <el-button 
                  type="success" 
                  @click="handleAlert(scope.$index)"
                  :disabled="scope.row.status === '已处理'"
                >
                  处理
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      
      <!-- 添加规则对话框 -->
      <el-dialog v-model="dialogVisible" title="添加预警规则">
        <el-form :model="newRule" label-width="100px">
          <el-form-item label="规则名称">
            <el-input v-model="newRule.name" />
          </el-form-item>
          <el-form-item label="监控类型">
            <el-select v-model="newRule.type">
              <el-option label="温度" value="temperature" />
              <el-option label="压力" value="pressure" />
              <el-option label="湿度" value="humidity" />
            </el-select>
          </el-form-item>
          <el-form-item label="阈值">
            <el-input-number v-model="newRule.threshold" />
          </el-form-item>
          <el-form-item label="预警等级">
            <el-select v-model="newRule.level">
              <el-option label="低" value="low" />
              <el-option label="中" value="medium" />
              <el-option label="高" value="high" />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addRule">确定</el-button>
        </template>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, reactive } from 'vue'

const activeTab = ref('rules')
const dialogVisible = ref(false)

// 预警规则
const rules = ref([
  { name: '高温预警', type: '温度', threshold: 80, level: '高' }
])

// 预警记录
const alerts = ref([
  { 
    time: '2024-03-20 10:00',
    type: '温度',
    message: '温度超过阈值',
    status: '未处理'
  }
])

const newRule = reactive({
  name: '',
  type: '',
  threshold: 0,
  level: ''
})

const addRule = () => {
  rules.value.push({ ...newRule })
  dialogVisible.value = false
}

const deleteRule = (index) => {
  rules.value.splice(index, 1)
}

const handleAlert = (index) => {
  alerts.value[index].status = '已处理'
}
</script> 