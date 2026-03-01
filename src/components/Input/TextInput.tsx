import React, { useCallback, useState } from "react"
import {
  Platform,
  Pressable,
  TextInput as RNTextInput,
  StyleSheet,
  TouchableOpacity,
  View,
  type NativeSyntheticEvent,
  type TextInputChangeEventData,
  type TextInputProps,
  type ViewStyle,
} from "react-native"
import HelperText, { type HelperTextProps } from "../HelperText"
import HorizontalSpace from "../HorizontalSpace/HorizontalSpace"
import Text, { type TextProps } from "../Text"
import { colors, fonts, ResponsiveFonts } from "../../themes"
import { heightRem, screenRem } from "../../themes/dimensions"

const spacing = {
  xsmall: 3,
  small: 6,
  medium: 10,
  large: 15,
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  titleContainer: {
    flexDirection: "row",
    // marginBottom: spacing.xsmall,
    ...(Platform.OS === "ios" && {
      marginBottom: spacing.xsmall,
    }),
  },
  inputContainer: {
    borderColor: colors.border,
    backgroundColor: colors.g15,
    borderWidth: screenRem * 0.1,
    paddingHorizontal: spacing.small,
    height: heightRem * 6,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: screenRem * 0.5,
  },
  focusedContainer: {
    backgroundColor: colors.g15,
    borderColor: colors.primary,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    height: "100%",
    color: colors.text,
    padding: 0,
    fontSize: screenRem * 1.2,
    fontFamily: fonts.poppinsRegular400,
  },
  textView: (value) => ({
    color: value ? colors.text : colors.g18,
    fontSize: screenRem * 1.2,
    fontFamily: fonts.poppinsRegular400,
  }),
  disabledInput: {
    color: colors.mutedText,
  },
  multilineInput: {
    textAlignVertical: "top",
    height: "auto",
    minHeight: 70,
  },
  itemsCenter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
})

export interface Props extends TextInputProps {
  title?: string
  containerStyle?: ViewStyle
  inputContainerStyle?: ViewStyle
  isStyledFocus?: boolean
  inputRef?: any
  pressable?: boolean
  onPress?: () => void
  required?: boolean
  helperText?: string
  isHelperTextVisible?: boolean
  HelperTextProps?: HelperTextProps
  editable?: boolean
  titleProps?: TextProps
  nextInputRef?: React.MutableRefObject<RNTextInput | undefined>
  renderLeftAccessory?: () => React.ReactNode
  renderRightAccessory?: () => React.ReactNode
  Component?: typeof RNTextInput
  staticValue?: string | null | undefined
  italicPlaceholder?: boolean
}

export default function TextInput(props: Props) {
  const [focused, setFocused] = useState(!!props.autoFocus)

  const {
    title,
    placeholder,
    containerStyle,
    inputContainerStyle,
    isStyledFocus = true,
    renderLeftAccessory,
    renderRightAccessory,
    style,
    inputRef,
    onBlur,
    onFocus,
    nextInputRef,
    pressable,
    onPress,
    required,
    helperText,
    isHelperTextVisible,
    HelperTextProps,
    titleProps,
    editable = true,
    returnKeyType = nextInputRef ? "next" : "default",
    Component = RNTextInput,
    onSubmitEditing = nextInputRef
      ? () => {
          nextInputRef?.current?.focus()
        }
      : undefined,
    staticValue,
    italicPlaceholder = false,
    ...rest
  } = props

  const handleFocus = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setFocused(true)
    onFocus?.(event)
  }
  const handleBlur = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setFocused(false)
    onBlur?.(event)
  }

  const focusedContainerStyle = isStyledFocus && [styles.focusedContainer]
  let Wrapper = useCallback(
    // @ts-ignore
    (viewProps) => {
      if (pressable) {
        return (
          <Pressable onPress={onPress} {...viewProps}>
            <>{viewProps.children}</>
          </Pressable>
        )
      } else return <View {...viewProps} />
    },
    [pressable, onPress],
  )

  return (
    <Wrapper style={[styles.container, containerStyle]}>
      {title ? (
        <View style={styles.titleContainer}>
          <Text
            // text={required ? `${title} *` : title}
            text={title}
            allowFontScaling={false}
            fontFamily={fonts.poppinsSemiBold600}
            fontSize={ResponsiveFonts.px14}
            {...titleProps}
          />
        </View>
      ) : null}
      <View
        style={[
          styles.inputContainer,
          focused && focusedContainerStyle,
          // props.multiline && styles.multilineInput,
          inputContainerStyle,
        ]}
      >
        <View style={{ flex: 1 }}>
          <View style={styles.itemsCenter}>
            {renderLeftAccessory ? (
              <>
                <HorizontalSpace w={2} />
                {renderLeftAccessory?.()}
                <HorizontalSpace w={2} />
              </>
            ) : (
              <></>
            )}

            {staticValue ? (
              <Text style={[styles.textView(staticValue), style]}>{staticValue}</Text>
            ) : (
              <Component
                ref={inputRef}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholderTextColor={colors.t1}
                placeholder={placeholder}
                returnKeyType={returnKeyType}
                onSubmitEditing={onSubmitEditing}
                allowFontScaling={false}
                editable={editable}
                {...rest}
                style={[
                  styles.input,
                  !editable && styles.disabledInput,
                  props.multiline && {
                    textAlignVertical: "top",
                    marginTop: 12,
                    minHeight: 70,
                  },
                  italicPlaceholder && !props.value && { fontStyle: "italic" },
                  style,
                ]}
              />
            )}
          </View>
        </View>

        {renderRightAccessory ? (
          <>
            <HorizontalSpace w={2} />
            {renderRightAccessory?.()}
            <HorizontalSpace w={2} />
          </>
        ) : (
          <></>
        )}
      </View>
      {isHelperTextVisible && (
        <HelperText style={{ marginLeft: 0 }} text={helperText} {...HelperTextProps} />
      )}
    </Wrapper>
  )
}
