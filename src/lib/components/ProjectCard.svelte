<script lang="ts">
  export let name: string;
  export let description: string;
  export let tech: string[] = [];
  export let demo: string | null = null;
  export let code: string | null = null;
</script>

<article class="rounded-2xl border border-base-line bg-base-card p-5 hover:-translate-y-0.5 transition">
  <h3 class="text-lg font-semibold">{name}</h3>
  <p class="mt-2 font-semibold">{description}</p>
  {#if tech.length}
    <ul class="mt-3 flex flex-wrap gap-2 text-xs text-base-muted">
      {#each tech as t}<li class="px-2 py-0.5 rounded border border-base-line">{t}</li>{/each}
    </ul>
  {/if}
  <div class="mt-4 flex gap-3 text-sm">
    {#if demo}<a class="underline hover:no-underline" href={demo} target="_blank">Démo</a>{/if}
    {#if code}<a class="underline hover:no-underline" href={code} target="_blank">Code</a>{/if}
  </div>
</article>