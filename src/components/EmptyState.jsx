export default function EmptyState({
  loading,
  items,
  message = 'Nothing found.',
}) {
  if (loading) return <p>Loading...</p>;
  if (!items || items.length === 0) return <p>{message}</p>;
  return null;
}
