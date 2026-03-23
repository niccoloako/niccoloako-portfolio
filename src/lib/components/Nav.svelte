<script lang="ts">
  import { page } from "$app/stores";
  import { site } from "$lib/config";
  const links = [
    { href: "#projets", label: "Projets" },
    { href: "#competences", label: "Compétences" },
    { href: "#contact", label: "Contact" }
  ];
</script>

<header class="sticky top-0 z-20 backdrop-blur-sm bg-base-bg/70 border-b border-base-line">
  <nav class="max-w-5xl mx-auto px-4 h-14 flex items-center justify-center">
    <ul class="flex gap-6 text-sm uppercase tracking-wider">
      {#each links as l}
        {#if $page.url.hash === l.href}
          <li>
            <a href={l.href} class="pb-1 border-b-2 border-red-500 transition-opacity">{l.label}</a>
          </li>
        {:else}
          <li>
            <a href={l.href} class="pb-1 border-b-2 border-transparent hover:opacity-80 hover:border-red-500 transition-all">{l.label}</a>
          </li>
        {/if}
      {/each}
    </ul>
  </nav>
</header>
