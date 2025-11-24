import { TextInput, TextInputProps } from 'react-native';

export function StyledInput(props: TextInputProps) {
  const { placeholderTextColor, style, ...rest } = props;
  return (
    <TextInput
      {...rest}
      style={style}
      placeholderTextColor={placeholderTextColor ?? '#374151'}
    />
  );
}