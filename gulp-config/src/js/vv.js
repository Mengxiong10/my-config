var vm = new Vue({
  el:'#app',
  data:{
    name:'kaka'
  },
  methods:{
    test() {
      this.name = this.name + 1
    }
  },
  render(h) {
    return h(
      'div',
      [
        h(
          'button',
          {
            on:{
              click:this.test
            }
          },
          'test'
        ),
        h('p',this.name)
      ]
    )
  }
})