import React, { useState } from "react"
import { StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Formik } from "formik"
import { useDispatch } from "react-redux"
import Toast from "react-native-toast-message"
import Text from "../../components/Text"
import TextInput from "../../components/Input/TextInput"
import Button from "../../components/Buttons/Buttons"
import Loader from "../../components/Loader"
import VerticalSpace from "../../components/VerticalSpace"
import { supabase } from "../../config/supabase"
import { setUser } from "../../redux/slices/authSlice"
import { MAIN_STACK, SIGNUP_SCREEN } from "../../constants"
import { LoginValidation } from "../../constants/Validations"
import { getAuthErrorMessage } from "../../utils/authErrors"
import { colors, fonts, ResponsiveFonts } from "../../themes"

export default function SignInScreen() {
  const nav = useNavigation()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true)
    const { data, error: err } = await supabase.auth.signInWithPassword(values)
    setLoading(false)
    if (err) {
      Toast.show({ type: "error", text1: getAuthErrorMessage(err) })
      return
    }
    if (data.user) {
      dispatch(setUser(data.user))
      await supabase.from("users").upsert(
        {
          id: data.user.id,
          email: data.user.email ?? "",
          name: (data.user.user_metadata?.name as string) ?? "",
        },
        { onConflict: "id" }
      )
      Toast.show({ type: "success", text1: "Signed in successfully" })
      nav.reset({ index: 0, routes: [{ name: MAIN_STACK as never }] })
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
          text="Sign In"
          fontFamily={fonts.poppinsBold700}
          fontSize={ResponsiveFonts.px24}
          color={colors.text}
        />
        <VerticalSpace h={4} />
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginValidation}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleBlur, values, errors, validateForm, handleSubmit }) => (
            <>
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
              <VerticalSpace h={4} />
              <Button
                text="Sign In"
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
                text="Sign Up"
                onPress={() => nav.navigate(SIGNUP_SCREEN as never)}
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
