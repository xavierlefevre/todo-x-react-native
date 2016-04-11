import React, {
  Component,
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  ActivityIndicatorIOS
} from 'react-native';
import Todos from './todos';
import Icon from 'react-native-vector-icons/Ionicons';
var api = require('../utils/api');

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lists: [],
      isLoading: true
    };
  }
  goToList(listid){
    var list = this.state.lists[listid];
    this.props.navigator.push({
     component: Todos,
     title: `List < ${this.state.lists[listid].title} >`,
     passProps: {list: list}
   })
  }
  render(){
    var lists = this.state.lists.map((list) => {
      return (
        <TouchableHighlight
          onPress={() => this.goToList(list.id)}
          underlayColor="white">
          <View>
            <Text style={styles.lists} key={list.id}>
              <Icon name="ios-book" color="#4F8EF7" size={20}/> {list.title}
            </Text>
            <View style={styles.separator} />
          </View>
        </TouchableHighlight>
      );
    });
    return(
      <View style={styles.mainContainer}>
        {lists}
        <ActivityIndicatorIOS
          animating={this.state.isLoading}
          color='#111'
          size='large'>
        </ActivityIndicatorIOS>
      </View>
    );
  }
  componentDidMount() {
    api.getLists()
      .then((res) => {
        console.log(res);
        this.setState({
          lists: res,
          isLoading: false
        });
      });
  }
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingLeft: 20,
    paddingTop: 20,
    marginTop: 65,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: '#fcfcfc'
  },
  lists: {
    margin: 10,
    fontSize: 15
  },
  listsText:{
  },
  separator: {
    height: 1,
    backgroundColor: '#E4E4E4',
    flex: 1,
    marginLeft: 10
  }
});
