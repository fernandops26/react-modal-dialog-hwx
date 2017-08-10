import React from 'react';
import PropTypes from 'prop-types';
import UnstyledFlexDialog from './UnstyledFlexDialog';

export default class FlexDialog extends React.Component {
    static propTypes = {
        className: PropTypes.string
    };
    static defaultProps = {
        className: ''
    };

    render = () => {
        const {
            props: {
                className,
                ...rest,
            },
        } = this;

        const combinedClassName = 'rm-dialog-flex' + className

        return <UnstyledFlexDialog style={combinedStyle} className={combinedClassName} {...rest}/>;
    };
}