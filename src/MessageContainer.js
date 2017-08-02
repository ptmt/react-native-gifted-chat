import PropTypes from 'prop-types';
import React from 'react';

import { FlatList, View } from 'react-native';

import shallowequal from 'shallowequal';
import md5 from 'md5';
import LoadEarlier from './LoadEarlier';
import Message from './Message';

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
    // this._invertibleScrollViewRef.scrollTo(options);
    this.flatListRef.scrollToIndex;
  }

  renderRow({ item, sectionId, rowId }) {
    if (!item._id && item._id !== 0) {
      console.warn(
        'GiftedChat: `_id` is missing for message',
        JSON.stringify(item)
      );
    }
    if (!item.user) {
      console.warn(
        'GiftedChat: `user` is missing for message',
        JSON.stringify(item)
      );
      item.user = {};
    }

    const messageProps = {
      ...this.props,
      key: item._id,
      currentMessage: item,
      previousMessage: item.previousMessage,
      nextMessage: item.nextMessage,
      position: item.user._id === this.props.user._id ? 'right' : 'left',
    };

    if (this.props.renderMessage) {
      return this.props.renderMessage(messageProps);
    }
    return (
      <View style={{ transform: [{ scaleY: -1 }, { perspective: 1280 }] }}>
        <Message {...messageProps} />
      </View>
    );
  }

  render() {
    return (
      <View ref="container" style={{ flex: 1 }}>
        <FlatList
          ref={ref => (this.flatListRef = ref)}
          enableEmptySections={true}
          removeClippedSubviews={true}
          automaticallyAdjustContentInsets={false}
          initialListSize={20}
          pageSize={20}
          {...this.props.listViewProps}
          data={this.props.messages}
          keyExtractor={(item, index) => item._id}
          inverted={true}
          style={[
            this.props.style,
            { transform: [{ scaleY: -1 }, { perspective: 1280 }] },
          ]}
          renderItem={this.renderRow}
          renderHeader={this.renderFooter}
          renderFooter={this.renderLoadEarlier}
        />
      </View>
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
