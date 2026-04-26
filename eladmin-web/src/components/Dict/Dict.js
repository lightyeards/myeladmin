import { reactive } from 'vue'
import { get as getDictDetail } from '@/api/system/dictDetail'

export default class Dict {
  constructor(dict) {
    this.dict = dict
  }

  async init(names, completeCallback) {
    if (names === undefined || names === null) {
      throw new Error('need Dict names')
    }
    const ps = []
    names.forEach(n => {
      this.dict.dict[n] = reactive({})
      this.dict.label[n] = reactive({})
      this.dict[n] = []
      ps.push(getDictDetail(n).then(data => {
        this.dict[n].splice(0, 0, ...data.content)
        data.content.forEach(d => {
          this.dict.dict[n][d.value] = d
          this.dict.label[n][d.value] = d.label
        })
      }))
    })
    await Promise.all(ps)
    completeCallback()
  }
}
