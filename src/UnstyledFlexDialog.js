import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import dynamics from 'dynamics.js';
import CloseCircle from './CloseCircle';
import EventStack from 'active-event-stack';
import keycode from 'keycode';

const classNameStyles = {
    wrapper: 'React_Modal_Dialog-Flex_Dialog-wrapper',
    subwrapper: 'React_Modal_Dialog-Flex_Dialog-subwrapper',
    buttonClose: 'React_Modal_Dialog-Flex_Dialog-button--close',
    content: 'React_Modal_Dialog-Flex_Dialog-content'
}

export default class UnstyledFlexDialog extends React.Component {
    static propTypes = {
        children: PropTypes.node,
        componentIsLeaving: PropTypes.bool,
        onClose: PropTypes.func,
    };
    componentWillMount = () => {
        /**
         * This is done in the componentWillMount instead of the componentDidMount
         * because this way, a modal that is a child of another will have register
         * for events after its parent
         */
        this.eventToken = EventStack.addListenable([
            ['click', this.handleGlobalClick],
            ['keydown', this.handleGlobalKeydown],
        ]);
    };
    componentDidMount = () => {
        this.animateIn();
    };
    componentWillReceiveProps = (nextProps) => {
        if (nextProps.componentIsLeaving && !this.props.componentIsLeaving) {
            const node = ReactDOM.findDOMNode(this.refs.self);
            dynamics.animate(node, {
                scale: 1.2,
                opacity: 0,
            }, {
                duration: 300,
                type: dynamics.easeIn,
            });
        }
    };
    componentWillUnmount = () => {
        EventStack.removeListenable(this.eventToken);
    };
    didAnimateInAlready = false;
    shouldClickDismiss = (event) => {
        const {target} = event;
        // This piece of code isolates targets which are fake clicked by things
        // like file-drop handlers
        if (target.tagName === 'INPUT' && target.type === 'file') {
            return false;
        }

        if (target === this.refs.self || this.refs.self.contains(target)) return false;
        return true;
    };
    handleGlobalClick = (event) => {
        if (this.shouldClickDismiss(event)) {
            if (typeof this.props.onClose == 'function') {
                this.props.onClose();
            }
        }
    };
    handleGlobalKeydown = (event) => {
        if (keycode(event) === 'esc') {
            if (typeof this.props.onClose == 'function') {
                this.props.onClose();
            }
        }
    };
    animateIn = () => {
        this.didAnimateInAlready = true;

        // Animate this node once it is mounted
        const node = ReactDOM.findDOMNode(this.refs.self);

        // This sets the scale...
        if (document.body.style.transform == null) {
            node.style.WebkitTransform = 'scale(0.5)';
        } else {
            node.style.transform = 'scale(0.5)';
        }

        dynamics.animate(node, {
            scale: 1,
        }, {
            type: dynamics.spring,
            duration: 500,
            friction: 400,
        });
    };
    render = () => {
        const {
            props: {
                children,
                componentIsLeaving, // eslint-disable-line no-unused-vars, this line is used to remove parameters from rest
                onClose,
                ...rest,
            },
        } = this;

        return <div className={classNameStyles.wrapper}>
            <div className={classNameStyles.subwrapper}>
                <div
                    ref="self"
                    className={classNameStyles.content}
                    {...rest}
                >
                    {
                        onClose != null &&
                        <a className={classNameStyles.buttonClose} onClick={onClose}>
                            <CloseCircle diameter={40}/>
                        </a>
                    }
                    {children}
                </div>
            </div>
        </div>;
    };
}
