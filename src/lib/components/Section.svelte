<script lang="ts">
  export let id = "";
  export let title = "";
  export let subtitle = "";
  // $$restProps is available and may contain a `class` attribute passed from parent
</script>

<section {...$$restProps} id={id} class={"max-w-5xl mx-auto px-4 py-12 border-t border-base-line " + ($$restProps.class ?? "") }>
  <header class="mb-6">
    <h2 class="text-2xl font-semibold">{title}</h2>
    {#if subtitle}<p class="font-semibold">{subtitle}</p>{/if}
  </header>
  <slot />
</section>