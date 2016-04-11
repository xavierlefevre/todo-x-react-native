import React, {
  Component,
  Text,
  View,
  ListView,
  StyleSheet,
  TouchableHighlight
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Swipeout from 'react-native-swipeout';

export default class Todos extends Component {
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
    this.state = {
      todos: this.props.list.todos,
      dataSource: this.ds.cloneWithRows(this.props.list.todos),
      note: '',
      error: ''
    };
  }
  checkTodo(todoId){
    this.state.todos[todoId].checked ?
      this.state.todos[todoId].checked = false :
      this.state.todos[todoId].checked = true;
    this.setState({
      todos: this.state.todos,
    })
  }
  deleteNote(){
    return ''
  }
  openNewTodo(){
    return ''
  }
  renderRow(rowData){
    let swipeBtns = [
    {
      text: 'Edit',
      backgroundColor: 'green',
      underlayColor: 'rgba(0, 0, 0, 1)',
      onPress: () => { this.deleteNote(rowData) }
    },
    {
      text: 'Delete',
      backgroundColor: 'red',
      underlayColor: 'rgba(0, 0, 0, 1)',
      onPress: () => { this.deleteNote(rowData) }
    }
    ];
    return (
      <Swipeout right={swipeBtns}
        autoClose='true'>
        <View>
          <View style={styles.rowContainer}>
            <Text>{rowData.content}</Text>
          </View>
          <View style={styles.separator} />
        </View>
      </Swipeout>
    )
  }
  footer(){
    return (
      <View style={styles.footerContainer}>
        <TouchableHighlight
          style={styles.button}
          onPress={this.openNewTodo.bind(this)}
          underlayColor="green">
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
          renderRow={this.renderRow}
        />
        {this.footer()}
      </View>
    );
  }
  // ---------------------
  // Before using ListView
  // ---------------------
  renderNormalRows(){
    return this.state.todos.map((todo) => {
      var iconStatus = "ios-circle-filled";
      if(todo.checked) {
        iconStatus = "ios-checkmark";
      }
      return (
        <TouchableHighlight
          onPress={() => this.checkTodo(todo.id)}
          underlayColor="white">
          <View>
            <Text style={styles.todos} key={todo.id}>
              <Icon name={iconStatus} color="#4F8EF7" size={20}/> {todo.content}
            </Text>
            <View style={styles.separator} />
          </View>
        </TouchableHighlight>
      );
    });
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
  footerContainer: {
    backgroundColor: '#E3E3E3',
    alignItems: 'center',
    flexDirection: 'row'
  }
});
