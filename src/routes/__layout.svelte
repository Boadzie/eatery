<script>
	
	import '../app.postcss';
	import Nav from '$lib/Nav.svelte';
	import Footer from '$lib/Footer.svelte';


</script>

<Nav />
<main>
	<slot />
</main>
<Footer/>
<style>
	:global(body, html) {
		scroll-behavior: smooth;
		font-family: 'Raleway', sans-serif;
	}


</style>
