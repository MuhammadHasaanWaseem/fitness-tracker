import * as Yup from "yup"

const nameRegex = /^[a-zA-Z\u0600-\u06FF\s]+$/
const contactNumberRegex = /^[0-9]{10}$/
const alphaNumericRegex = /^[a-zA-Z0-9]+$/
const pinRegex = /^[0-9]{4}$/

export const passwordValidation = {
  password: Yup.string()
    .trim()
    .matches(pinRegex, "validation.invalidPassword")
    .required("validation.requirePassword"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "validation.passwordMustMatch")
    .required("validation.requireConfirmPassword"),
}

export const signUpValidation = Yup.object().shape({
  phone: Yup.string()
    .trim()
    .matches(contactNumberRegex, "validation.invalidPhone")
    .required("validation.requirePhone"),
})

export const SignUpEmailValidation = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  email: Yup.string().trim().email("Email is invalid").required("Email is required"),
  password: Yup.string()
    .min(8, "Password should be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one digit")
    .matches(/[@$!%*?&#]/, "Password must contain at least one special character")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
})

export const LoginValidation = Yup.object().shape({
  email: Yup.string()
    .trim()
    .email("Email is invalid")
    .test("has-dot-after-domain", "Email must contain a dot after the domain", (value) => {
      if (!value) return true // skip if value is not provided yet (for required validation)
      const domainPart = value.split("@")[1]
      return domainPart ? domainPart.includes(".") : false
    })
    .required("Email is Required"),
  password: Yup.string()
    .min(8, "Password should be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one digit")
    .matches(/[@$!%*?&#]/, "Password must contain at least one special character")
    .required("Password is Required"),
})

export const changePasswordValidation = Yup.object().shape({
  ...passwordValidation,
})

export const ForgotPasswordValidation = Yup.object().shape({
  email: Yup.string().trim().email("Email is invalid").required("Email is Required"),
})

export const AddShopValidation = Yup.object().shape({
  storeName: Yup.string()
    .trim()
    .matches(nameRegex, "validation.invalidStoreName")
    .required("validation.requireStoreName"),
  location: Yup.string().trim().required("validation.requireStoreLocation"),
  sales: Yup.number().typeError("validation.numberValidation"),
  revenue: Yup.number().typeError("validation.numberValidation"),
})

export const emailSchema = Yup.string().email().required()
export const phoneSchema = Yup.string().matches(contactNumberRegex).required()
export const nameSchema = Yup.string().matches(nameRegex).required()

export const SignUpValidationSchema = Yup.object().shape({
  firstname: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .matches(/^[A-Za-z]+$/, "Numbers are not allowed")
    .max(40, "First name cannot exceed 40 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .max(40, "Last name cannot exceed 40 characters")
    .matches(/^[A-Za-z]+$/, "Numbers are not allowed")
    .required("Last name is required"),
  userName: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .max(40, "Username cannot exceed 40 characters")
    .required("Username is required"),
  email: Yup.string()
    .trim()
    .test("email-or-phone", "Email is required", function (value) {
      const { OtpMethod } = this.parent

      if (OtpMethod === "email") {
        if (!value) return false
        return Yup.string()
          .trim()
          .email("Email is invalid")
          .test("has-dot-after-domain", "Email must contain a dot after the domain", (val) => {
            if (!val) return true // Skip if value is not provided yet (for required validation)
            const domainPart = val.split("@")[1]
            return domainPart ? domainPart.includes(".") : false
          })
          .isValidSync(value)
      }

      return true
    }),
  phoneNumber: Yup.string().test("phone-or-email", function (value) {
    const { OtpMethod } = this.parent

    if (OtpMethod === "phoneNumber") {
      if (!value) return this.createError({ message: "Phone number is required" })

      // Regex to check the phone number format
      const phoneRegex = /^\+?[1-9]\d{1,14}$/

      // Check if the value matches the regex
      if (!phoneRegex.test(value)) {
        return this.createError({ message: "Please enter a valid phone number" })
      }

      // Check if the total length is 16 characters (max for global numbers)
      if (value.length > 16) {
        return this.createError({
          message: "Please enter a correct phone number (max 16 characters)",
        })
      }

      return true
    }
    return true
  }),
})

export const verificationFormFields = Yup.object().shape({
  nationalId: Yup.string()
    .required("National ID is required")
    .min(12, "National ID must be at least 12 characters")
    .matches(/^[0-9]+$/, "National ID must contain only numbers"),
  firstName: Yup.string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .matches(/^[a-zA-Z\s]*$/, "First Name can only contain letters and spaces"),
  lastName: Yup.string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .matches(/^[a-zA-Z\s]*$/, "Last name can only contain letters and spaces"),
  dateOfBirth: Yup.string()
    .required("Date of birth is required")
    .matches(
      /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/,
      "Invalid date format (MM/DD/YYYY)",
    ),
  addressLine1: Yup.string()
    .required("Address is required")
    .min(5, "Address must be at least 5 characters"),
  city: Yup.string()
    .required("City is required")
    .min(2, "City must be at least 2 characters")
    .matches(/^[a-zA-Z\s]*$/, "City can only contain letters and spaces"),
  state: Yup.string()
    .required("State is required")
    .min(2, "State must be at least 2 characters")
    .matches(/^[a-zA-Z\s]*$/, "State can only contain letters and spaces"),
  country: Yup.string()
    .required("Country is required")
    .min(2, "Country must be at least 2 characters")
    .matches(/^[a-zA-Z\s]*$/, "Country can only contain letters and spaces"),
  zipCode: Yup.string()
    .required("ZIP code is required")
    .matches(/^\d{5,6}$/, "ZIP code must be 5-6 digits"),
})

export const phoneValidationSchema = Yup.object().shape({
  phoneNumber: Yup.string()
    .matches(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number")
    .required("Phone number is required"),
  email: Yup.string(),
})

export const emailValidationSchema = Yup.object().shape({
  email: Yup.string().email("Please enter a valid email").required("Email is required"),
  phoneNumber: Yup.string(),
})

export const OtpValidationSchema = Yup.object({
  verificationCode: Yup.string()
    .matches(/^\d{6}$/, "OTP must be exactly 6 digits and contain only numbers") // Only digits allowed
    .required("Verification code is required"),
})

export const ssnValidationSchema = Yup.object().shape({
  ssn: Yup.string()
    .matches(/^\d{9}$/, "SSN must be exactly 9 digits")

    .required("SSN is required"),
})

export const BankAccountSchema = Yup.object().shape({
  bankName: Yup.string().required("Bank name is required"),
  accountNumber: Yup.string()
    .matches(/^\d+$/, "Account number must contain only digits")
    .min(10, "Account number must be at least 10 digits")
    .required("Account number is required"),
  accountName: Yup.string().required("Account name is required"),
  routingNumber: Yup.string()
    .matches(/^\d+$/, "Routing number must contain only digits")
    .min(9, "Routing number must be at least 9 digits")
    .required("Routing number is required"),
  accountType: Yup.string().required("Account type is required"),
})

export const EditUserProfile = Yup.object().shape({
  firstName: Yup.string()
    .trim()
    .min(3, "First Name must be at least 3 characters")
    .max(40, "First Name cannot exceed 40 characters")
    .matches(/^[A-Za-z ]+$/, "Only letters are allowed")
    .trim(),
  // .required("First Name is required"),
  lastName: Yup.string()
    .min(3, "Last Name must be at least 3 characters")
    .max(40, "Last Name cannot exceed 40 characters")
    .matches(/^[A-Za-z ]+$/, "Only letters are allowed")
    .trim(),
  // .required("Last Name is required"),
  userName: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .max(40, "Username cannot exceed 40 characters"),
  // .required("Username is required"),
  email: Yup.string().email("Please enter a valid email"),

  phoneNumber: Yup.string().test("phone-or-email", function (value) {
    if (!value) return true

    // Regex to check the phone number format
    const phoneRegex = /^\+?[1-9]\d{1,14}$/

    // Check if the value matches the regex
    if (!phoneRegex.test(value)) {
      return this.createError({ message: "Please enter a valid phone number" })
    }

    // Check if the total length is 16 characters (max for global numbers)
    if (value.length > 16) {
      return this.createError({
        message: "Please enter a correct phone number (max 16 characters)",
      })
    }

    return true
  }),
})
