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