import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, View, ViewPropTypes } from 'react-native';

import Composer from './Composer';
import Send from './Send';
import Actions from './Actions';

export default class InputToolbar extends React.Component {
  renderActions() {
    if (this.props.renderActions) {
      return this.props.renderActions(this.props);
    } else if (this.props.onPressActionButton) {
      return <Actions {...this.props} />;
    }
    return null;
  }

  renderSend() {
    if (this.props.renderSend) {
      return this.props.renderSend(this.props);
    }
    return <Send {...this.props} />;
  }

  renderComposer() {
    if (this.props.renderComposer) {
      return this.props.renderComposer(this.props);
    }

    return <Composer {...this.props} />;
  }

  renderAccessory() {
    if (this.props.renderAccessory) {
      return (
        <View style={[styles.accessory, this.props.accessoryStyle]}>
          {this.props.renderAccessory(this.props)}
        </View>
      );
    }
    return null;
  }

  render() {
    return (
      <View style={[styles.container, this.props.inputContainerStyle]}>
        {this.renderAccessory()}
        <View style={[styles.primary, this.props.primaryStyle]}>
          {this.renderActions()}
          {this.renderComposer()}
          {this.renderSend()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: '#c7d8de',
    backgroundColor: '#fff',
    paddingBottom: 0,
    marginBottom: 0,
  },
  primary: {
    flexDirection: 'row',
    minHeight: 36,
    backgroundColor: '#eceff0',
    alignItems: 'flex-end',
  },
  accessory: {
    height: 36,
  },
});

InputToolbar.defaultProps = {
  renderAccessory: null,
  renderActions: null,
  renderSend: null,
  renderComposer: null,
  containerStyle: {},
  primaryStyle: {},
  accessoryStyle: {},
};

InputToolbar.propTypes = {
  renderAccessory: PropTypes.func,
  renderActions: PropTypes.func,
  renderSend: PropTypes.func,
  renderComposer: PropTypes.func,
  onPressActionButton: PropTypes.func,
  containerStyle: ViewPropTypes.style,
  primaryStyle: ViewPropTypes.style,
  accessoryStyle: ViewPropTypes.style,
};
