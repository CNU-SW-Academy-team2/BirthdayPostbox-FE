import React from "react";

const AvatarGroup = ({ children, shape = 'circle', size=70, ...props }) => {
    const avatars = React.Children.toArray(children)
                        .filter(element => {
                            if (React.isValidElement(element) && element.props.__TYPE === "Avatar")
                                return true;
                            console.warn("Only accepts Avatar as It's children.")
                            return false;
                        })
                        .map((avatar, index, avatars) => {
                            return React.cloneElement(avatar, {
                                ...avatars.props,
                                size,
                                shape,
                                style: {
                                    ...avatar.props.style,
                                    marginLeft: -size / 5,
                                    zIndex: avatars.length - index,
                                }
                            })
                        });

    return <div style={{paddingLeft: size / 5}}>{avatars}</div>;
}

export default AvatarGroup;

/*<Avatar.Group>
    <Avatar />
    <Avatar />
    <Avatar />
</Avatar.Group>*/