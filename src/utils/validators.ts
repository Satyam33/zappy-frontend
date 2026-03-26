import * as Yup from 'yup'

export const loginSchema = Yup.object({
  email:    Yup.string().email('Enter a valid email').required('Email is required'),
  password: Yup.string().required('Password is required').min(6, 'Min 6 characters'),
})

export const signupSchema = Yup.object({
  name:     Yup.string().required('Name is required').min(2, 'Min 2 characters'),
  email:    Yup.string().email('Enter a valid email').required('Email is required'),
  mobile:   Yup.string()
    .required('Mobile is required')
    .matches(/^\+[1-9]\d{7,14}$/, 'Use E.164 format e.g. +919999999999'),
  orgName:  Yup.string().required('Business name is required'),
  password: Yup.string().required('Password is required').min(6, 'Min 6 characters'),
  confirmPassword: Yup.string()
    .required('Confirm password is required')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
})

export const addContactSchema = Yup.object({
  name:  Yup.string().required('Name is required').min(2, 'Min 2 characters'),
  phone: Yup.string()
    .required('Phone number is required')
    .matches(/^\+[1-9]\d{7,14}$/, 'Must be valid E.164 format e.g. +919876543210'),
  tags: Yup.array().of(Yup.string()),
})

export const newTemplateSchema = Yup.object({
  name: Yup.string()
    .required('Template name is required')
    .matches(/^[a-z0-9_]+$/, 'Only lowercase letters, numbers and underscores'),
  category: Yup.string().required('Category is required'),
  language: Yup.string().required('Language is required'),
  body: Yup.string()
    .required('Message body is required')
    .max(1024, 'Body cannot exceed 1024 characters'),
})

export const newCampaignSchema = Yup.object({
  name:       Yup.string().required('Campaign name is required'),
  templateId: Yup.string().required('Please select a template'),
  segment:    Yup.string().required('Please select a target segment'),
  scheduleNow: Yup.boolean(),
  scheduledAt: Yup.string().when('scheduleNow', {
    is: false,
    then: schema => schema.required('Please pick a schedule date/time'),
  }),
})

export const businessProfileSchema = Yup.object({
  name:         Yup.string().required('Business name is required'),
  displayPhone: Yup.string(),
  category:     Yup.string(),
  timezone:     Yup.string(),
  optOutKeyword:Yup.string(),
})
