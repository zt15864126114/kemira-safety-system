import type { 
  AlertQueryParams, 
  AlertListResponse, 
  Alert, 
  AlertRule,
  HandleRecord,
  AlertType,
  AlertLevel,
  AlertStatus
} from '@/types/alert'

// 生成随机时间
const getRandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

// 生成随机预警数据
const generateAlertData = (count: number): Alert[] => {
  const now = new Date()
  const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
  
  const locations = [
    '生产车间A', '生产车间B', '生产车间C', '仓储区域D', 
    '控制室E', '管道间F', '原料仓库G', '包装车间H',
    '质检区域I', '装配线J', '维修间K', '动力站L'
  ]
  
  const sources = [
    '温度传感器', '压力传感器', '流量计', '电压表', 
    '摄像头', '噪音检测器', '湿度传感器', '气体检测器',
    '震动传感器', '重量传感器', '光电传感器', '红外传感器'
  ]
  
  const operators = [
    '张建国', // 高级工程师
    '李明华', // 维修技师
    '王志强', // 生产主管
    '赵德明', // 技术主管
    '陈学文', // 操作班长
    '刘伟东', // 设备维护
    '吴国庆', // 工艺工程师
    '周长江'  // 质检主管
  ]

  return Array.from({ length: count }, (_, index) => {
    const type = ['device_error', 'timeout', 'abnormal', 'risk', 'environment'][Math.floor(Math.random() * 5)] as AlertType
    const level = ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as AlertLevel
    const status = ['pending', 'processing', 'resolved', 'ignored'][Math.floor(Math.random() * 4)] as AlertStatus
    
    const createTime = getRandomDate(threeMonthsAgo, now)
    const updateTime = new Date(createTime.getTime() + Math.random() * 3600000) // 最多1小时后更新
    
    const location = `${locations[Math.floor(Math.random() * locations.length)]}-${String(Math.floor(Math.random() * 10)).padStart(2, '0')}`
    const source = `${sources[Math.floor(Math.random() * sources.length)]}-${String.fromCharCode(65 + Math.floor(Math.random() * 5))}${Math.floor(Math.random() * 5) + 1}`
    
    let title = ''
    let description = ''
    
    switch (type) {
      case 'device_error':
        title = `设备${['温度异常', '压力超标', '电压波动', '运行故障'][Math.floor(Math.random() * 4)]}`
        description = `${source}检测到${['温度达到', '压力超过', '电压波动', '运行状态'][Math.floor(Math.random() * 4)]}异常值，可能影响生产安全`
        break
      case 'timeout':
        title = `${['设备离线', '响应超时', '维护逾期', '库存预警'][Math.floor(Math.random() * 4)]}`
        description = `${['设备连续离线超过30分钟', '系统响应时间超过阈值', '设备维护时间已逾期', '库存低于安全水平'][Math.floor(Math.random() * 4)]}`
        break
      case 'abnormal':
        title = `${['异常行为', '操作违规', '参数异常', '数据波动'][Math.floor(Math.random() * 4)]}`
        description = `检测到${['未授权操作', '违规作业', '参数超出范围', '数据异常波动'][Math.floor(Math.random() * 4)]}，需要及时处理`
        break
      case 'risk':
        title = `${['安全隐患', '防护缺失', '隔离失效', '防护设施损坏'][Math.floor(Math.random() * 4)]}`
        description = `发现${['安全防护措施缺失', '安全隔离设施损坏', '防护设备失效', '安全设施异常'][Math.floor(Math.random() * 4)]}，存在安全风险`
        break
      case 'environment':
        title = `${['环境异常', '空气污染', '噪音超标', '温湿度异常'][Math.floor(Math.random() * 4)]}`
        description = `环境监测${['空气质量超标', '噪音水平过高', '温度异常', '湿度超标'][Math.floor(Math.random() * 4)]}，需要及时处理`
        break
    }

    const isHandled = status === 'resolved' || status === 'ignored' || status === 'processing'
    const handledBy = isHandled ? operators[Math.floor(Math.random() * operators.length)] : undefined
    const handleTime = isHandled ? new Date(updateTime.getTime() + Math.random() * 1800000) : undefined // 最多30分钟后处理
    const handleResult = status === 'resolved' ? `已${['修复', '处理', '解决', '完成'][Math.floor(Math.random() * 4)]}` : undefined

    return {
      id: index + 1,
      title,
      type,
      level,
      status,
      source,
      description,
      location,
      createTime: createTime.toISOString(),
      updateTime: updateTime.toISOString(),
      handledBy,
      handleTime: handleTime?.toISOString(),
      handleResult
    }
  })
}

