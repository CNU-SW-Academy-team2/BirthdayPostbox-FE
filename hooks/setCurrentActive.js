import React, { useState } from 'react';

const Tab = ({ children, active, ...props }) => {
    const [currentActive, setCurrentActive] = useState(() => {
        if (active) {
            return active;
        } else {
            const index = React.Children.toArray(children).filter(element => {
                if (React.isValidElement(element) && element.props.__TYPE === 'Tab.Item')
                    return true;

                console.warn('Only accepts Tab.Item  as It\'s children');
                return false;
            })[0].props.index;
            return index;
        }
    });

    const items = useMemo(() => {
        return React.Children.toArray(children).filter(element => {
            if (React.isValidElement(element) && element.props.__TYPE === 'Tab.Item')
                return true;

            console.warn('Only accepts Tab.Item  as It\'s children');
            return false;
        }).map(element => {
            return React.cloneElement(element, {
                ...element.props,
                key: element.props.index,
                active: element.props.index === currentActive,
                onClick: () => {
                    setCurrentActive(element.props.index);
                }
            })
        })
    }, [children, currentActive]);

    const activeItem = useMemo(() => items.find(element => currentActive === element.props.index), [currentActive, items]);
    return <div>
        <div>{items}</div>
        <div>{activeItem.props.children}</div>
    </div>
}