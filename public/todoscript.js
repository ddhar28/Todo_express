const taskInp = document.getElementById('taskInp')
const list = document.getElementById('taskList')
const add = document.getElementById('addTask')
let fetch = window.fetch()

let taskObj = {
  method: 'POST', // *GET, POST, PUT, DELETE, etc.
  //   mode: 'cors', // no-cors, cors, *same-origin
  //   cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
  //   credentials: 'same-origin', // include, *same-origin, omit
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   redirect: 'follow', // manual, *follow, error
  //   referrer: 'no-referrer', // no-referrer, *client
  body: ''
}

add.addEventListener('click', () => {
  let task = taskInp.value.trim()
  if (task !== '') addTask(task)
})

function addTask (task) {
  taskObj.body = task
  console.log('from fetch', taskObj)
  return fetch('/', taskObj)
    .catch((err) => {
      console.log(err)
    })
}
