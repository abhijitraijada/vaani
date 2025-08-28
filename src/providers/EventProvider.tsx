import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchEvents } from '../store/eventSlice';
import { Spinner } from '../components/overlays/Overlays';

export function EventProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { isLoading, activeEvent, error } = useAppSelector(state => state.events);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  // Show full-screen loader while fetching events
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Spinner size={48} />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading event data...</p>
        </div>
      </div>
    );
  }

  // Show error state if events failed to load
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Failed to Load Events</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button 
            onClick={() => dispatch(fetchEvents())}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Only render children when we have an active event
  if (!activeEvent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📅</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No Active Events</h2>
          <p className="text-gray-600 dark:text-gray-400">There are currently no active events available.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
