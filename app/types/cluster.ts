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

const isNum = (v: unknown): v is number => typeof v === 'number'

function isNodeStatus(v: any): v is NodeStatus {
  if (!v || typeof v.node_url !== 'string') return false
  if (v.offline === true) return true
  return typeof v.node_id === 'string'
    && typeof v.counts === 'object' && v.counts !== null
    && isNum(v.allowed) && isNum(v.rejected) && isNum(v.api_hits) && isNum(v.limit)
}

export function isClusterSnapshot(v: any): v is ClusterSnapshot {
  return !!v
    && Array.isArray(v.nodes) && v.nodes.every(isNodeStatus)
    && ['global_total', 'limit', 'total_allowed', 'total_rejected',
        'total_hits', 'online_count', 'node_count'].every((k) => isNum(v[k]))
}