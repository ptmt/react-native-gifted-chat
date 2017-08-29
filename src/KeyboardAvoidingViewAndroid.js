// @flow
import React from 'react';

import { Keyboard, LayoutAnimation, Platform, View } from 'react-native';

type Rect = {
  x: number,
  y: number,
  width: number,
  height: number,
};
type ScreenRect = {
  screenX: number,
  screenY: number,
  width: number,
  height: number,
};
type KeyboardChangeEvent = {
  startCoordinates?: ScreenRect,
  endCoordinates: ScreenRect,
  duration?: number,
  easing?: string,
};
type LayoutEvent = {
  nativeEvent: {
    layout: Rect,
  },
};

const viewRef = 'VIEW';

class KeyboardAvoidingView extends React.Component {
  constructor() {
    super();
    this.state = {
      bottom: 0,
    };
  }

  state: {
    bottom: number,
  };

  componentWillMount() {
    if (Platform.OS === 'ios') {
      this.subscriptions = [
        Keyboard.addListener(
          'keyboardWillChangeFrame',
          this.onKeyboardChange.bind(this)
        ),
      ];
    } else {
      this.subscriptions = [
        Keyboard.addListener(
          'keyboardDidHide',
          this.onKeyboardChange.bind(this)
        ),
        Keyboard.addListener(
          'keyboardDidShow',
          this.onKeyboardChange.bind(this)
        ),
      ];
    }
  }

  componentWillUpdate(
    nextProps: Object,
    nextState: Object,
    nextContext?: Object
  ): void {
    if (
      nextState.bottom === this.state.bottom &&
      this.props.behavior === 'height' &&
      nextProps.behavior === 'height'
    ) {
      // If the component rerenders without an internal state change, e.g.
      // triggered by parent component re-rendering, no need for bottom to change.
      // nextState.bottom = 0;
    }
  }

  componentWillUnmount() {
    this.subscriptions.forEach(sub => sub.remove());
  }

  onLayout(event: LayoutEvent) {
    this.frame = event.nativeEvent.layout;
  }

  onKeyboardChange(event: ?KeyboardChangeEvent) {
    if (!event) {
      this.setState({ bottom: 0 });
      return;
    }

    const { duration, easing, endCoordinates } = event;
    const height = this.relativeKeyboardHeight(endCoordinates);

    if (duration && easing) {
      LayoutAnimation.configureNext({
        duration,
        update: {
          duration,
          type: LayoutAnimation.Types[easing] || 'keyboard',
        },
      });
    }
    this.setState({ bottom: height });
  }

  props: {
    behavior: 'height' | 'padding' | 'position',
    children: any,
    style: any,
    keyboardVerticalOffset: number,
  };

  subscriptions: any;
  frame: any;

  relativeKeyboardHeight(keyboardFrame: ScreenRect): number {
    const frame = this.frame;
    if (!frame) {
      return 0;
    }

    const y1 = Math.max(
      frame.y,
      keyboardFrame.screenY - this.props.keyboardVerticalOffset
    );
    const y2 = Math.min(
      frame.y + frame.height,
      keyboardFrame.screenY +
        keyboardFrame.height -
        this.props.keyboardVerticalOffset
    );
    return Math.max(y2 - y1, 0);
  }

  render() {
    const { behavior, children, style, ...props } = this.props;

    switch (behavior) {
      case 'height': {
        let heightStyle;
        if (this.frame) {
          // Note that we only apply a height change when there is keyboard present,
          // i.e. this.state.bottom is greater than 0. If we remove that condition,
          // this.frame.height will never go back to its original value.
          // When height changes, we need to disable flex.
          heightStyle = {
            height: this.frame.height - this.state.bottom,
            flex: 0,
          };
        }
        return (
          <View
            ref={viewRef}
            style={[style, heightStyle]}
            onLayout={this.onLayout}
            {...props}
          >
            {children}
          </View>
        );
      }
      case 'position': {
        const positionStyle = { bottom: this.state.bottom };
        return (
          <View ref={viewRef} style={style} onLayout={this.onLayout} {...props}>
            <View style={positionStyle}>
              {children}
            </View>
          </View>
        );
      }
      case 'padding': {
        const paddingStyle = {
          paddingBottom: Platform.OS === 'android' ? 0 : this.state.bottom,
        };
        return (
          <View
            ref={viewRef}
            style={[style, paddingStyle]}
            onLayout={this.onLayout}
            {...props}
          >
            {children}
          </View>
        );
      }
      default:
        return (
          <View ref={viewRef} onLayout={this.onLayout} style={style} {...props}>
            {children}
          </View>
        );
    }
  }
}

module.exports = KeyboardAvoidingView;
