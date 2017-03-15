import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import moment from 'moment/min/moment-with-locales.min';

export default class Time extends React.Component {
  render() {
    return (
      <View style={[styles[this.props.position].container, this.props.containerStyle[this.props.position]]}>
        <Text style={[styles[this.props.position].text, this.props.textStyle[this.props.position]]}>
          {moment(this.props.currentMessage.createdAt).locale(this.context.getLocale()).format('LT')}
        </Text>
      </View>
    );
  }
}

const containerStyle = {
  marginLeft: 10,
  marginRight: 10,
  marginTop:8,
  marginBottom: 4,
};

const textStyle = {
  fontSize: 10,
  backgroundColor: 'transparent',
  fontFamily:'Cabin_Bold',
  textAlign: 'right',
};

const styles = {
  left: StyleSheet.create({
    container: {
      ...containerStyle,
    },
    text: {
      color: '#90a5ae',
      ...textStyle,
    },
  }),
  right: StyleSheet.create({
    container: {
      ...containerStyle,
    },
    text: {
      color: '#90a5ae',
      ...textStyle,
    },
  }),
};

Time.contextTypes = {
  getLocale: React.PropTypes.func,
};

Time.defaultProps = {
  position: 'left',
  currentMessage: {
    createdAt: null,
  },
  containerStyle: {},
  textStyle: {},
};

Time.propTypes = {
  position: React.PropTypes.oneOf(['left', 'right']),
  currentMessage: React.PropTypes.object,
  containerStyle: React.PropTypes.shape({
    left: View.propTypes.style,
    right: View.propTypes.style,
  }),
  textStyle: React.PropTypes.shape({
    left: Text.propTypes.style,
    right: Text.propTypes.style,
  }),
};
