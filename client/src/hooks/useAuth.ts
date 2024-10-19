import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const useAuth = () => {
  const auth = useSelector((state: RootState) => state.auth);
  return {
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.status === 'loading',
  }
};

export default useAuth;