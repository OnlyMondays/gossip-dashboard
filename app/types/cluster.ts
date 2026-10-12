export interface OnlineNode {
  offline?: false
  node_url: string
  node_id: string
  counts: Record<string, number>
  allowed: number
  rejected: number
  api_hits: number
  limit: number
}

export interface OfflineNode {
  offline: true
  node_url: string
}

export type NodeStatus = OnlineNode | OfflineNode

export interface ClusterSnapshot {
  nodes: NodeStatus[]
  global_total: number
  merged_counts: Record<string, number>
  limit: number
  total_allowed: number
  total_rejected: number
  total_hits: number
  online_count: number
  node_count: number
}