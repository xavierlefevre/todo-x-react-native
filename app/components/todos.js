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
    if(Array.isArray(this.props.list.todos)){
      for(i=0;i<this.props.list.todos.length;i++){
        if (this.props.list.todos[i] == null) {
          this.props.list.todos.splice(i,1);
          i--;
        }
      }
    }
    this.state = {
      // Keeping the todos in the state to be able rebuild the dataSource after modification
      todos: this.props.list.todos || [],
      dataSource: this.ds.cloneWithRows(this.props.list.todos || []),
      todo: {"content":"", "checked":false, "location":{"lat":false,"lng":false}},
      editMode: false
    };
  }
  addTodo(){
    if(!this.state.todo.id){
      if(this.state.todos.length>0){
        this.state.todo.id = this.state.todos[this.state.todos.length-1].id + 1;
      }else{
        this.state.todo.id = 1;
      }
      this.state.todos.push(this.state.todo);
    } else {
      console.log("todoID 1",this.state.todo.id);
      console.log("Todos",this.state.todos);
      var index = _.findIndex(this.state.todos,function(l){
          return l.id == this.state.todo.id;
      });
      this.state.todos[index] = this.state.todo;
    }
    this.reinitStateTodo();
    this.updateTodos();
  }
  reinitStateTodo(){
    this.setState({
      todo: {"content":"", "checked":false, "location":{"lat":false,"lng":false}},
      editMode: false
    });
  }
  updateTodos(){
    api.updateTodos(this.props.listId, this.state.todos)
      .then((data) => {
        api.getTodos(this.props.listId)
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
    // Handle Immutability ISSUE!
    var todo = this.state.todo;
    todo.content = event.nativeEvent.text;
    this.setState({
      todo: todo
    });
  }
  editTodo(todoId){
    var index = _.findIndex(this.state.todos,function(l){
        return l.id == todoId;
    });
    // Handle Immutability ISSUE!
    var todo = this.state.todos[index];
    this.setState({
      todo: todo,
      editMode: true
    });
  }
  deleteTodo(todoId){
    // Remove the todo from Firebase
    _.remove(this.state.todos,function(l){
        return l.id == todoId;
    });
    this.updateTodos();
  }
  checkTodo(todoId){
    // Toggle on or off the check button Offline & Online
    var index = _.findIndex(this.state.todos,function(l){
        return l.id == todoId;
    });
    this.state.todos[index].checked ?
      this.state.todos[index].checked = false :
      this.state.todos[index].checked = true;
    this.setState({
      todos: this.state.todos,
      dataSource: this.ds.cloneWithRows(this.state.todos),
    })
    this.updateTodos();
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
        onPress: () => { this.editTodo(rowData.id) }
      },
      {
        text: 'Delete',
        backgroundColor: 'red',
        underlayColor: 'rgba(0, 0, 0, 1)',
        onPress: () => { this.deleteTodo(rowData.id) }
      }
    ];
    return (
      <Swipeout right={swipeBtns}
        autoClose='true'>
        <TouchableHighlight
          underlayColor='rgba(192,192,192,1)'
          onPress={this.checkTodo.bind(this, rowData.id)} >
          <View>
            <View style={styles.rowContainer}>
              <Text>
                <Icon name={checkStatus} color="#4F8EF7" size={20}/>
                {'  '}{rowData.content}
              </Text>
            </View>
            <View style={styles.separator} />
          </View>
        </TouchableHighlight>
      </Swipeout>
    )
  }
  footer(){
    var buttonStyle, textInButton;
    if(this.state.editMode){
      buttonStyle = styles.buttonEdit;
      textInButton = "Edit";
    }else{
      buttonStyle = styles.buttonAdd;
      textInButton = "Add";
    }
    return (
      <View style={styles.footerContainer}>
        <TextInput
          style={styles.searchInput}
          value={this.state.todo.content}
          onChange={this.handleChange.bind(this)}
          placeholder="New Note"
        />
        <TouchableHighlight
          style={buttonStyle}
          onPress={this.addTodo.bind(this)}
          underlayColor="#58DDEE">
          <Text style={styles.buttonText}>{textInButton}</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.buttonCancel}
          onPress={this.reinitStateTodo.bind(this)}
          underlayColor="#58DDEE">
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableHighlight>
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
