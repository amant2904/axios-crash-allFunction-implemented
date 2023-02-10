// AXIOS GLOBALS (common in everything)
axios.defaults.headers.common['x-Auth-Token'] = 'Sometoken';

// GET REQUEST
function getTodos() {
  let config = {
    method: "GET",
    params: {
      _limit: 5,
    },
    timeout: 5000
  }
  axios("https://jsonplaceholder.typicode.com/todos", config)
    .then(res => showOutput(res))
    .catch(err => console.log(err));
}

// POST REQUEST
function addTodo() {
  axios({
    method: "post",
    url: "https://jsonplaceholder.typicode.com/todos",
    data: {
      title: "new todo",
      completed: "false"
    }
  }).then(res => showOutput(res))
    .catch(err => console.log(err));
}

// PUT/PATCH REQUEST
function updateTodo() {
  // PUT REQUEST :- 

  //   axios({
  //     method: "PUT",
  //     url: "https://jsonplaceholder.typicode.com/todos/1",
  //     data: {
  //       title: "updated todo",
  //       completed: "true"
  //     }
  //   }).then(res => showOutput(res))
  //     .catch(err => console.log(err));

  // PATCH REQUEST :-

  axios({
    method: "PATCH",
    url: "https://jsonplaceholder.typicode.com/todos/1",
    data: {
      title: "Patched ToDo",
      completed: "false",
      isEmpty: "No"
    }
  }).then(res => showOutput(res))
    .catch(err => console.log(err));
}

// DELETE REQUEST
function removeTodo() {
  axios({
    method: "delete",
    url: "https://jsonplaceholder.typicode.com/todos/2"
  }).then(res => showOutput(res))
    .catch(err => console.log(err));
}

// SIMULTANEOUS DATA
function getData() {
  axios.all([axios({
    method: "get",
    url: "https://jsonplaceholder.typicode.com/todos?_limit=5"
  }), axios({
    method: "get",
    url: "https://jsonplaceholder.typicode.com/todos/2"
  })])
    // .then(res => {
    //   showOutput(res[0]);
    //   showOutput(res[1]);
    // })
    .then(axios.spread((todos1, todos2) => showOutput(todos1)))
    .catch(err => console.log(err));
}

// CUSTOM HEADERS
function customHeaders() {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'someToken'
    }
  }
  axios.post("https://jsonplaceholder.typicode.com/todos", {
    title: "custom headers req",
    completed: false
  }, config)
    .then(res => showOutput(res))
    .catch(err => console.log(err));
}

// TRANSFORMING REQUESTS & RESPONSES
function transformResponse() {
  const options = {
    method: 'post',
    url: "https://jsonplaceholder.typicode.com/todos",
    data: {
      title: "hello world"
    },
    transformResponse: axios.defaults.transformResponse.concat(data => {
      data.title = data.title.toUpperCase();
      return data;
    })
  }
  axios(options).then(res => showOutput(res));
}

// ERROR HANDLING
function errorHandling() {
  axios.get("https://jsonplaceholder.typicode.com/todoss")
    .then(res => showOutput(res))
    .catch(err => {
      // console.log(err.data);
      // console.log(err.status);
      // console.log(err.headers);
      if (err.response) {
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
      }
      else if (err.request) {
        console.error(err.request);
      }
      else {
        console.error(e);
      }
    })
}

// CANCEL TOKEN
function cancelToken() {
  const source = axios.CancelToken.source();

  axios
    .get("https://jsonplaceholder.typicode.com/todos", {
      cancelToken: source.token
    })
    .then(res => showOutput(res))
    .catch(thrown => {
      if (axios.isCancel(thrown)) {
        console.log('request canceled', thrown.message);
      }
    });
  if (true) {
    source.cancel(' - this request canceled');
  }
}

// INTERCEPTING REQUESTS & RESPONSES
axios.interceptors.request.use(config => {
  console.log(`${config.method.toUpperCase()} request sent to ${config.url} at ${new Date().getTime()}`)
  return config;
}, error => {
  return Promise.reject(error);
})

// AXIOS INSTANCES
// const axiosInstance = axios.create({
//   baseURL: 'https://jsonplaceholder.typicode.com'
// })

// axiosInstance.get('/comments').then(res => showOutput(res))
//   .catch(err => console.log(err));

// Show output in browser
function showOutput(res) {
  document.getElementById('res').innerHTML = `
  <div class="card card-body mb-4">
    <h5>Status: ${res.status}</h5>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Headers
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.headers, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Data
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.data, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Config
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.config, null, 2)}</pre>
    </div>
  </div>
`;
}

// Event listeners
document.getElementById('get').addEventListener('click', getTodos);
document.getElementById('post').addEventListener('click', addTodo);
document.getElementById('update').addEventListener('click', updateTodo);
document.getElementById('delete').addEventListener('click', removeTodo);
document.getElementById('sim').addEventListener('click', getData);
document.getElementById('headers').addEventListener('click', customHeaders);
document
  .getElementById('transform')
  .addEventListener('click', transformResponse);
document.getElementById('error').addEventListener('click', errorHandling);
document.getElementById('cancel').addEventListener('click', cancelToken);
