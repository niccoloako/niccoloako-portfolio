<script lang="ts">
  import { site } from "$lib/config";
</script>

<footer class="max-w-5xl mx-auto px-4 py-10 border-t border-base-line text-sm text-base-muted">
  <div class="flex items-center justify-between gap-4">
    <span>© {new Date().getFullYear()} {site.name}</span>
    <div class="flex gap-4">
      {#each site.socials as s}
        <a class="underline hover:no-underline" href={s.href} target="_blank">{s.label}</a>
      {/each}
    </div>
  </div>
</footer>