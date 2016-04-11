import React, {
  Component,
  Text,
  View,
  StyleSheet,
  ListView,
  TouchableHighlight,
  ActivityIndicatorIOS
} from 'react-native';
import Todos from './todos';
import Icon from 'react-native-vector-icons/Ionicons';
var api = require('../utils/api');

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
  goToList(listid){
    console.log(listid)
    var list = this.state.lists[listid];
    this.props.navigator.push({
     component: Todos,
     title: `List < ${this.state.lists[listid].title} >`,
     passProps: {list: list}
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
              <Icon style={styles.icon} name="ios-book" color="#4F8EF7" size={20}/>
              {rowData.title}
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
          enableEmptySections={true}
        />
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
        console.log("ola",res);
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
  }
});
