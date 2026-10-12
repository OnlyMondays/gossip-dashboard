<script setup lang="ts">
import type { NodeStatus } from '~/types/cluster'
defineProps<{ node: NodeStatus; large?: boolean }>()
</script>

<template>
  <div
    class="rounded-lg border p-4"
    :class="[
      node.offline ? 'border-red-400 opacity-70' : 'border-gray-400',
      large ? 'p-8' : 'p-4',
    ]"
  >
    <template v-if="node.offline">
      <div :class="large ? 'text-2xl text-gray-400' : 'text-sm text-gray-500'">
        {{ node.node_url }}
      </div>
      <div class="font-bold text-red-500" :class="large ? 'text-6xl' : 'text-2xl'">offline</div>
    </template>
    <template v-else>
      <div :class="large ? 'text-3xl text-gray-400' : 'text-sm text-gray-500'">
        {{ node.node_id }}
      </div>
      <div class="font-bold" :class="large ? 'text-8xl' : 'text-4xl'">
        {{ node.counts[node.node_id] ?? 0 }}
      </div>
      <div class="mt-2 flex gap-4" :class="large ? 'text-3xl' : 'text-sm'">
        <span class="text-green-500">+ {{ node.allowed }}</span>
        <span class="text-red-500">- {{ node.rejected }}</span>
        <span>hits {{ node.api_hits }}</span>
      </div>
    </template>
  </div>
</template>