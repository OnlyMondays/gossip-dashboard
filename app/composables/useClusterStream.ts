import type { ClusterSnapshot } from '~/types/cluster'

export function useClusterStream(url: string) {
  const status = ref<'connecting' | 'open' | 'error'>('connecting')
  const snapshot = ref<ClusterSnapshot | null>(null)
  const lastUpdate = ref<Date | null>(null)
  let source: EventSource | null = null

  onMounted(() => {
    source = new EventSource(url)
    source.onopen = () => { status.value = 'open' }
    source.onerror = () => { status.value = 'error' }
    source.onmessage = (e) => {
      snapshot.value = JSON.parse(e.data) as ClusterSnapshot
      lastUpdate.value = new Date()
      status.value = 'open'
    }
  })

  onScopeDispose(() => source?.close())

  return { status, snapshot, lastUpdate }
}