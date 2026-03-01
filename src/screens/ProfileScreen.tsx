import React, { useEffect, useState } from "react"
import { View, StyleSheet } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import Toast from "react-native-toast-message"
import Text from "../components/Text"
import Button from "../components/Buttons/Buttons"
import VerticalSpace from "../components/VerticalSpace"
import { supabase } from "../config/supabase"
import { selectAuth } from "../redux/slices/authSlice"
import { signOut } from "../redux/slices/authSlice"
import { colors, fonts, ResponsiveFonts } from "../themes"

export default function ProfileScreen() {
  const dispatch = useDispatch()
  const { user } = useSelector(selectAuth)
  const [name, setName] = useState<string>("")

  useEffect(() => {
    if (!user?.id) return
    supabase
      .from("users")
      .select("name")
      .eq("id", user.id)
      .single()
      .then(({ data }) => setName(data?.name ?? ""))
  }, [user?.id])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    dispatch(signOut())
    Toast.show({ type: "success", text1: "Logged out" })
  }

  return (
    <View style={styles.container}>
      <Text
        text="Profile"
        fontFamily={fonts.poppinsBold700}
        fontSize={ResponsiveFonts.px24}
        color={colors.text}
        bottom={8}
      />
      {name ? (
        <Text
          text={name}
          fontFamily={fonts.poppinsSemiBold600}
          fontSize={ResponsiveFonts.px16}
          color={colors.text}
          bottom={4}
        />
      ) : null}
      {user?.email && (
        <Text
          text={user.email}
          fontSize={ResponsiveFonts.px14}
          color={colors.t4}
          bottom={24}
        />
      )}
      <VerticalSpace h={4} />
      <Button text="Logout" variant="outline" onPress={handleLogout} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.screenBackground,
    padding: 24,
    paddingTop: 48,
  },
})
