'use client';

import { Box, Button, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { motion } from 'framer-motion';
import { object, string } from 'yup';
import { useTheme } from '@mui/material/styles';

const validationSchema = object({
  lastName: string().required('Nom requis'),
  firstName: string().required('Prénom requis'),
  phone: string().required('Téléphone requis'),
  email: string().email('Email invalide').required('Email requis'),
  subject: string().required('Objet requis'),
  message: string().required('Message requis'),
});

const ContactForm = () => {
  const theme = useTheme();

  const initialValues = {
    lastName: '',
    firstName: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  };

  const handleSubmit = (values, { resetForm }) => {
    console.log(values);
    resetForm();
    alert('Merci pour votre message !');
  };

  return (
    <Box
      component={motion.section}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true }}
      sx={{
        px: 2,
        py: 6,
        maxWidth: '800px',
        mx: 'auto',
        borderRadius: '2rem',
        boxShadow: 3,
        mb: 8,
      }}
    >
      <Typography
        variant="h4"
        align="center"
        sx={{
          mb: 4,
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 600,
          color: theme.palette.primary.main,
        }}
      >
        Contactez-nous
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, handleChange, handleBlur, values }) => (
          <Form noValidate>
            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Field
                  as={TextField}
                  fullWidth
                  name="lastName"
                  label="Nom"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.lastName}
                  error={touched.lastName && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  variant="outlined"
                  sx={{
                    borderRadius: '2rem',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '2rem',
                    },
                  }}
                />

                <Field
                  as={TextField}
                  fullWidth
                  name="firstName"
                  label="Prénom"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.firstName}
                  error={touched.firstName && Boolean(errors.firstName)}
                  helperText={touched.firstName && errors.firstName}
                  variant="outlined"
                  sx={{
                    borderRadius: '2rem',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '2rem',
                    },
                  }}
                />
              </Stack>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Field
                  as={TextField}
                  fullWidth
                  name="phone"
                  label="Téléphone"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.phone}
                  error={touched.phone && Boolean(errors.phone)}
                  helperText={touched.phone && errors.phone}
                  variant="outlined"
                  sx={{
                    borderRadius: '2rem',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '2rem',
                    },
                  }}
                />

                <Field
                  as={TextField}
                  fullWidth
                  name="email"
                  label="E-mail"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  variant="outlined"
                  sx={{
                    borderRadius: '2rem',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '2rem',
                    },
                  }}
                />
              </Stack>

              <Field
                as={TextField}
                select
                fullWidth
                name="subject"
                label="Objet du message"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.subject}
                error={touched.subject && Boolean(errors.subject)}
                helperText={touched.subject && errors.subject}
                variant="outlined"
                sx={{
                  borderRadius: '2rem',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '2rem',
                  },
                }}
              >
                <MenuItem value="">Sélectionnez...</MenuItem>
                <MenuItem value="Question">Question</MenuItem>
                <MenuItem value="Réservation">Réservation</MenuItem>
                <MenuItem value="Autre">Autre</MenuItem>
              </Field>

              <Field
                as={TextField}
                fullWidth
                name="message"
                label="Votre message"
                multiline
                rows={5}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.message}
                error={touched.message && Boolean(errors.message)}
                helperText={touched.message && errors.message}
                variant="outlined"
                sx={{
                  borderRadius: '2rem',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '2rem',
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  mt: 2,
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: '2rem',
                  fontWeight: 600,
                  fontFamily: "'Poppins', sans-serif",
                  '&:hover': {
                     backgroundColor: theme.palette.primary.dark,
                     color: 'primary.main'
                  },
                }}
              >
                Envoyer
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default ContactForm;
