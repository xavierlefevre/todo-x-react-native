import React, {
  AppRegistry,
  Component,
  StyleSheet,
  NavigatorIOS,
  Text,
  View
} from 'react-native';
import Main from './app/components/main';

class ReactTodoX extends Component {
  render() {
    return (
      <NavigatorIOS
        style={styles.mainContainer}
        initialRoute={{
          title: 'TodoX',
          component: Main,
          rightButtonTitle: 'Edit'
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
