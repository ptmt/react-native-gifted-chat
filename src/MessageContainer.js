import PropTypes from 'prop-types';
import React from 'react';

import { FlatList, View, Platform } from 'react-native';

import shallowequal from 'shallowequal';
import md5 from 'md5';
import LoadEarlier from './LoadEarlier';
import Message from './Message';

const transform = Platform.OS === 'android' ? [{ scaleY: -1 }, { perspective: 1280 }] : [{ scaleY: -1 }];

export default class MessageContainer extends React.Component {
  constructor(props) {
    super(props);

    this.renderRow = this.renderRow.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.renderLoadEarlier = this.renderLoadEarlier.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.messages.length !== nextProps.messages.length) {
      return true;
    }
    if (!shallowequal(this.props, nextProps)) {
      return true;
    }
    return false;
  }

  renderFooter() {
    if (this.props.renderFooter) {
      const footerProps = {
        ...this.props,
      };
      return this.props.renderFooter(footerProps);
    }
    return null;
  }

  renderLoadEarlier() {
    if (this.props.loadEarlier === true) {
      const loadEarlierProps = {
        ...this.props,
      };
      if (this.props.renderLoadEarlier) {
        return this.props.renderLoadEarlier(loadEarlierProps);
      }
      return <LoadEarlier {...loadEarlierProps} />;
    }
    return null;
  }

  scrollTo(options) {
    if (this.flatListRef) {
      this.flatListRef.scrollToOffset({ ...options, offset: options.y });
    }
  }

  renderRow({ item, index }) {
    if (!item._id && item._id !== 0) {
      console.warn('GiftedChat: `_id` is missing for message', JSON.stringify(item));
    }
    if (!item.user) {
      console.warn('GiftedChat: `user` is missing for message', JSON.stringify(item));
      item.user = {};
    }

    const { messages, ...restProps } = this.props;
    const previousMessage = messages[index + 1] || {};
    const nextMessage = messages[index - 1] || {};

    const messageProps = {
      ...restProps,
      key: item._id,
      currentMessage: item,
      previousMessage,
      nextMessage,
      hash: md5(JSON.stringify(item) + previousMessage._id + nextMessage._id),
      position: item.user._id === this.props.user._id ? 'right' : 'left',
    };

    if (this.props.renderMessage) {
      return this.props.renderMessage(messageProps);
    }
    return (
      <View style={{ transform }}>
        <Message {...messageProps} />
      </View>
    );
  }

  renderHeaderWrapper = () => {
    return <View style={{ flex: 1 }}>{this.renderLoadEarlier()}</View>;
  };

  render() {
    if (this.props.messages.length === 0) {
      return (
        <View
          style={{
            flex: 1,
          }}
        />
      );
    }
    return (
      <FlatList
        ref={ref => (this.flatListRef = ref)}
        enableEmptySections={true}
        removeClippedSubviews={true}
        automaticallyAdjustContentInsets={false}
        initialListSize={5}
        pageSize={1}
        {...this.props.listViewProps}
        data={this.props.messages}
        keyExtractor={(item, index) => item._id}
        style={[
          this.props.style,
          {
            flex: 1,
            marginTop: Platform.OS == 'ios' ? 64 : 0,
            transform,
          },
        ]}
        contentContainerStyle={{
          justifyContent: 'flex-end',
        }}
        renderItem={this.renderRow}
        renderHeader={this.renderFooter}
        renderFooter={this.renderLoadEarlier}
        ListHeaderComponent={this.renderHeaderWrapper}
      />
    );
  }
}

MessageContainer.defaultProps = {
  messages: [],
  user: {},
  renderFooter: null,
  renderMessage: null,
  listViewProps: {},
  onLoadEarlier: () => {},
};

MessageContainer.propTypes = {
  messages: PropTypes.array,
  user: PropTypes.object,
  renderFooter: PropTypes.func,
  renderMessage: PropTypes.func,
  onLoadEarlier: PropTypes.func,
  listViewProps: PropTypes.object,
};
