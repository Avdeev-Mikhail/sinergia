<template>
	<div style="z-index: 200000000 !important;" class="modal fade" :id="id + 'Modal'" tabindex="-1" :aria-labelledby="id" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" :id="id + 'ModalTitle'">{{ title }}</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<form method="POST" @submit="formSubmit" novalidate="">
					<div class="modal-body">
						<slot></slot>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
						<button type="submit" class="btn btn-success" data-bs-dismiss="modal">{{ button }}</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			title: String,
			id: String,
			button: String,
		},
		methods: {
			formSubmit: function(e){
				e.preventDefault();
				this.$emit("formSubmit");
			}
		}
	}
</script>