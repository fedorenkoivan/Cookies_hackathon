import { createContext, useContext } from 'react';
import { UserData } from '@/types/user';

type ProfileContextType = {
  userData: UserData | null;
  loading: boolean;
  error: string | null;
  fetchUserProfile: () => Promise<void>;
  logout: () => void;
};

export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfileContext must be used within a ProfileProvider');
  }
  return context;
};