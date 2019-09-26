# react-native-authcore

## Getting started

`$ npm install react-native-authcore --save`

### Mostly automatic installation

`$ react-native link react-native-authcore`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-authcore` and add `Authcore.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libAuthcore.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainApplication.java`
  - Add `import com.reactlibrary.AuthcorePackage;` to the imports at the top of the file
  - Add `new AuthcorePackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-authcore'
  	project(':react-native-authcore').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-authcore/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-authcore')
  	```


## Usage
```javascript
import Authcore from 'react-native-authcore';

// TODO: What to do with the module?
Authcore;
```
