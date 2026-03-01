import React, { useState } from "react"
import { StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Formik } from "formik"
import Toast from "react-native-toast-message"
import Text from "../../components/Text"
import TextInput from "../../components/Input/TextInput"
import Button from "../../components/Buttons/Buttons"
import Loader from "../../components/Loader"
import VerticalSpace from "../../components/VerticalSpace"
import { supabase } from "../../config/supabase"
import { SIGNIN_SCREEN } from "../../constants"
import { SignUpEmailValidation } from "../../constants/Validations"
import { getAuthErrorMessage } from "../../utils/authErrors"
import { colors, fonts, ResponsiveFonts } from "../../themes"

export default function SignUpScreen() {
  const nav = useNavigation()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: {
    name: string
    email: string
    password: string
    confirmPassword: string
  }) => {
    setLoading(true)
    const { data, error: err } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: { data: { name: values.name.trim() } },
    })
    setLoading(false)
    if (err) {
      Toast.show({ type: "error", text1: getAuthErrorMessage(err) })
      return
    }
    if (data.user) {
      Toast.show({ type: "success", text1: "Please confirm your email and login" })
      nav.reset({ index: 0, routes: [{ name: SIGNIN_SCREEN as never }] })
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Loader visible={loading} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text
          text="Sign Up"
          fontFamily={fonts.poppinsBold700}
          fontSize={ResponsiveFonts.px24}
          color={colors.text}
        />
        <VerticalSpace h={4} />
        <Formik
          initialValues={{ name: "", email: "", password: "", confirmPassword: "" }}
          validationSchema={SignUpEmailValidation}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleBlur, values, errors, validateForm, handleSubmit }) => (
            <>
              <TextInput
                title="Name"
                placeholder="Your name"
                value={values.name}
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
              />
              <VerticalSpace h={2} />
              <TextInput
                title="Email"
                placeholder="Email"
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <VerticalSpace h={2} />
              <TextInput
                title="Password"
                placeholder="Password"
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                secureTextEntry
              />
              <VerticalSpace h={2} />
              <TextInput
                title="Confirm Password"
                placeholder="Confirm password"
                value={values.confirmPassword}
                onChangeText={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
                secureTextEntry
              />
              <VerticalSpace h={4} />
              <Button
                text="Sign Up"
                onPress={async () => {
                  const errs = await validateForm()
                  if (Object.keys(errs).length > 0) {
                    Toast.show({ type: "error", text1: Object.values(errs)[0] as string })
                    return
                  }
                  handleSubmit()
                }}
              />
              <VerticalSpace h={2} />
              <Button
                variant="outline"
                text="Back to Sign In"
                onPress={() => nav.goBack()}
              />
            </>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.screenBackground },
  scroll: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
  },
})
