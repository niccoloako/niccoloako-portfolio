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
      {#each site.skills as skill}
        <img src={skill.icon} alt={skill.name} style="transform: scale(0.3);"/>
      {/each}
    </ul>
  </Section>

  <Section id="contact" title="Contact" class="font-semibold">
    <div class="mb-2">
      Email: <a class="underline" href={"mailto:"+site.email}>{site.email}</a>
    </div>
    <div class="mb-2">
      <script type="text/javascript" async src="https://static.zcal.co/embed/v1/embed.js"></script>
      <div class="zcal-inline-widget"><a href="https://zcal.co/i/yoDUVdCJ" style="transform: scale(0.3);">Échange exploratoire Google Meet - 20 min - Schedule a meeting</a></div>
    </div>
    <div class="mb-2">
      <script type="text/javascript" async src="https://static.zcal.co/embed/v1/embed.js"></script>
      <div class="zcal-inline-widget"><a href="https://zcal.co/i/vMc4lQ49" style="transform: scale(0.3);">Échange exploratoire — Télephone - 20 min - Schedule a meeting</a></div>
    </div>
    <div class="mb-2">
      <script type="text/javascript" async src="https://static.zcal.co/embed/v1/embed.js"></script>
      <div class="zcal-inline-widget"><a href="https://zcal.co/i/2mbVywlH" style="transform: scale(0.3);">Entretien technique — 45 min - Schedule a meeting</a></div>
    </div>

  </Section>

  <Footer />
{/if}
