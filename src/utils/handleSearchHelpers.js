export function handleSearch(location, navigate) {
  if (location.trim()) {
    navigate(`/?location=${encodeURIComponent(location.trim())}`);
  }
}

export function handleClear(setLocation, navigate) {
  setLocation('');
  navigate('/');
}
