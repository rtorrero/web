import { select, put } from 'redux-saga/effects';
import { selectLocation, setLocation } from './locationSlice';

export function* handleLocationChange() {
  const location = yield select(selectLocation);

  // Perform actions based on the location
  // Example:
  if (location.pathname.startsWith('/hosts')) {
    // Do something specific for /hosts path
  } else if (location.pathname.startsWith('/host/')) {
    // Do something specific for /host/:hostId path
  }

  // Dispatch an action if needed
  // yield put(someAction(location));
}

export default handleLocationChange;
