import React, {Component} from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultFooter extends Component {
  render() {
    return (
      <React.Fragment>
        <span><a href="https://github.com/abdelsalamshahlol" target="_blank" rel="noopener noreferrer"><i
          className="fa fa-github fa-lg"/></a></span>
        <span className="ml-auto">
          <a href="https://en.wikipedia.org/wiki/Stay-at-home_order" rel="noopener noreferrer"
             className="text-decoration-none">
          <span>Stay Home</span>
            <i className="fa fa-home fa-lg pl-1"/>
          </a>
        </span>
      </React.Fragment>
    );
  }
}

DefaultFooter.propTypes = propTypes;
DefaultFooter.defaultProps = defaultProps;

export default DefaultFooter;
