<template lang="html">
  <div class="home">
    <h3 class="priority-label priority-label-important">Important</h3>
    <h3 class="priority-label priority-label-not-important">Not Important</h3>
    <h3 class="priority-label priority-label-urgent">Urgent</h3>
    <h3 class="priority-label priority-label-not-urgent">Not Urgent</h3>
    <div class="wraps-split">
      <div class="important">

        <div class="urgent">
          <i class="fa fa-expand toggle-size" aria-hidden="true"></i>
          # Important and Urgent
        </div>

        <div class="not-urgent">
          <i class="fa fa-expand toggle-size" aria-hidden="true"></i>
          # Important and not Urgent
        </div>
      </div>

      <div class="not-important">
        <div class="urgent">
          <i class="fa fa-expand toggle-size" aria-hidden="true"></i>
          # Not important and urgent
        </div>

        <div class="not-urgent">
          <i class="fa fa-expand toggle-size" aria-hidden="true"></i>
          # Not important and not urgent
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'home',
  // mounted: function() {
  //   Split(['#important', '#not-important'], {
  //     sizes: [60,40],
  //     direction: 'horizontal'
  //   })
  //
  //   Split(['#important-urgent', '#important-not-urgent'], {
  //     sizes: [60,40],
  //     direction: 'vertical'
  //   })
  //
  //   Split(['#not-important-urgent', '#not-important-not-urgent'], {
  //     sizes: [60,40],
  //     direction: 'vertical'
  //   })
  // }

}
</script>

<style lang="css">

</style>
