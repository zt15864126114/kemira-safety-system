<template>
  <el-dialog
    v-model="visible"
    title="模板管理"
    width="800px"
  >
    <el-table :data="templates" style="width: 100%">
      <el-table-column prop="name" label="模板名称" />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button-group>
            <el-button type="primary" @click="handleUse(row)">使用</el-button>
            <el-button type="danger" @click="handleDelete(row)">删除</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ReportTemplate } from '@/types/report'

const props = defineProps<{
  modelValue: boolean
  templates: ReportTemplate[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'use': [template: ReportTemplate]
  'delete': [template: ReportTemplate]
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const handleUse = (template: ReportTemplate) => {
  emit('use', template)
  visible.value = false
}

const handleDelete = (template: ReportTemplate) => {
  emit('delete', template)
}
</script> 