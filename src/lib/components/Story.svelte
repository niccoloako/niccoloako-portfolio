<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { site } from "$lib/config";
  import * as Icon from 'lucide-svelte';

  // ---------- Modèle des stories à partir de ton contenu ----------
  type Story = { id: string; title: string; content: any };
  const stories: Story[] = [
    { id: "intro", title: site.name, content: { type: "about", headline: site.title, text: site.bio } },
    ...site.projects.map((p, idx) => ({
      id: `proj-${idx}`,
      title: `Projet • ${p.name}`,
      content: { type: "project", project: p }
    })),
    { id: "skills",  title: "Compétences", content: { type: "skills",  skills: site.skills } },
    { id: "contact", title: "Contact",     content: { type: "contact", email: site.email, socials: site.socials } }
  ];


  // ---------- État ----------
  let i = 0; // index de la story courante
  $: isFirstStory = i === 0; // pour différencier le premier affichage (sans animation) des suivants (avec animation)
  $: isLastStory = i === stories.length - 1; // pour savoir si on est sur la dernière story (et éviter d’aller plus loin)
  type Track = { title: string; preview?: string; spotify: string };

  let playlist: Track[] = [];                   // pistes récupérées de la playlist Spotify
  let activeSong: Track | null = null;          // piste choisie aléatoirement pour la story actuelle
  let isPlaying = false;

  let audioEl: HTMLAudioElement | null = null;  // pour lecture preview MP3 (30s Spotify si dispo)

  // ---------- Utils ----------
  function toSpotifyEmbedTrack(url: string) {
    try {
      const u = new URL(url);
      const parts = u.pathname.split("/").filter(Boolean); // ["track","ID"]
      if (parts[0] === "track" && parts[1]) {
        return `https://open.spotify.com/embed/track/${parts[1]}?autoplay=1`;
      }
      return "";
    } catch {
      return "";
    }
  }

  function pickRandomSong(): Track | null {
    if (!playlist?.length) return null;
    const idx = Math.floor(Math.random() * playlist.length);
    return playlist[idx];
  }

  async function loadPlaylist() {
    // Nécessite l’endpoint serveur /api/spotify/tracks et les creds dans .env
    // SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET
    const url = `/api/spotify/tracks?playlist=${encodeURIComponent(site.spotifyPlaylistUrl)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Impossible de charger la playlist Spotify");
    playlist = await res.json();
  }

  async function setSongForCurrentStory() {
    activeSong = pickRandomSong();
    isPlaying = false;

    // Autoplay fiable si la piste possède un preview MP3 (30 secondes)
    if (audioEl && activeSong?.preview) {
      try {
        await audioEl.play();
        isPlaying = true;
      } catch {
        // Autoplay bloqué par le navigateur : l’utilisateur pourra cliquer ▶️
      }
    }
  }

  // ---------- Navigation ----------
  function next() {
    i = Math.min(i + 1, stories.length - 1);
    console.log("is Last story:", isLastStory);
    if(!isLastStory){
        setSongForCurrentStory();
    }

  }
  function prev() {
    i = Math.max(i - 1, 0);
    console.log("is First story:", isFirstStory);
    if(!isFirstStory){
        setSongForCurrentStory();
    }

  }

  function onKey(e: KeyboardEvent) {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
    if (e.key === "Escape") history.back();
  }

  // Lance manuellement la musique (si preview dispo)
  function manualPlay() {
    if (audioEl && activeSong?.preview) {
      audioEl.play().then(() => (isPlaying = true)).catch(() => {});
    }
    // Si pas de preview (piste uniquement Spotify), on compte sur le ▶️ de l’embed (caché ou visible selon ton layout).
  }

  // ---------- Cycle de vie ----------
  onMount(async () => {
    window.addEventListener("keydown", onKey);
    try {
      await loadPlaylist();
    } catch (err) {
      // Playlist non accessible : on laisse activeSong à null, le pill n'apparaîtra pas.
      console.error(err);
    }
    await setSongForCurrentStory();
  });

  onDestroy(() => {
    window.removeEventListener("keydown", onKey);
  });

  // ---------- Exports pour le markup (si besoin ailleurs) ----------
  export { stories, i, next, prev, activeSong, audioEl, manualPlay, toSpotifyEmbedTrack };
</script>






<!-- Zone centrale : la story -->
<div class="h-full flex items-center justify-center px-6">

  <div class="max-w-[820px] w-full aspect-[9/16] md:aspect-[10/16] rounded-3xl border border-base-line bg-base-card/40
           backdrop-blur-md p-6 relative overflow-hidden">
    <!-- Indicateurs style stories (pas d’animation, juste l’état) -->
    <div class="absolute top-0 left-0 right-0 px-3 pt-3 z-30">
        <div class="flex gap-1">
            {#each stories as s, idx}
                <div class="h-1 rounded bg-base-card flex-1 overflow-hidden">
                    <div
                    class={"h-full " + (idx === i ? "bg-white/80" : idx < i ? "bg-white/40" : "bg-white/15")}
                    style="width:100%"></div>
                </div>
            {/each}
        </div>
    </div>
     <!-- Header haut-gauche : nom + profession (sans lecteur) -->
    <div class="top-3 left-3 z-30">
        <div class="px-3 py-2 rounded-xl border border-base-line bg-base-card/60 backdrop-blur-md">
            <div class="font-bold">{site.name}</div>
            <div class="text-sm text-base-muted">{site.title}</div>
                <!-- PILL chanson (bas-centre) : titre aléatoire + bouton ▶️ -->
                {#if activeSong}
                    <div class="flex gap-3 py-2 backdrop-blur-md">
                        <button
                            aria-label="Play"
                            class="h-8 w-8 rounded-full border border-base-line bg-white/10 hover:bg-white/20 flex items-center justify-center"><Icon.AudioLines /></button>
                        <div class="text-sm">
                            <div class="font-semibold">Track</div>
                            <div class="text-base-fg/80">{activeSong.title}</div>
                        </div>
                    </div>
                {/if}
        </div>
    </div>
    <!-- Boutons invisibles gauche/droite (click = prev/next) -->
    <button class="absolute inset-y-0 left-0 w-1/3 z-20" aria-label="Précédent" on:click={prev}></button>
    <button class="absolute inset-y-0 right-0 w-1/3 z-20" aria-label="Suivant" on:click={next}></button>

    <!-- Contenu -->
    {#if stories[i].content.type === "about"}
      <div class="h-full flex flex-col items-center justify-center text-center px-4">
        <h2 class="text-3xl font-extrabold mb-3">{site.name}</h2>
        <p class="text-base-muted">{stories[i].content.headline}</p>
        <p class="mt-4 leading-relaxed opacity-90">{stories[i].content.text}</p>
      </div>
    {:else if stories[i].content.type === "project"}
      {#key stories[i].id}
        <div class="h-full flex flex-col items-center justify-center text-center gap-4 px-6">
          <h3 class="text-2xl font-bold">{stories[i].content.project.name}</h3>
          <p class="text-base-muted">{stories[i].content.project.description}</p>
          {#if stories[i].content.project.tech?.length}
            <div class="flex flex-wrap gap-2 justify-center">
              {#each stories[i].content.project.tech as t}
                <span class="px-2 py-0.5 text-xs rounded border border-base-line bg-base-card/60">{t}</span>
              {/each}
            </div>
          {/if}
          <div class="flex gap-4 mt-2 text-sm">
            {#if stories[i].content.project.demo}
              <a class="underline hover:no-underline" href={stories[i].content.project.demo} target="_blank">Démo</a>
            {/if}
            {#if stories[i].content.project.code}
              <a class="underline hover:no-underline" href={stories[i].content.project.code} target="_blank">Code</a>
            {/if}
          </div>
        </div>
      {/key}
    {:else if stories[i].content.type === "skills"}
      <div class="h-full flex flex-col items-center justify-center px-6 text-center">
        <h3 class="text-2xl font-bold mb-4">Compétences</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full">
          {#each stories[i].content.skills as s}
            <div class="py-2 rounded-xl border border-base-line bg-base-card/60">{s}</div>
          {/each}
        </div>
      </div>
    {:else if stories[i].content.type === "contact"}
      <div class="h-full flex flex-col items-center justify-center gap-3 text-center">
        <h3 class="text-2xl font-bold">Me contacter</h3>
        <a class="underline hover:no-underline" href={"mailto:" + stories[i].content.email}>
          {stories[i].content.email}
        </a>
        <div class="flex gap-4 text-sm">
          {#each stories[i].content.socials as s}
            <a class="underline hover:no-underline" href={s.href} target="_blank">{s.label}</a>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Players discrets -->
    {#if activeSong?.preview}
      <audio bind:this={audioEl} src={activeSong.preview} preload="auto"></audio>
    {:else if activeSong?.spotify}
      <iframe
        class="hidden"
        src={toSpotifyEmbedTrack(activeSong.spotify)}
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
        loading="lazy"
        title="Spotify"
      ></iframe>
    {/if}
  </div>
</div>