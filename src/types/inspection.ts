export interface InspectionItem {
  name: string
  value: string
  status: 'normal' | 'warning' | 'danger'
  threshold?: {
    min: number
    max: number
  }
}

export interface InspectionRecord {
  id: string
  area: string
  inspector: string
  status: 'normal' | 'warning' | 'danger'
  timestamp: string
  items: InspectionItem[]
}

export interface Task {
  taskNo: string
  area: string
  inspector: string
  startTime: string
  endTime: string
  status: string
  progress: number
  content?: string
  remark?: string
} 