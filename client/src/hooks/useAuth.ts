import { useSelector } from 'react-redux';
import { RootState } from '@store/store';

const useAuth = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  return isAuthenticated;
};

export default useAuth;