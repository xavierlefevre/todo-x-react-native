var api = {
  getLists(){
    var url = `https://reacttodox.firebaseio.com/lists.json`;
    return fetch(url)
      .then((res) => res.json());
  },
  getTodos(listId){
    var url = `https://reacttodox.firebaseio.com/lists/${listId}/todos.json`;
    return fetch(url)
      .then((res) => res.json());
  },
  addList(list){
    var url = `https://reacttodox.firebaseio.com/lists.json`;
    return fetch(url, {
      method:'post',
      body: JSON.stringify(list)
    })
      .then((res) => res.json());
  },
  addTodo(listId, todo){
    var url = `https://reacttodox.firebaseio.com/lists/${listId}/todos.json`
    return fetch(url, {
      method:'post',
      body: JSON.stringify(todo)
    })
      .then((res) => {
        return res.json();
      });
  },
  deleteTodo(listId, todoId){
    var url = `https://reacttodox.firebaseio.com/lists/${listId}/todos/${todoId}.json`
    return fetch(url, {
      method:'delete'
    })
  }
};

module.exports = api;
