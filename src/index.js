
// 共享状态 appState 每个人都可以修改它,所有对共享状态的操作都是不可预料的
let appState = {
    title: {
      text: 'React.js 小书',
      color: 'red',
    },
    content: {
      text: 'React.js 小书内容',
      color: 'blue'
    }
}

function stateChanger(state,action){
    switch(action.type){
        case 'UPDATE_TITLE_TEXT':
            return{// 构建新的对象并且返回
                ...state,// 复制 state 里面的内容
                title:{// 用一个新的对象覆盖原来的 title 属性
                    ...state.title, // 复制原来 title 对象里面的内容
                    text:action.text //// 覆盖 text 属性
                }
            }
        case 'UPDATE_TITLE_COLOR':
            return{
                ...state,
                title:{
                    ...state.color,
                    text:action.color
                }
            }
        default:
            return state // 没有修改，返回原来的对象
    }
}

// createStore函数：生产state 和 dispatch 的集合
function createStore(state,stateChanger){
    const listeners = []
    const subscribe = (listener) => listeners.push(listener)
    const getState = () => state
    const dispatch = (action) => {
        // 覆盖原对象
        state = stateChanger(state, action) 
        listeners.forEach((listener) => listener())
    }
    return {getState,dispatch,subscribe}
}

function renderApp (newAppState, oldAppState = {}) { // 防止 oldAppState 没有传入，所以加了默认参数 oldAppState = {}
    if (newAppState === oldAppState) return // 数据没有变化就不渲染了
    console.log('render app...')
    renderTitle(newAppState.title, oldAppState.title)
    renderContent(newAppState.content, oldAppState.content)
}

function renderTitle (newTitle, oldTitle = {}) {
    if (newTitle === oldTitle) return // 数据没有变化就不渲染了
    console.log('render title...')
    const titleDOM = document.getElementById('title')
    titleDOM.innerHTML = newTitle.text
    titleDOM.style.color = newTitle.color
}

function renderContent (newContent, oldContent = {}) {
    if (newContent === oldContent) return // 数据没有变化就不渲染了
    console.log('render content...')
    const contentDOM = document.getElementById('content')
    contentDOM.innerHTML = newContent.text
    contentDOM.style.color = newContent.color
}



const store = createStore(appState, stateChanger)
let oldState = store.getState() // 缓存旧的 state
store.subscribe(() => {
    const newState = store.getState() // 数据可能变化，获取新的 state
    renderApp(newState, oldState) // 把新旧的 state 传进去渲染
    oldState = newState // 渲染完以后，新的 newState 变成了旧的 oldState，等待下一次数据变化重新渲染

}) // 监听数据变化

renderApp(store.getState()) // 首次渲染页面
store.dispatch({ type: 'UPDATE_TITLE_TEXT', text: '《React.js 小书》' }) // 修改标题文本
store.dispatch({ type: 'UPDATE_TITLE_COLOR', color: 'blue' }) // 修改标题颜色
// ...后面不管如何 store.dispatch，都不需要重新调用 renderApp