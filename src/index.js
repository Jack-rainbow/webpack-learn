import { start } from './timer'
import { message } from './foo'

var current = 0
if (module.hot && module.hot.data) {
  current = module.hot.data.current
}
var root = document.getElementById('root')
var stop = start(onUpdate, current)

console.log(message)

function onUpdate(i) {
  current = i
  root.textContent = '#' + i // 修改数值渲染
  console.log(module, 'module')
}

if (module.hot) {
  module.hot
    .accept
    // {
    // dependencies, // 可以是一个字符串或字符串数组
    // callback // 用于在模块更新后触发的函数
    // errorHandler // 在计算新版本时处理错误的函数
    // }
    ()

  // 添加一个处理函数，在当前模块代码被替换时执行
  module.hot.dispose((data) => {
    data.current = current
    stop()
  })

  // module.hot.accept 热更新只会更新对应的模块，并不会刷新整个页面。
  // 使用更新过的 library 模块执行某些操作..
  module.hot.accept('./timer', function () {
    stop()
    stop = start(onUpdate, current)
  })
  //不更新的文件
  module.hot.decline('./foo')

  //注册一个函数来监听 status的变化。
  module.hot.addStatusHandler((status) => {
    // 响应当前状态……
    console.log(status, 'status')
  })
}