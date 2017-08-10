import React from 'react';
import PropTypes from 'prop-types';

const classNameStyles = {
  overlay: 'RMD-Background--overlay',
  container: 'RMD-Background--container'
}

export default class ModalBackground extends React.Component {
  static propTypes = {
    onClose: PropTypes.func,
    children: PropTypes.node,
  }

  state = {
    // This is set to false as soon as the component has mounted
    // This allows the component to change its css and animate in
    transparent: true,
  }
  componentDidMount = () => {
    // Create a delay so CSS will animate
    requestAnimationFrame(() => this.setState({ transparent: false }));
  }
  componentWillLeave = (callback) => {
    this.setState({
      transparent: true,
      componentIsLeaving: true,
    });

    // There isn't a good way to figure out what the duration is exactly,
    // because parts of the animation are carried out in CSS...
    setTimeout(() => {
      callback();
    }, this.props.duration);
  }
  getChild = () => {
    const child = React.Children.only(this.props.children);
    const cloneProps = {
      onClose: this.props.onClose,
      componentIsLeaving: this.state.componentIsLeaving,
    };
    if (!cloneProps.onClose) {
      delete cloneProps.onClose;
    }
    return React.cloneElement(child, cloneProps);
  }
  render = () => {
    const { transparent } = this.state;

    if (transparent) {
      classNameStyles.overlay += '--transparent'
      classNameStyles.container += '--transparent'
    }

    return <div style={style}>
      <div className={classNameStyles.overlay}/>
      <div className={classNameStyles.container}>{this.getChild()}</div>
    </div>;
  }
}
