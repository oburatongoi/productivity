import {
    ADD_GOAL,
    DELETE_GOAL,
    UPDATE_GOAL,
} from '../mutations'

const state = {
    goals: Productivity.goals,
}

const mutations = {
    [ADD_GOAL] (state, goal) {
        state.goals.unshift(goal)
    },
    [DELETE_GOAL] (state, goal) {
        let i = state.goals.indexOf(goal);
        state.goals.splice(i,1)
    },
    [UPDATE_GOAL] (state, payload) {
        let i = state.goals.indexOf(payload.goal);
        state.goals.splice(i,1,payload.updatedGoal)
    },
}

const actions = {
    deleteGoal({ commit }, goal) {
      return new Promise((resolve, reject) => {
        Vue.http.delete('/productivity/goals/'+ goal.id).then((response) => {

          if (response.data && response.data.goal) {
            commit(DELETE_GOAL, goal)
            resolve()
          } else {
            reject()
          }

        }, (response) => {
          console.log(response);
          reject()
        })
      })
    },
    saveGoal({ commit }, goal) {
        return new Promise((resolve, reject) => {

          Vue.http.patch('/productivity/goals/'+goal.id, goal).then(
            (response) => {
              if (response.data.goal) {
                commit(UPDATE_GOAL, {goal:goal, updatedGoal:response.data.goal})
                resolve()
              } else {
                reject()
              }
            },
            (response) => {
              reject()
            }
          )

        })

    },
    storeGoal({commit}, goal) {
        return new Promise((resolve, reject) => {
            Vue.http.post('/productivity/goals', {goal: goal}).then(
                (response) => {
                    if (response.data && response.data.goal) {
                        commit(ADD_GOAL, response.data.goal)
                        resolve()
                    } else {
                        reject()
                    }
                },
                (response) => {
                    reject()
                }
            )
        })
    },
}

const getters = {
    goals: state => state.goals
}

export default {
    state,
    mutations,
    actions,
    getters
}