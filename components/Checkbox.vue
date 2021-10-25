<script>
export default {
    name: 'Checkbox',
    props: {
        label: {
            label: {
                type: String,
                default: ''
            }
        },
        value: {
            type: Boolean, 
            default: false 
        }
    },
    methods: {
        onChange (event) {
            this.$emit('input', event.target.checked)
        }
    }
}
</script>

<template>
    <div>
        <label>
    </div>
</template>