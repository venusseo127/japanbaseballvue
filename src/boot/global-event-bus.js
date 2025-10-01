import { boot } from 'quasar/wrappers'
import emitter from 'tiny-emitter/instance'

export default boot(({ app }) => {
  app.config.globalProperties.$global = {
    $on: (...args) => emitter.on(...args),
    $once: (...args) => emitter.once(...args),
    $off: (...args) => emitter.off(...args),
    $emit: (...args) => emitter.emit(...args)
  }
})
