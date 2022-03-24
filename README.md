# React Native Take Home Exercise

---

## Exercise: Scrollable Audio Streaming

Create an application that allows people to scroll through a list of audio clips, each associated with an image.

- The list should load at least 16 audio clips. You can use the clips on [SoundHelix](https://www.soundhelix.com/audio-examples).

- You may use whatever images you would like for each audio clip.

- The user should be able to play, pause, and seek 30 seconds forwards or backwards for each audio clip.

- A user can only play one audio clip at a time.

- The audio should continue playing in the background when a user leaves the app.

- The app should be performant and not take too long to load initially or too long to load each successive clip.

- We are not judging your design skills, but we would love to see that you can build a beautiful UI. Feel free to use any existing apps for inspiration.

## My Process

I started out by getting the build and simulators running, since I didn’t have a react native development environment set up previously.

I spent a lot of time figuring out a build issue for iOS, which led to me both having to install a previous version of XCode and also editing the Podfile to request specific versions of Flipper libraries.

Then I researched what react-native libraries I could use to accomplish the task outlined in the readme. I came across react-native-sound and expo-av and read a few articles, documentation, and experimented a bit with both. After some trial and error, I decided to go with expo-av because I liked the async methods available.

After that, I defined 2 additional functional components and tried to create a simple layout that made sense. I hooked up the buttons and managed the interactions / updating UI using React Hooks, which I was familiar with from web development.

If I had more time, I would have gone further into testing and refactoring the components for better code clarity, project structure (each functional component in its own file), UI design (usage of `StyleSheet`), accessability, and performance.

## Difficulties

One thing that I had difficulty with since I am new to mobile development was issues related to the simulators. When running on simulators, a few audio files out of the list were hanging and not being downloaded, but when I built the standalone app, it seemed to not have this issue.

I also found config that expo-av specified for playing audio in the background when exiting the app for iOS and added it to `app.json`, but could only successfully get this behavior on Android simulator within the time I had.

### Further Work

Here are some questions I would have asked if I had more bandwidth to work on this -

How is ‘performant’ defined? How quickly should the app load initially? How quickly should all audio files be playable? What should the UI behavior be when trying to seek forward and buffering? Should the app continue to the next audio clip if the current clip ends?

## Running the app

- Make sure you have `yarn` installed on your machine. If you do not, you can install yarn using Homebrew on Mac:

```
brew install yarn
```

- We have created a basic app using [create-react-native-app](https://github.com/expo/create-react-native-app) that runs on iOS and Android. To run it, please run:

```
yarn
```

And then:

```
cd ios/ && pod install && cd ..
```

```
yarn start
```

with the app running,

```
yarn ios
```

Or

```
yarn android
```

These instructions assume you have set up XCode and have an iOS simulator as well as an Android simulator through Android Studio.

## Requirements

- The app should run on both Android and iOS
