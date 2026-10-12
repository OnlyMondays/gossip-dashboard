<script setup lang="ts">
import type { NodeStatus } from '~/types/cluster'
defineProps<{ node: NodeStatus }>()
</script>

<template>
  <div
    class="rounded-lg border p-4"
    :class="node.offline ? 'border-red-400 opacity-70' : 'border-gray-300'"
  >
    <template v-if="node.offline">
      <div class="text-sm text-gray-500">{{ node.node_url }}</div>
      <div class="text-2xl font-bold text-red-500">offline</div>
    </template>
    <template v-else>
      <div class="text-sm text-gray-500">{{ node.node_id }}</div>
      <div class="text-4xl font-bold">{{ node.counts[node.node_id] ?? 0 }}</div>
      <div class="mt-2 flex gap-3 text-sm">
        <span class="text-green-600">+ {{ node.allowed }}</span>
        <span class="text-red-600">- {{ node.rejected }}</span>
        <span>hits {{ node.api_hits }}</span>
      </div>
    </template>
  </div>
</template>