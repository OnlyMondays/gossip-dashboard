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
    const payload = { global_total: 12, limit: 100, nodes: [] }
    FakeEventSource.instances[0].onmessage?.({ data: JSON.stringify(payload) })
    expect(result.snapshot.value?.global_total).toBe(12)
    expect(result.status.value).toBe('open')
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