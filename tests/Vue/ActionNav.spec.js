import Vuex from 'vuex'
import ActionNav from '../../resources/assets/js/components/ActionNav.vue'
import { createLocalVue, shallow } from 'vue-test-utils';
const localVue = createLocalVue()
localVue.use(Vuex)

describe('ActionNav', () => {
  let wrapper
  let actions
  let getters
  let store

  let selected = {
    folders: [],
    checklists: [],
    checklistItems: [],
    movable: false,
    deletable: false
  }

  beforeEach(() => {
    actions = {
      clearSelected: sinon.spy(),
      confirmOrDelete: sinon.spy(),
      deleteSelection: sinon.spy(),
      toggleDeletable: sinon.spy(),
      toggleMovable: sinon.spy()
    }

    getters = {
      selected: () => selected
    }

    store = new Vuex.Store({
      actions,
      getters
    })

    wrapper = shallow(ActionNav, {
      localVue,
      store
    })

  });

  it ('defaults to a selected.deletable value of false', () => {
    expect(wrapper.vm.selected.deletable).toBe(false)
  });

  it ('calls clearSelected when clearSelectedButton is clicked', () => {
    wrapper.find('#clear-selected-btn').trigger('click');
      expect(actions.clearSelected.called).toBe(true);
  });

  it ('calls toggleDeletable when confirmOrDeleteButton is clicked and selected.deletable is false', () => {
    wrapper.find('#confirm-or-delete-btn').trigger('click');
    expect(actions.toggleDeletable.called).toBe(true);
    expect(actions.deleteSelection.called).toBe(false);
  });

  it ('calls deleteSelection when confirmOrDeleteButton is clicked and selected.deletable is true', () => {
    wrapper.setComputed({ selected:{deletable: true} })
    wrapper.find('#confirm-or-delete-btn').trigger('click');
    expect(actions.toggleDeletable.called).toBe(false);
    expect(actions.deleteSelection.called).toBe(true);
  });

  it ('calls toggleDeletable when toggleDeleteButton is clicked', () => {
    wrapper.setComputed({ selected:{deletable: true} })
    wrapper.find('#toggle-delete-btn').trigger('click');
      expect(actions.toggleDeletable.called).toBe(true);
  });

  it ('calls toggleMovable when toggleMoveButton is clicked', () => {
    wrapper.find('#toggle-move-btn').trigger('click');
      expect(actions.toggleMovable.called).toBe(true);
  });


});
