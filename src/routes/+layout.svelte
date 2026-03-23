<script lang="ts">
  import "../app.css";
  import Nav from "$lib/components/Nav.svelte";
  
  interface LayoutData {
    title?: string;
    description?: string;
  }
  
  export let data: LayoutData;
</script>

<svelte:head>
  <title>{data?.title ?? "Mon Portfolio"}</title>
  <meta name="description" content={data?.description ?? "Portfolio personnel"} />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<div class="min-h-screen bg-base-bg text-base-fg">
  <Nav />
  <slot />
</div>