import { createLocalVue, shallow } from 'vue-test-utils'
import ItemFormMeta from '../../components/ItemFormMeta.vue'

const localVue = createLocalVue()

describe('ItemFormMeta', () => {
  let wrapper
  let label
  let datePlaceholder

  beforeEach(() => {

    wrapper = shallow(ItemFormMeta, {
      localVue,
      propsData: {
        item: { deadline: null }
      }
    })

  });

  it ('displays a placeholder of -- when deadline is null', () => {
    datePlaceholder = wrapper.find('.date')
    expect(datePlaceholder.html()).toContain('---  --')
    wrapper.setProps({ item: { deadline: '2017-12-18' } })
    expect(datePlaceholder.html()).not.toContain('---  --')
    wrapper.setProps({ item: { deadline: null } })
    expect(datePlaceholder.html()).toContain('---  --')
  });

  it ('formats deadline as \'MMM D\' when deadline is set', () => {
    datePlaceholder = wrapper.find('.date')
    wrapper.setProps({ item: { deadline: '2017-12-18' } })
    expect(datePlaceholder.html()).toContain('Dec 18')
  });

  // it ('sets deadline to null when removeDeadline is called', () => {
  //   wrapper.setProps({ item: { deadline: '2017-12-18' } })
  //   wrapper.vm.removeDeadline()
  //   expect(wrapper.vm.item.deadline).toBe(null)
  // });

  it ('emits showDatePicker when showDatePicker is called', () => {
    wrapper.vm.showDatePicker()
    expect(wrapper.emitted().showDatePicker).toBeTruthy();
  });

});
