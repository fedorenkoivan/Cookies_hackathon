import { createContext, useContext } from 'react';
import { UserData, UserPublicData } from '@/types/user';

type ProfileContextType = {
  userData: UserData | null;
  userPublicData: UserPublicData | null;
  loading: boolean;
  error: string | null;
  fetchUserProfile: () => Promise<void>;
  fetchUserPublicProfile: (userId: string) => Promise<void>;
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