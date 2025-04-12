import React, { FC } from "react";
import { TouchableOpacity, TouchableOpacityProps, View } from "react-native";

type IProps = TouchableOpacityProps & React.RefAttributes<View>;

export const Button: FC<IProps> = (props) => {
  return <TouchableOpacity {...props}>{props.children}</TouchableOpacity>;
};
