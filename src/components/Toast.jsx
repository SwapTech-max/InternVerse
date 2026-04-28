function Toast({ message, type = 'success', onClose }) {
  if (!message) {
    return null;
  }

  const palette =
    type === 'error'
      ? 'bg-red-50 border-red-200 text-red-700'
      : 'bg-green-50 border-green-200 text-green-700';

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm w-[calc(100%-2rem)] border rounded-lg shadow-md p-4 ${palette}`}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="text-xs font-semibold opacity-75 hover:opacity-100 transition-opacity"
          aria-label="Close notification"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default Toast;
