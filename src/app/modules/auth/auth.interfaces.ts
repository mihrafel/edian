// Define your interfaces here
import { ENUM_USER_ROLE } from '../../../enums/user';

export type ILoginUser = {
  usernameOrEmail: string;
  password: string;
};

export type ILoginUserResponse = {
  message: string;
  total: string;
  accessToken: string;
  refreshToken?: string;
};

export type IRefreshTokenResponse = {
  accessToken: string;
};

export type IVerifiedLoginUser = {
  userId: string;
  role: ENUM_USER_ROLE;
};
