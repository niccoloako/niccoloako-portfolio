import type { RequestHandler } from '@sveltejs/kit';
// Buffer is available in Node; declare for TypeScript in this server file
declare const Buffer: any;
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '$env/static/private';
// If SPOTIFY_CLIENT_SECRET is not exported, check your .env file and add:
// SPOTIFY_CLIENT_SECRET=your_secret_here
// Then restart your dev server.
// Removed Buffer import; using btoa for base64 encoding

type TrackOut = { title: string; preview?: string; spotify: string };

let cache: { [playlistId: string]: { at: number; data: TrackOut[] } } = {};
const TTL = 10 * 60 * 1000; // 10 min

// Use Vite's import.meta.env.MODE to detect environment in a typesafe way
const DEBUG = (typeof import.meta !== 'undefined' && (import.meta as any).env?.MODE) ? ((import.meta as any).env.MODE !== 'production') : true;
if (DEBUG) {
  // Log lengths only to avoid printing secrets
  try {
    // SPOTIFY_CLIENT_ID/SECRET come from $env/static/private
    // show only length for debugging
    // eslint-disable-next-line no-console
    console.log('[spotify debug] CLIENT_ID length:', SPOTIFY_CLIENT_ID ? String(SPOTIFY_CLIENT_ID.length) : 'undefined');
    // eslint-disable-next-line no-console
    console.log('[spotify debug] CLIENT_SECRET length:', SPOTIFY_CLIENT_SECRET ? String(SPOTIFY_CLIENT_SECRET.length) : 'undefined');
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('[spotify debug] env read error', e);
  }
}

function parsePlaylistId(playlistUrl: string): string | null {
  try {
    const u = new URL(playlistUrl);
    const parts = u.pathname.split('/').filter(Boolean);
    // /playlist/{id}
    return parts[0] === 'playlist' && parts[1] ? parts[1] : null;
  } catch {
    return null;
  }
}

async function getAccessToken() {
  const body = new URLSearchParams({ grant_type: 'client_credentials' });
  // Helper: base64 encode using available runtime primitives.
  function encodeBase64(input: string) {
    // Prefer Node's Buffer when available
    if (typeof (globalThis as any).Buffer !== 'undefined') {
      return (globalThis as any).Buffer.from(input).toString('base64');
    }
    // Fallback to btoa in browser-like runtimes
    if (typeof (globalThis as any).btoa === 'function') {
      // btoa expects a binary string; encode as UTF-8 first
      return (globalThis as any).btoa(unescape(encodeURIComponent(input)));
    }
    throw new Error('No base64 encoder available in runtime (Buffer or btoa)');
  }

  const credentials = encodeBase64(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`);
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + credentials,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body
  });
  if (!res.ok) throw new Error('Failed to get token');
  const json = await res.json();
  return json.access_token as string;
}

export const GET: RequestHandler = async ({ url }) => {
  const playlistUrl = url.searchParams.get('playlist');
  if (!playlistUrl) return new Response('Missing playlist', { status: 400 });

  const id = parsePlaylistId(playlistUrl);
  if (!id) return new Response('Invalid playlist url', { status: 400 });

  if (DEBUG) {
    // eslint-disable-next-line no-console
    console.log('[spotify debug] playlist id:', id);
  }

  // cache
  const now = Date.now();
  if (cache[id] && now - cache[id].at < TTL) {
    if (DEBUG) {
      // eslint-disable-next-line no-console
      console.log('[spotify debug] cache hit for', id);
    }
    return new Response(JSON.stringify(cache[id].data), { headers: { 'Content-Type': 'application/json' } });
  }

  const token = await getAccessToken();

  // récupère tous les titres (pagination 100 max/req)
  let offset = 0;
  const limit = 100;
  const out: TrackOut[] = [];

  while (true) {
    const fields =
      'items(track(name,preview_url,external_urls(spotify),artists(name))),total,limit,offset,next';
    const res = await fetch(
      `https://api.spotify.com/v1/playlists/${id}/tracks?limit=${limit}&offset=${offset}&fields=${encodeURIComponent(
        fields
      )}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) throw new Error('Failed to fetch tracks');
    const json = await res.json();

    for (const item of json.items ?? []) {
      const t = item.track;
      if (!t) continue;
      const title =
        t.name + (t.artists?.length ? ' — ' + t.artists.map((a: any) => a.name).join(', ') : '');
      out.push({
        title,
        preview: t.preview_url ?? undefined,
        spotify: t.external_urls?.spotify ?? ''
      });
    }

    if (!json.next) break;
    offset += limit;
  }

  cache[id] = { at: now, data: out };
  return new Response(JSON.stringify(out), { headers: { 'Content-Type': 'application/json' } });
};