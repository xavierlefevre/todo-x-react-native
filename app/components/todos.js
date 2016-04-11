import React, {
  Component,
  Text,
  View,
  StyleSheet,
  TouchableHighlight
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default class Todos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: this.props.list.todos
    };
  }
  checkTodo(todoId){
    console.log("Started Check Process!");
    this.state.todos[todoId].checked ?
      this.state.todos[todoId].checked = false :
      this.state.todos[todoId].checked = true;
    this.setState({
      todos: this.state.todos,
    })
  }
  renderRows(){
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
  render(){
    return(
      <View style={styles.mainContainer}>
        {this.renderRows()}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingTop: 20,
    marginTop: 65,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: '#fcfcfc'
  },
  todos: {
    margin: 10,
    paddingLeft: 20,
    fontSize: 15
  },
  separator: {
    height: 1,
    backgroundColor: '#E4E4E4',
    flex: 1,
    marginLeft: 20
  }
});
