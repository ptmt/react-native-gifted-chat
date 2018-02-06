import PropTypes from 'prop-types';
import React from 'react';

import { FlatList, View, Text, Platform } from 'react-native';

import shallowequal from 'shallowequal';
import hash from 'quick-hash';
import LoadEarlier from './LoadEarlier';
import Message from './Message';

export default class MessageContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.renderRow = this.renderRow.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.renderLoadEarlier = this.renderLoadEarlier.bind(this);
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

    const messageHash = this.props.messagePropsToHash
      ? hash(this.props.messagePropsToHash(item) + previousMessage._id + nextMessage._id)
      : hash(item.body.length + JSON.stringify(item.attributes) + previousMessage._id + nextMessage._id);

    const messageProps = {
      ...restProps,
      key: item._id,
      currentMessage: item,
      previousMessage,
      nextMessage,
      hash: messageHash,
      position: item.user._id === this.props.user._id ? 'right' : 'left',
    };

    if (this.props.renderMessage) {
      return this.props.renderMessage(messageProps);
    }
    return <Message {...messageProps} />;
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
        ref={(ref) => (this.flatListRef = ref)}
        initialNumToRender={8}
        maxToRenderPerBatch={1}
        removeClippedSubviews={true}
        {...this.props.listViewProps}
        data={this.props.messages}
        keyExtractor={(item, index) => item._id}
        inverted={true}
        style={[
          this.props.style,
          {
            flex: 1,
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
  messagePropsToHash: PropTypes.func,
};
