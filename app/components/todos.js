import React, {
  Component,
  Text,
  View,
  ListView,
  StyleSheet,
  TouchableHighlight
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
      todos: this.props.list.todos,
      dataSource: this.ds.cloneWithRows(this.props.list.todos || []),
    };
  }
  createNewTodo(){
    // Add todo - NOT YET WORKING
    return ''
  }
  editTodo(){
    // Edit todo - NOT YET WORKING
    return ''
  }
  deleteTodo(listId, todoId){
    // Remove the todo from Firebase
    api.deleteTodo(listId, todoId)
      .then((res) => {
        // Remove the todo from the state array
        _.remove(this.state.todos,function(l){
            return l.id == todoId;
        });
        this.setState({
          dataSource: this.ds.cloneWithRows(this.state.todos),
        });
      });
  }
  checkTodo(todoId){
    // Toggle on or off the check button
    // Note! => Not attached to firebase yet
    this.state.todos[todoId].checked ?
      this.state.todos[todoId].checked = false :
      this.state.todos[todoId].checked = true;
    this.setState({
      todos: this.state.todos,
      dataSource: this.ds.cloneWithRows(this.state.todos),
    })
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
        onPress: () => { this.editTodo(this.props.listId, rowData.id) }
      },
      {
        text: 'Delete',
        backgroundColor: 'red',
        underlayColor: 'rgba(0, 0, 0, 1)',
        onPress: () => { this.deleteTodo(this.props.listId, rowData.id) }
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
    return (
      <View style={styles.footerContainer}>
        <TouchableHighlight
          style={styles.button}
          onPress={this.createNewTodo.bind(this)}
          underlayColor='#58DDEE'>
          <Text style={styles.buttonText}>Add New Todo</Text>
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
  button: {
    height: 60,
    backgroundColor: '#48BBEC',
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: 'white'
  },
  footerContainer: {
    backgroundColor: '#E3E3E3',
    alignItems: 'center',
    flexDirection: 'row'
  }
});
