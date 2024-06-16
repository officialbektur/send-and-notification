<template>
	<Content></Content>
	<Alert></Alert>
</template>

<script>
	import Content from './includes/Content/Content.vue';
	import Alert from './includes/Alert/Alert.vue';

	export default {
		name: 'Notifications',
		data() {
			return {};
		},
		mounted() {},
		updated() {},
		methods: {},
		computed: {},
		components: {
			Content,
			Alert,
		},
	};
</script>