// 初始化110条预警数据
let alertStorage: Alert[] = generateAlertData(110)

// 获取预警列表
export const fetchAlertList = async (params: AlertQueryParams): Promise<AlertListResponse> => {
  try {
    // 模拟API调用
    const response = await new Promise<AlertListResponse>((resolve) => {
      setTimeout(() => {
        // 应用筛选
        let filteredAlerts = alertStorage.filter(alert => {
          if (params.type && alert.type !== params.type) return false
          if (params.level && alert.level !== params.level) return false
          if (params.status && alert.status !== params.status) return false
          if (params.dateRange?.length === 2) {
            const createTime = new Date(alert.createTime)
            const [startDate, endDate] = params.dateRange
            if (createTime < startDate || createTime > endDate) return false
          }
          return true
        })

        // 按创建时间倒序排序
        filteredAlerts.sort((a, b) => 
          new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
        )

        // 分页
        const start = (params.page - 1) * params.pageSize
        const end = start + params.pageSize
        const pageData = filteredAlerts.slice(start, end)

        resolve({
          data: pageData,
          total: filteredAlerts.length
        })
      }, 500)
    })
    return response
  } catch (error) {
    console.error('获取预警列表失败:', error)
    throw error
  }
}

// 获取预警详情
export const fetchAlertDetail = async (id: number): Promise<Alert> => {
  try {
    const response = await new Promise<Alert>((resolve, reject) => {
      setTimeout(() => {
        const alert = {
          id,
          title: `预警-${id}`,
          type: 'device_error' as Alert['type'],
          level: 'high' as Alert['level'],
          status: 'pending' as Alert['status'],
          source: '温度传感器',
          description: '这是一条测试预警信息，描述了具体的预警内容和可能的影响。',
          location: '生产线A',
          createTime: new Date().toISOString(),
          updateTime: new Date().toISOString()
        }
        resolve(alert)
      }, 500)
    })
    return response
  } catch (error) {
    console.error('获取预警详情失败:', error)
    throw error
  }
}

