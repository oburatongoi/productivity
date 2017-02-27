<template lang="html">
  <form class="form-inline search-form">
    <input type="search" class="form-control input-sm" v-model="query" placeholder="Search...">
    <button type="submit" class="btn btn-default btn-sm" v-if="query"><i class="fa fa-search" aria-hidden="true"></i></button>
  </form>
</template>

<script>
export default {
  name: 'search',
  data () {
    return {
      query: undefined
    }
  }
}
</script>

<style lang="css">
</style>
