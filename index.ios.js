import React, {
  AppRegistry,
  Component,
  StyleSheet,
  NavigatorIOS,
  Text,
  View
} from 'react-native';
import List from './app/components/list';

class ReactTodoX extends Component {
  render() {
    return (
      <NavigatorIOS
        style={styles.mainContainer}
        initialRoute={{
          title: 'TodoX',
          component: List,
          rightButtonTitle: 'Add List',
        }}
      />
    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  }
});

AppRegistry.registerComponent('ReactTodoX', () => ReactTodoX);
