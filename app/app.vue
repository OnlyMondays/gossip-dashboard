<script setup lang="ts">
const config = useRuntimeConfig()
const { status, snapshot, lastUpdate } = useClusterStream(config.public.streamUrl)
const tvMode = ref(false)

const pct = computed(() => {
  const s = snapshot.value
  if (!s || s.limit <= 0) return 0
  return Math.min(100, (s.global_total / s.limit) * 100)
})
const barColor = computed(() =>
  pct.value > 90 ? 'bg-red-500' : pct.value > 70 ? 'bg-yellow-500' : 'bg-green-500'
)
</script>

<template>
  <main
    class="min-h-screen"
    :class="tvMode ? 'bg-black p-10 text-white' : 'mx-auto max-w-4xl p-6'"
  >
    <div class="flex items-center justify-between">
      <h1 class="font-bold" :class="tvMode ? 'text-5xl' : 'text-2xl'">Gossip Rate Limiter</h1>
      <button
        class="rounded border px-3 py-1 text-sm"
        :aria-pressed="tvMode"
        @click="tvMode = !tvMode"
      >
        TV mode: {{ tvMode ? 'on' : 'off' }}
      </button>
    </div>

    <p v-if="!snapshot" class="mt-4 text-gray-500">Connecting to stream... ({{ status }})</p>

    <template v-else>
      <div class="mt-4 font-bold" :class="tvMode ? 'text-9xl' : 'text-4xl'">
        {{ snapshot.global_total }} / {{ snapshot.limit }}
      </div>
      <div class="mt-2 w-full rounded bg-gray-300" :class="tvMode ? 'h-8' : 'h-3'">
        <div
          class="rounded transition-all"
          :class="[barColor, tvMode ? 'h-8' : 'h-3']"
          :style="{ width: pct + '%' }"
        />
      </div>

      <div class="mt-4 flex flex-wrap gap-6" :class="tvMode ? 'text-3xl' : 'text-sm'">
        <span>allowed {{ snapshot.total_allowed }}</span>
        <span>rejected {{ snapshot.total_rejected }}</span>
        <span>hits {{ snapshot.total_hits }}</span>
        <span>online {{ snapshot.online_count }} / {{ snapshot.node_count }}</span>
      </div>

      <div class="mt-6 grid grid-cols-1 sm:grid-cols-2" :class="tvMode ? 'gap-8' : 'gap-4'">
        <NodeCard v-for="n in snapshot.nodes" :key="n.node_url" :node="n" :large="tvMode" />
      </div>

      <p class="mt-6 text-gray-500" :class="tvMode ? 'text-xl' : 'text-xs'">
        {{ status === 'open' ? 'stream connected' : 'stream disconnected, reconnecting...' }}
        <span v-if="lastUpdate"> | last update {{ lastUpdate.toLocaleTimeString() }}</span>
      </p>
    </template>
  </main>
</template>