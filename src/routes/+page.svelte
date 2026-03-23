<script lang="ts">
  import { site } from "$lib/config";
  import Header from "$lib/components/Header.svelte";
  import Section from "$lib/components/Section.svelte";
  import ProjectCard from "$lib/components/ProjectCard.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import Story from "$lib/components/Story.svelte";

  let showStory = $state(false);
  console.log("showStory parent:", showStory);
</script>

<Header bind:showStory />

{#if showStory}
  <Story />
{:else}
  <Section id="projets" title="Projets récents" subtitle="Sélection de travaux marquants">
    <div class="grid md:grid-cols-2 gap-6">
      {#each site.projects as p}
        <ProjectCard {...p} />
      {/each}
    </div>
  </Section>

  <Section id="competences" title="Compétences">
    <ul class="grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
      {#each site.skills as s}
        <li class="rounded-xl border border-base-line bg-base-card p-3">{s}</li>
      {/each}
    </ul>
  </Section>

  <Section id="contact" title="Contact" class="font-semibold">
    <p>
      Email: <a class="underline" href={"mailto:"+site.email}>{site.email}</a>
    </p>
  </Section>

  <Footer />
{/if}
