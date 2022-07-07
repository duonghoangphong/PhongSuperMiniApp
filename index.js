import { AppRegistry } from 'react-native';
import MiniAppProvider from './src/App';
import AppJson from './app.json';


const { appId, name } = AppJson || {};
appId && AppRegistry.registerComponent(appId, () => MiniAppProvider)
name && AppRegistry.registerComponent(name, () => MiniAppProvider)
AppRegistry.registerComponent("MiniApp", () => MiniAppProvider)