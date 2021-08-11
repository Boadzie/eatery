<script>
	// import swiper and swiperslide
	import Swiper from 'swiper/esm/svelte/swiper.svelte';
	import SwiperSlide from 'swiper/esm/svelte/swiper-slide.svelte';

	import SwiperCore, { Autoplay, Pagination, Navigation } from 'swiper/core';
  
	import 'swiper/swiper.min.css';
	import 'swiper/components/pagination/pagination.min.css';
	import 'swiper/components/navigation/navigation.min.css';
    SwiperCore.use([Navigation, Autoplay, Pagination, Navigation]);
	const items = [
		{
			image:
				'https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
			text: 'Love this'
		},
		{
			image: 'https://technext.github.io/eatery-new/img/hero_2.jpg',
			text: 'Love this'
		},
		{
			image: 'https://technext.github.io/eatery-new/img/hero_1.jpg',
			text: 'Love this'
		}
	];
</script>

<section class="max-h-screen">
	<Swiper
		loop={true}
		pagination={{ clickable: true }}
		spaceBetween={0}
		slidesPerView={1}
		autoplay={{
			delay: 500,
			disableOnInteraction: false
		}}
		
	
	>
		{#each items as item, i}
			<SwiperSlide >
				<div class="text-center bg-gray-100">
					<div>
						<img
							class="object-cover object-right w-full h-screen bg-gray-900 bg-opacity-75"
							src={item.image}
							alt=""
						/>
						<div
							class="absolute z-50 text-6xl text-white transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
						>
							<h2 class="text-5xl font-bold text-left lg:text-8xl">
								Delicious <span class="tomato">Foods</span>
							</h2>
							<p class="w-full py-3 text-lg font-light text-left lg:font-bold">
								You can easily align form elements in the center using flex property in Tailwind
								CSS. Tailwind uses justify-center and items-center property which is an alternative
								CSS.
							</p>
						</div>
					</div>
				</div>
			</SwiperSlide>
		{/each}
	</Swiper>
</section>

<style>
	
	.tomato {
		color: tomato;
	}
</style>
