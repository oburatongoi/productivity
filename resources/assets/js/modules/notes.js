import {
    ADD_NOTE,
    DELETE_NOTE,
    UPDATE_NOTE,
} from '../mutations'

const state = {
    notes: Productivity.notes,
}

const mutations = {
    [ADD_NOTE] (state, note) {
        state.notes.unshift(note)
    },
    [DELETE_NOTE] (state, note) {
        let i = state.notes.indexOf(note);
        state.notes.splice(i,1)
    },
    [UPDATE_NOTE] (state, payload) {
        let i = state.notes.indexOf(payload.note);
        state.notes.splice(i,1,payload.updatedNote)
    },
}

const actions = {
    deleteNote({ commit }, note) {
      return new Promise((resolve, reject) => {

        axios.delete('/productivity/notes/'+ note.id)
        .then(function(response) {
            if (response.data && response.data.note) {
              commit(DELETE_NOTE, note)
              resolve()
            } else {
              reject(response.data.error)
            }
        })
        .catch(function(error) {
            reject(error)
        })

      })
    },
    saveNote({ commit }, note) {
        return new Promise((resolve, reject) => {

          axios.patch('/productivity/notes/'+note.id, note)
          .then(function(response) {
              if (response.data.note) {
                commit(UPDATE_NOTE, {note:note, updatedNote:response.data.note})
                resolve()
              } else {
                reject(response.data.error)
              }
          })
          .catch(function(error) {
              reject(error)
          })

        })

    },
    storeNote({commit}, note) {
        return new Promise((resolve, reject) => {

            axios.post('/productivity/notes', {note: note})
            .then(function(response) {
                if (response.data && response.data.note) {
                    commit(ADD_NOTE, response.data.note)
                    resolve()
                } else {
                    reject(response.data.error)
                }
            })
            .catch(function(error) {
                reject(error)
            })

        })
    },
}

const getters = {
    notes: state => state.notes
}

export default {
    state,
    mutations,
    actions,
    getters
}
