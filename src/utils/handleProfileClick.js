export function handleProfileClick(user, navigate) {
  if (user?.venueManager) {
    navigate('/manager-profile');
  } else {
    navigate('/user-profile');
  }
}
