<script>
	// import swiper and swiperslide
	import Swiper from 'swiper/esm/svelte/swiper.svelte';
	import SwiperSlide from 'swiper/esm/svelte/swiper-slide.svelte';

	import SwiperCore, { Autoplay, Pagination, Navigation } from 'swiper/core';

	import 'swiper/swiper.min.css';
	import 'swiper/components/pagination/pagination.min.css';
	import 'swiper/components/navigation/navigation.min.css';

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
		spaceBetween={30}
		slidesPerView={1}
		autoplay={{
			delay: 1000,
			disableOnInteraction: false
		}}
		pagination={true}
		navigation={true}
	>
		{#each items as item, i}
			<SwiperSlide class="py-0">
				<div class="text-center bg-gray-100">
					<div>
						<img
							class="bg-gray-900 bg-opacity-75 h-screen object-cover object-center w-full"
							src={item.image}
							alt=""
						/>
						<div
							class="text-6xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  z-50 text-white"
						>
							<h2 class="text-left lg:text-8xl text-5xl font-bold">
								Delicious <span class="tomato">Foods</span>
							</h2>
							<p class="py-3 text-lg text-left lg:font-bold w-full font-light">
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
