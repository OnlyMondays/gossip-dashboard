# Gossip Dashboard

A real-time dashboard for [gossip-rate-limiter](https://github.com/OnlyMondays/gossip-rate-limiter), a leaderless distributed rate limiter. It streams cluster state over Server-Sent Events and shows each node's counters, the global total against the limit, and which nodes are online.

## Features

- Live cluster view updated every second over SSE, with no polling from the browser
- Per-node counters for allowed, rejected, and upstream hits, with offline nodes shown clearly
- Global usage bar that changes color as the limit approaches
- TV mode with large type and high contrast, readable from across a room
- Responsive layout that collapses to one column on phones

## Stack

Nuxt 4, Vue 3 (Composition API), TypeScript, Tailwind CSS, Vitest, Docker

## Run it

With the backend cluster running from the rate limiter repo:

```bash
docker compose up --build
```

Then open http://localhost:3001. For local development without Docker:

```bash
npm install
npm run dev -- --port 3001
```

The stream URL is configured with the `NUXT_PUBLIC_STREAM_URL` environment variable.

## Tests

```bash
npm test
```

Covers the `useClusterStream` composable (connect, message handling, error state, cleanup on unmount, using a fake `EventSource`) and the `NodeCard` component (online and offline rendering).

## Design decisions

- **A composable instead of a store.** One stream feeds one page, so `useClusterStream` returns refs directly. Pinia would add indirection without a benefit here.
- **Connection opens in `onMounted`.** Nuxt renders on the server first, where `EventSource` does not exist.
- **Typed payloads.** Node status is a discriminated union (`online | offline`), so the compiler enforces which fields exist in each state.
- **Runtime configuration.** The stream URL is read from the environment at runtime, so one image runs locally and in production.
- **Multi-stage Docker build.** The final image contains only the built output, not source or dev dependencies.
- **Vue templates instead of `innerHTML`.** The original vanilla dashboard built HTML from strings. Vue escapes interpolated values by default.

## Limitations

- Payloads are cast to their TypeScript type rather than validated at runtime.
- The backend polls nodes once per second, so the dashboard is near-real-time, not instant.
- No authentication on the stream.
