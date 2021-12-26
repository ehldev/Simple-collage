<template>
	<button type="button" class="back-button" @click="back()">
		<i class="fas fa-arrow-circle-left"></i>
	</button>
</template>

<script>
	export default {
		props: ['sectionName'],
		methods: {
			back() {
				switch(this.sectionName) {
					case 'layouts':
					this.$emit('change', 'welcome')
					break
					case 'generate-collage':
					this.$emit('change', 'layouts')
					break
					default:
						this.$emit('change', 'welcome')
				}
			}
		}
	}
</script>

<style lang="scss">
@import "../scss/variables.scss";

.back-button {
	background-color: $red;
	color: white;
	display: inline-block;
	width: 30px;
	height: 30px;
	border: none;
	border-radius: 50%;
	cursor: pointer;
	position: absolute;
	top: 1.2rem;
	left: 3rem;
	outline: none;
	transition: box-shadow, transform .5s;

	&:hover {
		box-shadow: 8px 9px 5px -7px rgba(0,0,0,0.21);
		-webkit-box-shadow: 8px 9px 5px -7px rgba(0,0,0,0.21);
		-moz-box-shadow: 8px 9px 5px -7px rgba(0,0,0,0.21);
	}

	&:active {
		transform: scale(1.03);
	}
}
</style>