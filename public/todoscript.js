const taskInp = document.getElementById('taskInp')
const list = document.getElementById('taskList')
const add = document.getElementById('addTask')

let taskObj = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: ''
}

add.addEventListener('click', () => {
  let task = taskInp.value.trim()
  if (task !== '') addTask(task)
})

function addTask (task) {
  taskObj.body = JSON.stringify([task])
  console.log('from fetch', taskObj)
  fetch('/', taskObj)
    .catch((err) => {
      console.log(err)
    })
}
