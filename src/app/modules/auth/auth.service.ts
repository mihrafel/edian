import bcrypt from 'bcrypt';
/* eslint-disable no-undef */
// Your service code here
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import prisma from '../../../shared/prisma';
import {
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './auth.interfaces';

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { usernameOrEmail, password } = payload;
  const isUserExist = await prisma.user.findFirst({
    where: {
      OR: [
        {
          buyer: {
            OR: [
              {
                username: usernameOrEmail,
              },
              {
                email: usernameOrEmail,
              },
            ],
          },
        },
        {
          merchant: {
            OR: [
              {
                username: usernameOrEmail,
              },
              {
                email: usernameOrEmail,
              },
            ],
          },
        },
        {
          admin: {
            OR: [
              {
                username: usernameOrEmail,
              },
              {
                email: usernameOrEmail,
              },
            ],
          },
        },
        {
          shopper: {
            OR: [
              {
                shopeId: usernameOrEmail,
              },
              {
                email: usernameOrEmail,
              },
            ],
          },
        },
      ],
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  if (
    isUserExist.password &&
    !(await bcrypt.compare(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  //create access token & refresh token

  const { id: userId, role } = isUserExist;
  const accessToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );
  let total: string | undefined;
  let message: string | undefined;

  if (isUserExist && isUserExist.shopperId !== null) {
    console.log(isUserExist);
    const data = await prisma.order.findMany({
      where: {
        orderItems: {
          some: {
            product: {
              userId: isUserExist.id,
            },
          },
        },
        isCashOnDelivery: true, // Add this condition to filter only cash on delivery orders
      },
    });

    // Calculate the sum of platformCharge for cash on delivery orders
    const sumPlatformCharge = data.reduce(
      (acc, order) => acc + (order.platformCharge || 0),
      0
    );

    if (sumPlatformCharge > 400) {
      total = `Your PlatformCharge Due is ${sumPlatformCharge}`;
    }
    if (sumPlatformCharge >= 500) {
      const res = await prisma.user.update({
        where: {
          id: isUserExist.id,
        },
        data: {
          shopper: {
            update: {
              isBlocked: true,
            },
          },
        },
      });

      // Additional action after updating the user
      message = `Your due charge is ${sumPlatformCharge}. Please pay to continue using our services.`;
    }
  }
  const response: ILoginUserResponse = {
    accessToken,
    refreshToken,
    message: '',
    total: '',
  };

  // Check if total and message are defined and add them to the response
  if (total) {
    response.total = total;
  }

  if (message) {
    response.message = message;
  }

  return response;
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  //verify token
  // invalid token - synchronous
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }

  const { userId } = verifiedToken;

  // tumi delete hye gso  kintu tumar refresh token ase
  // checking deleted user's refresh token

  const isUserExist = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }
  //generate new token

  const newAccessToken = jwtHelpers.createToken(
    {
      id: isUserExist.id,
      role: isUserExist.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

export const AuthService = {
  loginUser,
  refreshToken,
};
