import "react-native";
import React from "react";
import App from "../App";

// Note: test renderer must be required after react-native.
import renderer from "react-test-renderer";

it("renders correctly", () => {
  renderer.create(<App />);
});

it("renders an image for every audio clip", () => {
  renderer.create(<App />);
});

it("renders at least 16 audio clips in a scrollable list", () => {
  renderer.create(<App />);
});

it("continues playing in the background if the user leaves the app", () => {
  renderer.create(<App />);
});

it("loads a playable clip within a reasonable amount of time", () => {
  renderer.create(<App />);
});
