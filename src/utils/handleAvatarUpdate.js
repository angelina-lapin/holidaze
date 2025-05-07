import { updateProfileAvatar } from '../api/holidaze';

export async function handleAvatarUpdate({
  user,
  avatarUrl,
  setUser,
  setModal,
}) {
  try {
    const updated = await updateProfileAvatar(user.name, avatarUrl);

    const updatedUser = {
      ...user,
      avatar: updated.avatar,
    };

    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);

    setModal({
      isOpen: true,
      title: 'Avatar Updated',
      message: 'Your profile picture has been successfully updated.',
    });
  } catch (error) {
    console.error('Avatar update error:', error);
    setModal({
      isOpen: true,
      title: 'Error',
      message: error.message || 'Something went wrong updating the avatar.',
    });
  }
}
