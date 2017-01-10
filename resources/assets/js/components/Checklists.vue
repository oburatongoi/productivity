<template>
    <ul>
        <li v-if="checklists" v-for="checklist in checklists">
            <checklist :checklist="checklist"></checklist>
        </li>
    </ul>
</template>

<script>
import Checklist from './Checklist.vue'
export default {
    name: 'productivity-checklists',
    props: ['checklists'],
    data () {
        return {}
    },
    components: {
        Checklist
    }
}
</script>
