import { isClusterSnapshot, type ClusterSnapshot } from '~/types/cluster'
import { ref, onMounted, onScopeDispose } from 'vue'

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
      let data: unknown
      try {
        data = JSON.parse(e.data)
      } catch {
        console.warn('cluster stream: ignoring non-JSON message')
        return
      }
      if (!isClusterSnapshot(data)) {
        console.warn('cluster stream: ignoring malformed snapshot', data)
        return
      }
      snapshot.value = data
      lastUpdate.value = new Date()
      status.value = 'open'
    }
  })

  onScopeDispose(() => source?.close())

  return { status, snapshot, lastUpdate }
}