import {
    ADD_NOTICE,
    DELETE_NOTICE
} from '../mutations'

const namespaced = true;

const state = {
    notices: [
      // {
      //   type: 'success',
      //   heading: 'Notice',
      //   message: 'Your new list has been successfuly saved',
      //   rawHTML: '<p>This is an <a href="#">example</a> paragraph</p>',
      //   persist: true,
      //   buttons: [
      //     {
      //       id: _.uniqueId()
      //       text: 'close',
      //       class: 'btn-xs btn-default',
      //       action: 'this.deleteNotice'
      //     },
      //     {
      //       id: _.uniqueId()
      //       text: 'cancel',
      //       class: 'btn-xs btn-primary',
      //       action: 'this.deleteNotice'
      //     }
      //   ],
      //   data: []
      // }
    ]
}

const mutations = {
    [ADD_NOTICE] (state, payload) {
        state.notices.unshift(payload)
    },
    [DELETE_NOTICE] (state, payload) {
      var i = _.findIndex(state.notices, payload);
      state.notices.splice(i,1)
    }
}

const actions = {
    addNotice({ commit }, payload) {
      return new Promise((resolve, reject) => {
          if (!payload.id) payload.id = _.uniqueId()
          commit(ADD_NOTICE, payload)

          if(!payload.persist) setTimeout(function() {
            commit(DELETE_NOTICE, payload)
          }, 5000);

          resolve(payload)
      })
    },
    deleteNotice({ commit }, payload) {
      return new Promise((resolve, reject) => {
          commit(DELETE_NOTICE, payload)
          resolve(payload)
      })
    }
}

const getters = {
    notices: state => state.notices,
}

export default {
    state,
    mutations,
    actions,
    getters
}
