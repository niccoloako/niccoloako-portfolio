<script lang="ts">
  import { site } from "$lib/config";

  export let showStory: boolean;
</script>

<section class="flex flex-col items-center justify-center text-center m-0 p-4">
  <div class="max-w-3xl px-4">
    <div class="flex flex-col md:flex-row items-center md:items-center md:justify-center gap-4 md:gap-8">
      <!-- svelte-ignore event_directive_deprecated -->
      <button onclick={() => { showStory = !showStory; console.log(showStory); }} aria-label="Voir ma story">
          <!-- svelte-ignore a11y_missing_attribute -->
          <img src="/niccoloako_imagepic.jpg"
          class="h-28 w-28 md:h-32 md:w-32 rounded-full object-cover select-none cursor-pointer transition
              hover:scale-[1.02] focus:scale-[1.02] outline-none"
          style="box-shadow: 0 0 0 3px color-mix(in oklab, {site.accent} 35%, transparent);"/>
      </button>
      <div class="flex flex-col items-center md:items-start">
        <h1 class="text-5xl md:text-6xl font-extrabold leading-tight mb-2 md:mb-0">
          {site.name}
        </h1>
        <p class="text-lg opacity-90">{site.title}</p>
      </div>
    </div>
    <p class="font-semibold mt-4">{site.bio}</p>
    <div class="mt-8 flex flex-wrap justify-center gap-4">
      <a href="#projets"
        class="px-5 py-2 rounded-lg border border-base-line hover:bg-white/10 transition"
        style="box-shadow: 0 0 0 2px color-mix(in oklab, {site.accent} 35%, transparent);">
        Voir mes projets
      </a>
      <a href="#contact"
        class="px-5 py-2 rounded-lg border border-base-line hover:bg-white/10 transition">
        Me contacter
      </a>
    </div>
  </div>
</section>

<style>
h1 {
  align-self: right;
}

img {
  box-shadow: 0 0 0 3px color-mix(in oklab, var(--accent) 35%, transparent);
  transition: transform 0.2s ease-in-out;
}
</style>