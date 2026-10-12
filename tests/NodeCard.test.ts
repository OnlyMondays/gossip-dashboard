import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NodeCard from '../app/components/NodeCard.vue'

describe('NodeCard', () => {
  it('shows the local counter and stats for an online node', () => {
    const wrapper = mount(NodeCard, {
      props: {
        node: {
          node_url: 'http://node1:8000',
          node_id: 'node1',
          counts: { node1: 42, node2: 7 },
          allowed: 50,
          rejected: 3,
          api_hits: 20,
          limit: 100,
        },
      },
    })
    expect(wrapper.text()).toContain('node1')
    expect(wrapper.text()).toContain('42')
    expect(wrapper.text()).toContain('+ 50')
    expect(wrapper.text()).toContain('- 3')
  })

  it('shows offline state when the node is down', () => {
    const wrapper = mount(NodeCard, {
      props: { node: { offline: true, node_url: 'http://node2:8000' } },
    })
    expect(wrapper.text()).toContain('offline')
    expect(wrapper.text()).toContain('http://node2:8000')
  })
})