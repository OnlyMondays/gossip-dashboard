import { describe, it, expect, vi, beforeEach } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { useClusterStream } from '../app/composables/useClusterStream'

class FakeEventSource {
  static instances: FakeEventSource[] = []
  onopen: (() => void) | null = null
  onerror: (() => void) | null = null
  onmessage: ((e: { data: string }) => void) | null = null
  close = vi.fn()
  constructor(public url: string) {
    FakeEventSource.instances.push(this)
  }
}

const payload = {
  nodes: [
    { node_url: 'http://node1:8000', node_id: 'node1', counts: { node1: 12 }, allowed: 12, rejected: 0, api_hits: 5, limit: 100 },
    { offline: true, node_url: 'http://node2:8000' },
  ],
  global_total: 12,
  merged_counts: { node1: 12 },
  limit: 100,
  total_allowed: 12,
  total_rejected: 0,
  total_hits: 5,
  online_count: 1,
  node_count: 2,
}

function mountWithStream() {
  let result!: ReturnType<typeof useClusterStream>
  const wrapper = mount(
    defineComponent({
      setup() {
        result = useClusterStream('/stream')
        return () => h('div')
      },
    }),
  )
  return { wrapper, result }
}

describe('useClusterStream', () => {
  beforeEach(() => {
    FakeEventSource.instances = []
    vi.stubGlobal('EventSource', FakeEventSource)
  })

  it('connects to the given url when mounted', () => {
    mountWithStream()
    expect(FakeEventSource.instances).toHaveLength(1)
    expect(FakeEventSource.instances[0].url).toBe('/stream')
  })

  it('stores the snapshot when a message arrives', () => {
    const { result } = mountWithStream()
    FakeEventSource.instances[0].onmessage?.({ data: JSON.stringify(payload) })
    expect(result.snapshot.value?.global_total).toBe(12)
    expect(result.status.value).toBe('open')
  })

  it('ignores a message that is not JSON', () => {
    const { result } = mountWithStream()
    FakeEventSource.instances[0].onmessage?.({ data: 'not json' })
    expect(result.snapshot.value).toBeNull()
    expect(result.lastUpdate.value).toBeNull()
  })

  it('ignores a malformed snapshot and keeps the previous one', () => {
    const { result } = mountWithStream()
    FakeEventSource.instances[0].onmessage?.({ data: JSON.stringify(payload) })
    FakeEventSource.instances[0].onmessage?.({ data: JSON.stringify({ global_total: 99 }) })
    expect(result.snapshot.value?.global_total).toBe(12)
  })

  it('reports an error state', () => {
    const { result } = mountWithStream()
    FakeEventSource.instances[0].onerror?.()
    expect(result.status.value).toBe('error')
  })

  it('closes the connection when the component is unmounted', () => {
    const { wrapper } = mountWithStream()
    wrapper.unmount()
    expect(FakeEventSource.instances[0].close).toHaveBeenCalled()
  })
})