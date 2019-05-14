const taskInp = document.getElementById('taskInp')
const list = document.getElementById('taskList')
const add = document.getElementById('addTask')

let header = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

function createOption (element, className, txt, func) {
  let btn = document.createElement(element)
  btn.setAttribute('class', className)
  btn.textContent = txt
  btn.addEventListener('click', func)
  return btn
}

function displayTask (task) {
  let newTask = document.createElement('li')
  let taskName = document.createElement('input')
  taskName.value = task.taskname
  taskName.setAttribute('class', 'noEdit')
  taskName.addEventListener('keydown', (e) => {
    // taskName.setAttribute('class', 'editMode')
    // enter(e, editTask)
  })
  taskName.disabled = true

  newTask.appendChild(taskName)
  newTask.append(createOption('button', 'delete', '\u2718', (e) => deleteTask(e)))

  newTask.append(createOption('button', 'complete', task.state === 'active' ? '\u2714' : '\u27F3', (e) => changeState(e)))

  let isNote = task.note !== null
  newTask.append(createOption('button', 'addNote', !isNote ? '\u271A Note' : String.fromCodePoint(128065) + ' Note', editNote))
  if (isNote) {
    let taskNote = document.createElement('textarea')
    taskNote.setAttribute('class', 'noteDone')
    taskNote.value = task.note
    newTask.appendChild(taskNote)
  }

  newTask.append(createOption('button', 'edit', '\u270D', editTask))
  setTimeout(() => (newTask.setAttribute('class', task.state)), 5)
  newTask.setAttribute('id', task.task_id)

  if (list.children.length < 1) list.appendChild(newTask)
  else list.insertBefore(newTask, list.childNodes[0])

  if (task.state !== 'active') {
    newTask.parentNode.querySelector('.edit').disabled = true
    newTask.parentNode.querySelector('.addNote').disabled = true
  }

  taskInp.value = ''
  taskInp.focus()
}

async function deleteTask (e) {
  let id = e.target.parentNode.getAttribute('id')
  console.log(id)
  let res = await fetch('/delete', {
    method: 'POST',
    headers: header,
    body: JSON.stringify({ id: id })
  })
    .catch((err) => console.log(err))
  console.log(res)
  list.removeChild(e.target.parentNode)
}

function editTask () {
  console.log('edit')
}

function editNote () {
  console.log('edit')
}

async function changeState (e) {
  let id = e.target.parentNode.getAttribute('id')
  // let state = e.target.parentNode.getAttribute('class')
  let task = e.target.parentNode
  let isActive = task.getAttribute('class') === 'active'
  let taskState = isActive ? 'inactive' : 'active'

  let result = await fetch('/state', {
    method: 'POST',
    headers: header,
    body: JSON.stringify({ id: id, state: taskState })
  })
  // list.removeChild(e.target.parentNode)
  // console.log(result)
}

async function getTask () {
  const result = await fetch('/getTasks', {
    method: 'GET',
    Headers: header
  })
  const tasks = await result.json()
  for (let i = 0; i < tasks.length; i++) {
    // console.log(tasks[i])
    displayTask(tasks[i])
  }
}

async function addTask (task) {
  let id = await fetch('/add', {
    method: 'POST',
    headers: header,
    body: JSON.stringify(task)
  })
  displayTask({ task_id: id, taskname: task.taskname, state: task.state, note: task.note })
}

function enter (e, f, para = e) {
  if (e.code === 'Enter') {
    f(para)
  }
}

add.addEventListener('click', () => {
  let task = taskInp.value.trim()
  if (task !== '') addTask({ taskname: task, state: 'active', note: null })
})

taskInp.addEventListener('keydown', (e) => {
  let task = e.target.value.trim()
  if (task !== '') enter(e, addTask, { taskname: task, state: 'active', note: null })
})

getTask()
