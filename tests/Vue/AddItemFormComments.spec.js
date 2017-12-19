import { createLocalVue, shallow } from 'vue-test-utils'
import AddItemFormComments from '../../resources/assets/js/components/AddItemFormComments.vue'

const localVue = createLocalVue()

describe('AddItemFormComments', () => {
  let wrapper
  let label
  let textarea

  beforeEach(() => {

    wrapper = shallow(AddItemFormComments, {
      localVue,
      propsData: {
        item: { comments: null }
      }
    })

  });

  it ('returns hasComments value of true only when item.comments is not null', () => {
    expect(wrapper.vm.hasComments).toBe(false)
    wrapper.setProps({ item: { comments: 'not null' } })
    expect(wrapper.vm.hasComments).toBe(true)
    wrapper.setProps({ item: { comments: null } })
    expect(wrapper.vm.hasComments).toBe(false)
  });

  it ('displays preview comments button when showComments is false and hasComments is true', () => {
    wrapper.setData({ showComments: false })
    wrapper.setProps({ item: { comments: 'not null' } })
    label = wrapper.find('div.comments-label')
    expect(label.html()).toContain('Preview Comments')
  });

  it ('displays quick add comments button when showComments is false and hasComments is false', () => {
    wrapper.setData({ showComments: false })
    label = wrapper.find('div.comments-label')
    expect(label.html()).toContain('Quick Add Comments')
  });

  it ('displays hide comments button when showComments is true and hasComments is true', () => {
    wrapper.setData({ showComments: true })
    wrapper.setProps({ item: { comments: 'not null' } })
    label = wrapper.find('div.comments-label')
    expect(label.html()).toContain('Hide Comments')
  });

  it ('displays cancel button when showComments is true and hasComments is false', () => {
    wrapper.setData({ showComments: true })
    label = wrapper.find('div.comments-label')
    expect(label.html()).toContain('Cancel')
  });

  it ('calls saveChanges when textarea change.keyup.blur.delete event is fired', () => {
    wrapper.setData({ showComments: true })
    textarea = wrapper.find('textarea')
    textarea.trigger('change.keyup.blur.delete')
    expect(wrapper.emitted().saveChanges).toBeTruthy();
  });

  it ('calls saveChanges when textarea change event is fired', () => {
    wrapper.setData({ showComments: true })
    textarea = wrapper.find('textarea')
    textarea.trigger('change')
    expect(wrapper.emitted().saveChanges).toBeTruthy();
  });

  it ('toggles comments when toggleComments is called', () => {
    expect(wrapper.vm.showComments).toBe(false)
    wrapper.vm.toggleComments()
    expect(wrapper.vm.showComments).toBe(true)
  });

  it ('emits saveChanges when saveChanges is called', () => {
    wrapper.vm.saveChanges()
    expect(wrapper.emitted().saveChanges).toBeTruthy();
  });

});
