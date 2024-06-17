import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLocation } from '@state/locationSlice';

const LocationListener = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLocation(location));
  }, [location, dispatch]);

  return null;
};

export default LocationListener;
