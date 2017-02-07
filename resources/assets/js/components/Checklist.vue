<template>
            <div class="col-md-12">
              <div class="panel">
                <div class="panel-heading">
                  <div class="page-header">
                    <h3>
                      <i class="fa fa-fw fa-list" aria-hidden="true"></i>
                      {{checklist.title}}
                    </h3>
                  </div>
                  <add-item :mode="'add'"></add-item>
                </div>

                <div class="panel-body">
                    <checklist-items></checklist-items>
                </div>
              </div>
          </div>
</template>

<script>
import { mapGetters } from 'vuex'

import ChecklistItems from './ChecklistItems.vue'
import AddItem from './AddItem.vue'

export default {
    name: 'checklist',
    components: {
        ChecklistItems,
        AddItem
    },
    computed: {
      ...mapGetters([
        'checklist'
      ])
    }
}
</script>
