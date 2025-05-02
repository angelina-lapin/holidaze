import { register } from '../api/auth';

function validateEmail(email) {
  return email.endsWith('@stud.noroff.no');
}

function validatePassword(password) {
  return password.length >= 8;
}

export async function handleRegisterSubmit({
  name,
  email,
  password,
  venueManager,
  setModal,
  navigate,
}) {
  if (!validateEmail(email)) {
    return setModal({
      isOpen: true,
      title: 'Invalid Email',
      message: 'Email must end with @stud.noroff.no',
    });
  }

  if (!validatePassword(password)) {
    return setModal({
      isOpen: true,
      title: 'Weak Password',
      message: 'Password must be at least 8 characters long.',
    });
  }

  try {
    await register(name, email, password, venueManager);
    setModal({
      isOpen: true,
      title: 'Registration successful',
      message: 'You can now log in to your account.',
    });
  } catch (error) {
    setModal({
      isOpen: true,
      title: 'Registration failed',
      message: error.message,
    });
  }
}
