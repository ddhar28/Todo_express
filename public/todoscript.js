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
    taskName.setAttribute('class', 'editMode')
    enter(e, editTask)
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
  const id = e.target.parentNode.getAttribute('id')
  console.log('id', id)
  await fetch('/delete', {
    method: 'POST',
    headers: header,
    body: JSON.stringify({ id: id })
  })
  list.removeChild(e.target.parentNode)
}

async function editTask (e) {
  let editBox = e.target.parentNode.firstChild
  let id = e.target.parentNode.getAttribute('id')
  let isEdit = editBox.getAttribute('class') === 'editMode'
  if (editBox.value === '') editBox.value = 'Untitled'

  if (isEdit) {
    await fetch('/edit', {
      method: 'POST',
      headers: header,
      body: JSON.stringify({ id: id, name: editBox.value })
    })
  }

  editBox.setAttribute('class', isEdit ? 'noEdit' : 'editMode')
  editBox.parentNode.querySelector('.complete').disabled = !isEdit
  editBox.parentNode.querySelector('.delete').disabled = !isEdit
  editBox.parentNode.querySelector('.edit').textContent = isEdit ? '\u270D' : 'Ok'
  editBox.disabled = isEdit
  if (isEdit) taskInp.focus()
  else editBox.focus()
}

async function editNote (e) {
  let id = e.target.parentNode.getAttribute('id')
  let noNote = e.target.textContent === '\u271A Note'
  let noteBox = noNote ? document.createElement('textarea') : e.target.parentNode.querySelector('textarea')
  if (noNote) noteBox.setAttribute('class', 'noteDone')
  let isEditable = noteBox.getAttribute('class') === 'noteEdit'
  if (!isEditable) e.target.parentNode.appendChild(noteBox)
  let noVal = noteBox.value.trim() === ''
  const note = noVal ? null : noteBox.value.trim()

  if (isEditable) {
    await fetch('/note', {
      method: 'POST',
      headers: header,
      body: JSON.stringify({ id: id, note: note })
    })
  }

  if (isEditable) taskInp.focus()
  noteBox.setAttribute('class', isEditable ? 'noteDone' : 'noteEdit')
  noteBox.parentNode.querySelector('.complete').disabled = !isEditable
  noteBox.parentNode.querySelector('.delete').disabled = !isEditable
  e.target.parentNode.style.height = isEditable ? '30px' : '150px'
  if (isEditable && noVal) noteBox.parentNode.removeChild(noteBox)
  e.target.textContent = (isEditable ? (noVal ? '\u271A Note' : String.fromCodePoint(128065) + ' Note') : 'Done')
  noteBox.focus()
}

async function changeState (e) {
  let id = e.target.parentNode.getAttribute('id')
  let task = e.target.parentNode
  let isActive = task.getAttribute('class') === 'active'
  let taskState = isActive ? 'inactive' : 'active'

  await fetch('/state', {
    method: 'POST',
    headers: header,
    body: JSON.stringify({ id: id, state: taskState })
  })

  setTimeout(() => (task.setAttribute('class', taskState)), 50)
  task.querySelector('.edit').disabled = isActive
  task.querySelector('.addNote').disabled = isActive
  e.target.textContent = isActive ? '\u27F3' : '\u2714'

  if (isActive) list.insertBefore(task, list.lastChild.nextSibling)
  else list.insertBefore(task, list.firstChild)

  taskInp.focus()
}

async function getTask () {
  const result = await fetch('/getTasks', {
    method: 'GET',
    Headers: header
  })
  const tasks = await result.json()
  for (let i = 0; i < tasks.length; i++) {
    displayTask(tasks[i])
  }
}

async function addTask (task) {
  const res = await fetch('/add', {
    method: 'POST',
    headers: header,
    body: JSON.stringify(task)
  })
  let id = await res.json()
  id = id.task_id
  console.log(id)
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
