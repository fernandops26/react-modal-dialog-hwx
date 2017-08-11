import React from 'react';

const CloseCircle = () => {
    const classNameCircle = 'React_Modal_Dialog-close_circle'

    return <div className={classNameCircle}>
        <div className={classNameCircle + '-rectangle--left'}></div>
        <div className={classNameCircle + '-rectangle--right'}></div>
    </div>
};

export default CloseCircle;
