import Vuex from 'vuex'
import { createLocalVue, shallow } from '@vue/test-utils'
import AddItemFormButtons from '../../components/AddItemFormButtons.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('AddItemFormButtons', () => {
  let wrapper
  let actions
  let store

  beforeEach(() => {
    actions = {
      submit: sinon.spy(),
      cancel: sinon.spy()
    }

    store = new Vuex.Store({
      actions
    })

    wrapper = shallow(AddItemFormButtons, {
      localVue,
      store
    })

  });

  it ('defaults to a hasUserInput of true', () => {
    expect(wrapper.vm.hasUserInput).toBe(true)
  });

  it ('defaults to a isSaving of false', () => {
    expect(wrapper.vm.isSaving).toBe(false)
  });

  it ('displays a loading icon while saving', () => {
    expect(wrapper.html()).toContain('fa-save')
    wrapper.setData({isSaving: true})
    expect(wrapper.html()).toContain('fa-spinner fa-spin')
  });

  it ('emits submitForm when submit is called', () => {
    wrapper.vm.submit()
    expect(wrapper.emitted().submitForm).toBeTruthy();
  });

  it ('emits resetForm when cancel is called', () => {
    wrapper.vm.cancel()
    expect(wrapper.emitted().resetForm).toBeTruthy();
  });

  it ('emits submitForm when save-button is clicked', () => {
    wrapper.find('button.save-button').trigger('click')
    expect(wrapper.emitted().submitForm).toBeTruthy();
  });

  it ('emits resetForm when cancel-button is clicked', () => {
    wrapper.find('button.cancel-button').trigger('click')
    expect(wrapper.emitted().resetForm).toBeTruthy();
  });

});
