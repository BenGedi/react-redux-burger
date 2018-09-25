import React, {Component} from 'react';
import classes from './Modal.css';
import Backdrop from '../Backdrop/Backdrop'

class Modal extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps.show !== this.props.show || nextProps.children !== this.props.children);
  }

  render () {
    return (
      <React.Fragment>
        <Backdrop show={this.props.show} clicked={this.props.modalClosed}/>
        <div
          className={classes.Modal}
          style={{
            transform: `translateY(${this.props.show ? '0': '-117vh'})`,
            opacity: this.props.show ? '1' : '0'
          }}>
          {this.props.children}
        </div>
      </React.Fragment>
    );
  }
}

export default Modal;