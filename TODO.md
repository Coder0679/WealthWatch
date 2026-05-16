# TODO

## Network-hosted dev setup (npm run dev)
- [ ] Ensure Express + Vite dev server are reachable from local network: bind to 0.0.0.0 and expose a clear URL.
- [ ] Add/confirm environment variables: `PORT` and optional `HOST`.
- [x] Update `server.ts` to use `HOST` env var (default `0.0.0.0`) and update logs.
- [x] (If needed) ensure any Vite server settings (`host`, `strictPort`) are configured for HMR and network access.

- [ ] Provide exact command to run (Windows CMD): `set HOST=0.0.0.0 && set PORT=3000 && npm run dev`
- [ ] Verify by checking reachable URLs from another device using: `http://<YOUR_LAN_IP>:3000`


