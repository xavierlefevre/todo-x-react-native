import React, {
  Component,
  Text,
  View,
  StyleSheet,
  ListView,
  TouchableHighlight
} from 'react-native';
import Todos from './todos';
import EditList from './edit/editlist';
import Icon from 'react-native-vector-icons/Ionicons';
var api = require('../utils/api');

// This component displays the lists of todos and redirect to them:
export default class Main extends Component {
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
    this.state = {
      dataSource: this.ds.cloneWithRows([]),
      lists: [],
      isLoading: true
    };
  }
  goToList(listId){
    // Function redirection to the clicked list
    var list = this.state.lists[listId];
    this.props.navigator.push({
     component: Todos,
     title: `${this.state.lists[listId].title}`,
     passProps: {list: list, listId: listId},
     rightButtonTitle: 'Edit List',
     onRightButtonPress: () => {
       this.props.navigator.push({
         component: EditList,
         title: 'Editing',
       });
     },
   });
  }
  renderRow(rowData){
    return (
      <View>
        <TouchableHighlight
          onPress={() => this.goToList(rowData.id)}
          underlayColor="white">
          <View style={styles.rowContainer}>
            <Text>
              <Icon style={{paddingLeft: 16}} name="ios-book" color="#4F8EF7" size={20}/>
              {'  '}{rowData.title}
            </Text>
          </View>
        </TouchableHighlight>
        <View style={styles.separator} />
      </View>
    )
  }
  render(){
    return(
      <View style={styles.mainContainer}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
          enableEmptySections={true}>
        </ListView>
      </View>
    );
  }
  componentDidMount() {
    api.getLists()
      .then((res) => {
        this.setState({
          dataSource: this.ds.cloneWithRows(res),
          lists: res,
          isLoading: false
        });
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
  separator: {
    height: 1,
    backgroundColor: '#E4E4E4',
    flex: 1,
    marginLeft: 10
  },
  rowIcon: {
    color: 'pink',
    margin: 10,
    padding: 10
  }
});
