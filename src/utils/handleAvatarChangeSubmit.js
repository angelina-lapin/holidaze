import { handleAvatarUpdate } from './handleAvatarUpdate';

export function handleAvatarChangeSubmit({
  e,
  user,
  newAvatar,
  setUser,
  setModal,
  setNewAvatar,
}) {
  e.preventDefault();
  if (!user) return;

  handleAvatarUpdate({ user, avatarUrl: newAvatar, setUser, setModal });
  setNewAvatar('');
}