// 处置历史记录生成
const generateHandleRecords = (alertId: number, status: AlertStatus, createTime: string): HandleRecord[] => {
  const records: HandleRecord[] = []
  const operators = [
    { name: '张志明', role: '设备工程师' },
    { name: '李国强', role: '维修技师' },
    { name: '王建华', role: '安全主管' },
    { name: '赵学文', role: '技术专家' },
    { name: '陈德军', role: '操作员' },
    { name: '刘海峰', role: '检修员' },
    { name: '孙伟东', role: '维护工程师' },
    { name: '周明亮', role: '工艺工程师' }
  ]

  const baseTime = new Date(createTime)
  
  // 根据状态生成不同的处置记录
  switch (status) {
    case 'resolved':
      // 已解决的预警通常有2-4条处置记录
      const recordCount = Math.floor(Math.random() * 3) + 2
      for (let i = 0; i < recordCount; i++) {
        const operator = operators[Math.floor(Math.random() * operators.length)]
        const recordTime = new Date(baseTime.getTime() + (i + 1) * Math.random() * 3600000) // 每条记录间隔最多1小时
        
        let action: string
        let description: string
        
        if (i === 0) {
          action = '接收处理'
          description = `收到预警信息，开始进行排查。${['安排人员现场检查', '远程诊断分析', '调取监控记录', '收集相关数据'][Math.floor(Math.random() * 4)]}`
        } else if (i === recordCount - 1) {
          action = '完成处理'
          description = `问题已解决。${['设备已恢复正常运行', '安全隐患已排除', '参数已调整到正常范围', '环境指标已达标'][Math.floor(Math.random() * 4)]}`
        } else {
          action = ['现场检查', '故障诊断', '维修处理', '调试验证'][Math.floor(Math.random() * 4)]
          description = [
            '检查发现设备轴承磨损，需要更换零件',
            '诊断为传感器数据偏差，进行校准调整',
            '更换损坏部件，进行功能测试',
            '调整控制参数，观察运行状态',
            '清理设备积尘，改善散热条件',
            '紧固松动部件，消除异常振动',
            '更新系统配置，优化运行性能',
            '添加防护措施，提升安全等级'
          ][Math.floor(Math.random() * 8)]
        }

        records.push({
          id: alertId * 100 + i,
          alertId,
          operator: operator.name,
          role: operator.role,
          action,
          description,
          time: recordTime.toISOString(),
          attachments: i === recordCount - 1 ? [
            {
              name: ['处理报告.pdf', '现场照片.jpg', '检测数据.xlsx'][Math.floor(Math.random() * 3)],
              url: '#',
              type: ['application/pdf', 'image/jpeg', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'][Math.floor(Math.random() * 3)]
            }
          ] : []
        })
      }
      break
      
    case 'processing':
      // 处理中的预警通常有1-2条处置记录
      const processingCount = Math.floor(Math.random() * 2) + 1
      for (let i = 0; i < processingCount; i++) {
        const operator = operators[Math.floor(Math.random() * operators.length)]
        const recordTime = new Date(baseTime.getTime() + (i + 1) * Math.random() * 1800000) // 每条记录间隔最多30分钟
        
        records.push({
          id: alertId * 100 + i,
          alertId,
          operator: operator.name,
          role: operator.role,
          action: i === 0 ? '接收处理' : '处理中',
          description: [
            '正在进行现场检查和故障排查',
            '等待备件到达后进行更换',
            '正在进行系统参数调整',
            '正在收集更多数据进行分析',
            '已联系专业人员，等待支援'
          ][Math.floor(Math.random() * 5)],
          time: recordTime.toISOString(),
          attachments: []
        })
      }
      break
      
    case 'ignored':
      // 已忽略的预警通常只有1条处置记录
      const operator = operators[Math.floor(Math.random() * operators.length)]
      records.push({
        id: alertId * 100,
        alertId,
        operator: operator.name,
        role: operator.role,
        action: '忽略预警',
        description: [
          '经评估为误报，不需要处理',
          '重复预警，已在其他任务中处理',
          '临时性波动，在可接受范围内',
          '已知问题，暂时不影响生产'
        ][Math.floor(Math.random() * 4)],
        time: new Date(baseTime.getTime() + Math.random() * 1800000).toISOString(),
        attachments: []
      })
      break
  }

  return records
}

// 获取预警处置历史
export const fetchAlertHistory = async (alertId: number): Promise<HandleRecord[]> => {
  try {
    const alert = alertStorage.find(a => a.id === alertId)
    if (!alert) {
      throw new Error('预警不存在')
    }

    // 模拟API调用
    const response = await new Promise<HandleRecord[]>((resolve) => {
      setTimeout(() => {
        const records = generateHandleRecords(alertId, alert.status, alert.createTime)
        resolve(records)
      }, 500)
    })
    return response
  } catch (error) {
    console.error('获取处置历史失败:', error)
    throw error
  }
}

// 提交预警处置
export const submitAlertHandle = async (params: {
  alertId: number
  action: string
  operator: string
  description: string
  attachments: File[]
}): Promise<boolean> => {
  try {
    const response = await new Promise<boolean>((resolve) => {
      setTimeout(() => {
        resolve(true)
      }, 1000)
    })
    return response
  } catch (error) {
    console.error('提交处置失败:', error)
    throw error
  }
}

// 预警规则数据存储
let ruleStorage: AlertRule[] = [
  {
    id: 1,
    name: '设备温度过高预警',
    type: 'device_error',
    level: 'high',
    conditions: [
      {
        field: '温度',
        operator: '>',
        value: 85,
        unit: '°C'
      },
      {
        field: '持续时间',
        operator: '>',
        value: 5,
        unit: '分钟'
      }
    ],
    actions: [
      {
        type: 'notification',
        config: {
          channels: ['sms', 'email', 'wechat'],
          template: '设备温度异常：{location}的{device}温度达到{value}°C，请及时处理'
        }
      },
      {
        type: 'automation',
        config: {
          action: 'startCooling',
          params: { mode: 'emergency' }
        }
      }
    ],
    enabled: true,
    createTime: '2024-01-15T08:00:00Z',
    updateTime: '2024-03-01T10:30:00Z'
  },
  {
    id: 2,
    name: '安全帽佩戴检测',
    type: 'risk',
    level: 'critical',
    conditions: [
      {
        field: '安全帽识别',
        operator: '=',
        value: false,
        unit: ''
      },
      {
        field: '区域等级',
        operator: '=',
        value: '危险区域',
        unit: ''
      }
    ],
    actions: [
      {
        type: 'notification',
        config: {
          channels: ['broadcast', 'wechat'],
          template: '安全预警：{location}发现未佩戴安全帽人员，请立即规范佩戴'
        }
      }
    ],
    enabled: true,
    createTime: '2024-01-20T09:15:00Z',
    updateTime: '2024-03-10T14:20:00Z'
  },
  {
    id: 3,
    name: '设备离线监控',
    type: 'timeout',
    level: 'medium',
    conditions: [
      {
        field: '心跳信号',
        operator: '=',
        value: false,
        unit: ''
      },
      {
        field: '离线时间',
        operator: '>',
        value: 15,
        unit: '分钟'
      }
    ],
    actions: [
      {
        type: 'notification',
        config: {
          channels: ['email', 'system'],
          template: '设备离线提醒：{device}已离线{duration}分钟，请检查网络连接'
        }
      }
    ],
    enabled: true,
    createTime: '2024-02-01T10:00:00Z',
    updateTime: '2024-03-15T16:45:00Z'
  },
  {
    id: 4,
    name: '环境湿度异常',
    type: 'environment',
    level: 'low',
    conditions: [
      {
        field: '相对湿度',
        operator: '>',
        value: 75,
        unit: '%'
      },
      {
        field: '检测次数',
        operator: '>',
        value: 3,
        unit: '次'
      }
    ],
    actions: [
      {
        type: 'notification',
        config: {
          channels: ['system'],
          template: '环境提醒：{location}湿度达到{value}%，建议开启除湿设备'
        }
      },
      {
        type: 'automation',
        config: {
          action: 'startDehumidifier',
          params: { mode: 'auto' }
        }
      }
    ],
    enabled: true,
    createTime: '2024-02-10T11:30:00Z',
    updateTime: '2024-03-05T09:20:00Z'
  },
  {
    id: 5,
    name: '压力超标预警',
    type: 'device_error',
    level: 'critical',
    conditions: [
      {
        field: '管道压力',
        operator: '>',
        value: 2.8,
        unit: 'MPa'
      }
    ],
    actions: [
      {
        type: 'notification',
        config: {
          channels: ['sms', 'wechat', 'broadcast'],
          template: '紧急预警：{location}管道压力达到{value}MPa，存在安全隐患'
        }
      },
      {
        type: 'automation',
        config: {
          action: 'emergencyValve',
          params: { command: 'close' }
        }
      }
    ],
    enabled: true,
    createTime: '2024-02-15T14:20:00Z',
    updateTime: '2024-03-12T11:10:00Z'
  },
  {
    id: 6,
    name: '异常行为检测',
    type: 'abnormal',
    level: 'high',
    conditions: [
      {
        field: '行为类型',
        operator: '=',
        value: '未授权进入',
        unit: ''
      },
      {
        field: '持续时间',
        operator: '>',
        value: 3,
        unit: '分钟'
      }
    ],
    actions: [
      {
        type: 'notification',
        config: {
          channels: ['sms', 'system'],
          template: '安全预警：{location}检测到未授权人员，请及时核实'
        }
      }
    ],
    enabled: true,
    createTime: '2024-02-20T16:00:00Z',
    updateTime: '2024-03-08T15:30:00Z'
  },
  {
    id: 7,
    name: '库存预警',
    type: 'timeout',
    level: 'medium',
    conditions: [
      {
        field: '库存量',
        operator: '<',
        value: 100,
        unit: '件'
      },
      {
        field: '采购周期',
        operator: '>',
        value: 7,
        unit: '天'
      }
    ],
    actions: [
      {
        type: 'notification',
        config: {
          channels: ['email', 'system'],
          template: '库存预警：{material}库存不足，当前库存{value}件'
        }
      },
      {
        type: 'webhook',
        config: {
          url: 'http://erp.example.com/api/purchase',
          method: 'POST'
        }
      }
    ],
    enabled: true,
    createTime: '2024-02-25T09:40:00Z',
    updateTime: '2024-03-18T10:25:00Z'
  },
  {
    id: 8,
    name: '噪音超标预警',
    type: 'environment',
    level: 'medium',
    conditions: [
      {
        field: '噪音级别',
        operator: '>',
        value: 85,
        unit: 'dB'
      },
      {
        field: '持续时间',
        operator: '>',
        value: 30,
        unit: '分钟'
      }
    ],
    actions: [
      {
        type: 'notification',
        config: {
          channels: ['system', 'broadcast'],
          template: '环境预警：{location}噪音超标，请佩戴防护设备'
        }
      }
    ],
    enabled: false,
    createTime: '2024-03-01T13:50:00Z',
    updateTime: '2024-03-20T14:15:00Z'
  }
]

// 获取预警规则列表
export const fetchAlertRules = async (): Promise<AlertRule[]> => {
  try {
    const response = await new Promise<AlertRule[]>((resolve) => {
      setTimeout(() => {
        resolve([...ruleStorage])
      }, 500)
    })
    return response
  } catch (error) {
    console.error('获取预警规则失败:', error)
    throw error
  }
}

// 保存预警规则
export const saveAlertRule = async (rule: Partial<AlertRule>): Promise<AlertRule> => {
  try {
    // 模拟API调用
    const response = await new Promise<AlertRule>((resolve) => {
      setTimeout(() => {
        const now = new Date().toISOString()
        
        if (rule.id) {
          // 更新现有规则
          const index = ruleStorage.findIndex(r => r.id === rule.id)
          if (index > -1) {
            const updatedRule: AlertRule = {
              ...ruleStorage[index],
              ...rule,
              updateTime: now
            }
            ruleStorage[index] = updatedRule
            resolve(updatedRule)
          } else {
            throw new Error('规则不存在')
          }
        } else {
          // 创建新规则
          const newRule: AlertRule = {
            id: Math.floor(Math.random() * 10000),
            name: rule.name || '',
            type: rule.type || 'device_error',
            level: rule.level || 'medium',
            conditions: rule.conditions || [],
            actions: rule.actions || [],
            enabled: rule.enabled ?? true,
            createTime: now,
            updateTime: now
          }
          ruleStorage.push(newRule)
          resolve(newRule)
        }
      }, 1000)
    })
    return response
  } catch (error) {
    console.error('保存预警规则失败:', error)
    throw error
  }
}

// 删除预警规则
export const deleteAlertRule = async (id: number): Promise<boolean> => {
  try {
    // 模拟API调用
    const response = await new Promise<boolean>((resolve, reject) => {
      setTimeout(() => {
        const index = ruleStorage.findIndex(r => r.id === id)
        if (index > -1) {
          ruleStorage.splice(index, 1)
          resolve(true)
        } else {
          reject(new Error('规则不存在'))
        }
      }, 500)
    })
    return response
  } catch (error) {
    console.error('删除预警规则失败:', error)
    throw error
  }
}

// 更新规则状态
export const updateRuleStatus = async (id: number, enabled: boolean): Promise<AlertRule> => {
  try {
    // 模拟API调用
    const response = await new Promise<AlertRule>((resolve, reject) => {
      setTimeout(() => {
        const index = ruleStorage.findIndex(r => r.id === id)
        if (index > -1) {
          const updatedRule = {
            ...ruleStorage[index],
            enabled,
            updateTime: new Date().toISOString()
          }
          ruleStorage[index] = updatedRule
          resolve(updatedRule)
        } else {
          reject(new Error('规则不存在'))
        }
      }, 500)
    })
    return response
  } catch (error) {
    console.error('更新规则状态失败:', error)
    throw error
  }
} 