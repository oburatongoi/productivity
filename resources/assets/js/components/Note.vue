<template>
    <div>
        {{note.content}}
    </div>
</template>

<script>
export default {
    name: 'productivity-note',
    props: ['note'],
    data () {
        return {}
    },
    mounted() {
        console.log(note)
    }
}
</script>
