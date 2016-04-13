import React, {
  Component,
  Text,
  View,
  ListView,
  StyleSheet,
  TouchableHighlight,
  TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Swipeout from 'react-native-swipeout';

// Mix ES5 & ES6 is ok?
var api = require('../utils/api');
var _ = require('lodash');

// This component handles Todos in 1 list:
//
// - Displays them
// - Allow to delete each one of them
// - Allow to edit each one of them
// - Allow to check/uncheck each one of them
// - Adds a new todo if wanted
//
// All of this "synchronises" both the todo lists from within the app, but in Firebase as well
// So it requires the app to be connect to the internet to work
// Not!! -> Need to find a way to "decouple" the app from an internet connection

export default class Todos extends Component {

  constructor(props) {

    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
    // Firebase keeps "null" values after "delete", this makes sure to remove them
    if (Array.isArray(this.props.list.todos)) {
      _.filter(this.props.list.todos,null)
    }

    this.state = {
      // Keeping the todos in the state to be able rebuild the dataSource after modification
      todos: this.props.list.todos || [],
      dataSource: this.ds.cloneWithRows(this.props.list.todos || []),
      todo: {"content":"", "checked":false, "location":{"lat":false,"lng":false}},
      editMode: false
    };

  }

  persistingNewTodo(){

    if (this.state.todos.length>0) {
      // Simulate a database ID, this looks for the last element
      // of the array, and increments its ID by 1 used for the new todo
      this.state.todo.id = this.state.todos[this.state.todos.length-1].id + 1;
    } else {
      // If the list has no todo
      this.state.todo.id = 1;
    }
    this.state.todos.push(this.state.todo);
    this.reinitStateTodo();
    this.updateTodos(this.props.listId, this.state.todos);

  }

  persistingUpdatedTodo(){

    var index = _.findIndex(this.state.todos,function(l){
        return l.id == this.state.todo.id;
    });
    this.state.todos[index] = this.state.todo;
    this.reinitStateTodo();
    this.updateTodos(this.props.listId, this.state.todos);

  }

  reinitStateTodo(){

    this.setState({
      todo: {"content":"", "checked":false, "location":{"lat":false,"lng":false}},
      editMode: false
    });

  }

  updateTodos(listId, todos){
    // Persisting the data
    api.updateTodos(listId, todos)
      .then((data) => {
        api.getTodos(listId)
          .then((data) => {
            this.setState({
              todos: data,
              dataSource: this.ds.cloneWithRows(data || [])
            })
          })
      })
      .catch((err) => {
        console.log('Request Failed', err);
        this.setState({error});
      });

  }

  handleChange(event){
    // Watching the typing changes
    var todo = _.clone(this.state.todo);
    todo.content = event.nativeEvent.text;
    this.setState({
      todo: todo
    });

  }

  editingTodo(todoId){
    // Setting the edit mode
    var index = _.findIndex(this.state.todos,function(l){
        return l.id == todoId;
    });
    var todo = _.clone(this.state.todos[index]);
    this.setState({
      todo: todo,
      editMode: true
    });

  }

  deletingTodo(todoId){
    // Remove the todo from Firebase
    _.remove(this.state.todos,function(l){
        return l.id == todoId;
    });
    this.updateTodos(this.props.listId, this.state.todos);
  }

  checkingTodo(todoId){
    // Toggle on or off the check button Offline & Online
    var index = _.findIndex(this.state.todos,function(l){
        return l.id == todoId;
    });
    this.state.todos[index].checked = !this.state.todos[index].checked;
    this.setState({
      todos: this.state.todos,
      dataSource: this.ds.cloneWithRows(this.state.todos),
    })
    this.updateTodos(this.props.listId, this.state.todos);

  }

  renderRow(rowData){
    // Verify the check state of the todo, and update the style accordingly
    var checkStatus = "circle-o";
    if(rowData.checked) checkStatus = "check-circle-o";
    // Swipe buttons for each todos
    let swipeBtns = [
      {
        text: 'Edit',
        backgroundColor: 'green',
        underlayColor: 'rgba(0, 0, 0, 1)',
        onPress: () => { this.editingTodo(rowData.id) }
      },
      {
        text: 'Delete',
        backgroundColor: 'red',
        underlayColor: 'rgba(0, 0, 0, 1)',
        onPress: () => { this.deletingTodo(rowData.id) }
      }
    ];

    return (
      <Swipeout right={swipeBtns}
        autoClose='true'>
        <TouchableHighlight
          underlayColor='rgba(192,192,192,1)'
          onPress={this.checkingTodo.bind(this, rowData.id)} >
          <View>
            <View style={styles.rowContainer}>
              <Text>
                <Icon style={paddingRight} name={checkStatus} color="#4F8EF7" size={20}/>
                {rowData.content}
              </Text>
            </View>
            <View style={styles.separator} />
          </View>
        </TouchableHighlight>
      </Swipeout>
    )

  }

  footer(){

    var buttonStyle = styles.buttonAdd,
        textInButton = "Add",
        enterTodoNameInput = (
          <TextInput
            style={styles.searchInput}
            value={this.state.todo.content}
            onChange={this.handleChange.bind(this)}
            placeholder="New Note"
          />),
        addOrUpdateButton =  (
            <TouchableHighlight
              style={buttonStyle}
              onPress={this.persistingNewTodo.bind(this)}
              underlayColor="#58DDEE">
              <Text style={styles.buttonText}>{textInButton}</Text>
            </TouchableHighlight>),
        deleteButton = (
          <TouchableHighlight
            style={styles.buttonCancel}
            onPress={this.reinitStateTodo.bind(this)}
            underlayColor="#58DDEE">
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableHighlight>);

    if(this.state.editMode){
      buttonStyle = styles.buttonEdit;
      textInButton = "Edit";
      addOrUpdateButton = (
          <TouchableHighlight
            style={buttonStyle}
            onPress={this.persistingUpdatedTodo.bind(this)}
            underlayColor="#58DDEE">
            <Text style={styles.buttonText}>{textInButton}</Text>
          </TouchableHighlight>
        )
    }

    return (
      <View style={styles.footerContainer}>
        {enterTodoNameInput}
        {addOrUpdateButton}
        {deleteButton}
      </View>
    )

  }

  render(){

    return(
      <View style={styles.mainContainer}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
          enableEmptySections={true}
        />
        {this.footer()}
      </View>
    );

  }

};

const styles = StyleSheet.create({

  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fcfcfc'
  },
  separator: {
    height: 1,
    backgroundColor: '#E4E4E4',
    flex: 1
  },
  rowContainer: {
    padding: 10,
    backgroundColor: 'white'
  },
  buttonAdd: {
    height: 60,
    backgroundColor: '#48BBEC',
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonEdit: {
    height: 60,
    backgroundColor: 'green',
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonCancel: {
    height: 60,
    backgroundColor: 'red',
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: 'white'
  },
  searchInput: {
    height: 60,
    padding: 10,
    fontSize: 18,
    color: '#111',
    flex: 10
  },
  footerContainer: {
    backgroundColor: '#E3E3E3',
    alignItems: 'center',
    flexDirection: 'row'
  }

});
