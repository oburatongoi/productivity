<template>
    <ul class="list-unstyled">
        <li v-if="notes" v-for="note in notes">
            <note :note="note"></note>
        </li>
    </ul>
</template>

<script>
import Note from './Note.vue'
export default {
    name: 'productivity-notes',
    props: ['notes'],
    data () {
        return {}
    },
    components: {
        Note
    }
}
</script>
