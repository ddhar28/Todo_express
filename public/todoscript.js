const taskInp = document.getElementById('taskInp')
const list = document.getElementById('taskList')
const add = document.getElementById('addTask')

let header = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

function displayTask () {
  fetch('/getTasks', {
    method: 'GET',
    Headers: header
  })
    .then((res) => {
      return res.json()
    })
    .then(function (result) {
      console.log(result)
    })
    .catch((err) => {
      console.log(err)
    })
  // taskObj.method = 'POST'
}

add.addEventListener('click', () => {
  let task = taskInp.value.trim()
  if (task !== '') addTask(task)
})

function addTask (task) {
  const data = JSON.stringify([task])
  console.log('from fetch', data)
  fetch('/', {
    method: 'POST',
    headers: header,
    body: data
  })
    .catch((err) => {
      console.log(err)
    })
  // delete taskObj.body
}

displayTask()
