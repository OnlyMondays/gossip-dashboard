<script setup lang="ts">
const config = useRuntimeConfig()
const { status, snapshot, lastUpdate } = useClusterStream(config.public.streamUrl)

const pct = computed(() =>
  snapshot.value ? Math.min(100, (snapshot.value.global_total / snapshot.value.limit) * 100) : 0
)
const barColor = computed(() =>
  pct.value > 90 ? 'bg-red-500' : pct.value > 70 ? 'bg-yellow-500' : 'bg-green-500'
)
</script>

<template>
  <main class="mx-auto max-w-4xl p-6">
    <h1 class="text-2xl font-bold">Gossip Rate Limiter</h1>

    <p v-if="!snapshot" class="mt-4 text-gray-500">Connecting to stream... ({{ status }})</p>

    <template v-else>
      <div class="mt-4 text-4xl font-bold">
        {{ snapshot.global_total }} / {{ snapshot.limit }}
      </div>
      <div class="mt-2 h-3 w-full rounded bg-gray-200">
        <div class="h-3 rounded transition-all" :class="barColor" :style="{ width: pct + '%' }" />
      </div>

      <div class="mt-4 flex gap-6 text-sm">
        <span>allowed {{ snapshot.total_allowed }}</span>
        <span>rejected {{ snapshot.total_rejected }}</span>
        <span>hits {{ snapshot.total_hits }}</span>
        <span>online {{ snapshot.online_count }} / {{ snapshot.node_count }}</span>
      </div>

      <div class="mt-6 grid grid-cols-2 gap-4">
        <NodeCard v-for="n in snapshot.nodes" :key="n.node_url" :node="n" />
      </div>

      <p class="mt-6 text-xs text-gray-500">
        {{ status === 'open' ? 'stream connected' : 'stream disconnected, reconnecting...' }}
        <span v-if="lastUpdate"> | last update {{ lastUpdate.toLocaleTimeString() }}</span>
      </p>
    </template>
  </main>
</template>