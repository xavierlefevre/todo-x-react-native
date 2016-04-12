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
  updateTodos(listId, todos){
    var url = `https://reacttodox.firebaseio.com/lists/${listId}/todos.json`
    return fetch(url, {
      method:'put',
      body: JSON.stringify(todos)
    })
      .then((res) => {
        return res.json();
      });
  }
};

module.exports = api;
