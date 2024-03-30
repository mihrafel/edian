import { Admin, Buyer, Merchant, Shopper, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { CloudinaryUploadFile } from '../product/product.interfaces';
import { uploadToCloudinary } from '../product/product.utils';
import { generateShopperId } from './user.utils';
// const accountSid: string | undefined = config.twilio.twilio_account_sid;
// const authToken = config.twilio.twilio_auth_token;
// const client = new Twilio(accountSid, authToken);

// import { initClient } from 'messagebird';

// const messagebirdApiKey = config.messagebird?.messagebird_api_key;

// if (!messagebirdApiKey || typeof messagebirdApiKey !== 'string') {
//   throw new Error('MessageBird API key is missing or invalid.');
// }

// const messagebird = initClient(messagebirdApiKey);

// Your service code here
const createBuyer = async (buyer: Buyer, user: User): Promise<User | null> => {
  // set role
  user.role = 'buyer';

  const isEmailExist = await prisma.buyer.findFirst({
    where: {
      email: buyer.email,
    },
  });

  if (isEmailExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This email already exists');
  }

  const isUserNameExist = await prisma.buyer.findFirst({
    where: {
      username: buyer.username,
    },
  });

  if (isUserNameExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This username already exists');
  }

  const hashedPassword = await bcrypt.hash(
    user.password,
    Number(config.bycrypt_salt_rounds)
  );

  const data = await prisma.$transaction(async transactionClient => {
    const buyers = await transactionClient.buyer.create({
      data: {
        email: buyer.email,
        username: buyer.username,
        zoneId: buyer.zoneId,
        address: buyer.address,
        mobileNumber: buyer.mobileNumber,
      },
    });

    const createNewUser = await transactionClient.user.create({
      data: {
        role: user.role,
        password: hashedPassword,
        buyerId: buyers.id,
      },
      include: {
        buyer: true,
      },
    });

    if (!createNewUser) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    // let OTPCode = Math.floor(100000 + Math.random() * 900000);
    // const createNewOtp = await transactionClient.otp.create({
    //   data: {
    //     mobileNumber: buyer.mobileNumber,
    //     otp: OTPCode,
    //   },
    // });
    //VAc5ba462e6fd12da96ec2b461d7339c3e
    // const verificationCheck = await client.verify.v2
    //   .services('VAc5ba462e6fd12da96ec2b461d7339c3e')
    //   .verificationChecks.create({
    //     to: `+88${buyer.mobileNumber}`, // Ensure mobileNumber is in E.164 format
    //     code: OTPCode.toString(), // Ensure OTPCode is a string
    //   });

    // console.log(verificationCheck.status);
    // const verificationCheck = await (client.verify.v2
    //   .services('VAc5ba462e6fd12da96ec2b461d7339c3e')
    //   .verificationChecks.create({
    //     to: `+88${buyer.mobileNumber}`,
    //     code: OTPCode.toString(),
    //   }) as Promise<VerificationCheckInstance>);

    // console.log(verificationCheck.status);

    // If the verification check is successful, you can send an SMS

    // const message = await (client.messages.create({
    //   body: `Your verification Code is ${OTPCode}`,
    //   from: '+8801644836367', // Replace with your Twilio phone number
    //   to: `+88${buyer.mobileNumber}`,
    // }) as Promise<MessageInstance>);

    // console.log(message); // Log the SID of the sent SMS

    // var params = {
    //   template: `Your verification Code is %token`,
    //   timeout: 5000,
    // };

    // messagebird.verify.create(
    //   `+88${buyer.mobileNumber}`,
    //   params,
    //   function (err, response) {
    //     if (err) {
    //       return console.log('OTP Sending failed', err);
    //     }
    //     console.log(response);
    //   }
    // );

    return createNewUser;
  });
  return data;
};
const createMerchant = async (
  merchant: Merchant,
  user: User
): Promise<User | null> => {
  // set role
  user.role = 'merchant';

  const isEmailExist = await prisma.merchant.findFirst({
    where: {
      email: merchant.email,
    },
  });

  if (isEmailExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This email already exists');
  }
  const isBuyerEmailExist = await prisma.buyer.findFirst({
    where: {
      email: merchant.email,
    },
  });

  if (isBuyerEmailExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This email already exists');
  }
  const isMobileNumberExist = await prisma.merchant.findFirst({
    where: {
      mobileNumber: merchant.mobileNumber,
    },
  });

  if (isMobileNumberExist) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'This mobile number already exists'
    );
  }
  const isBuyerMobileNumberExist = await prisma.buyer.findFirst({
    where: {
      mobileNumber: merchant.mobileNumber,
    },
  });

  if (isBuyerMobileNumberExist) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'This mobile number already exists'
    );
  }

  const isUserNameExist = await prisma.merchant.findFirst({
    where: {
      username: merchant.username,
    },
  });

  if (isUserNameExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This username already exists');
  }
  const isBuyerUserNameExist = await prisma.buyer.findFirst({
    where: {
      username: merchant.username,
    },
  });

  if (isBuyerUserNameExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This username already exists');
  }

  const hashedPassword = await bcrypt.hash(
    user.password,
    Number(config.bycrypt_salt_rounds)
  );

  const data = await prisma.$transaction(async transactionClient => {
    const merchants = await transactionClient.merchant.create({
      data: {
        email: merchant.email,
        username: merchant.username,
        zoneId: merchant.zoneId,
        address: merchant.address,
        mobileNumber: merchant.mobileNumber,
      },
    });

    const createNewUser = await transactionClient.user.create({
      data: {
        role: user.role,
        password: hashedPassword,
        merchantId: merchants.id,
      },
      include: {
        merchant: true,
      },
    });

    if (!createNewUser) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    // let OTPCode = Math.floor(100000 + Math.random() * 900000);
    // const createNewOtp = await transactionClient.otp.create({
    //   data: {
    //     mobileNumber: buyer.mobileNumber,
    //     otp: OTPCode,
    //   },
    // });
    //VAc5ba462e6fd12da96ec2b461d7339c3e
    // const verificationCheck = await client.verify.v2
    //   .services('VAc5ba462e6fd12da96ec2b461d7339c3e')
    //   .verificationChecks.create({
    //     to: `+88${buyer.mobileNumber}`, // Ensure mobileNumber is in E.164 format
    //     code: OTPCode.toString(), // Ensure OTPCode is a string
    //   });

    // console.log(verificationCheck.status);
    // const verificationCheck = await (client.verify.v2
    //   .services('VAc5ba462e6fd12da96ec2b461d7339c3e')
    //   .verificationChecks.create({
    //     to: `+88${buyer.mobileNumber}`,
    //     code: OTPCode.toString(),
    //   }) as Promise<VerificationCheckInstance>);

    // console.log(verificationCheck.status);

    // If the verification check is successful, you can send an SMS

    // const message = await (client.messages.create({
    //   body: `Your verification Code is ${OTPCode}`,
    //   from: '+8801644836367', // Replace with your Twilio phone number
    //   to: `+88${buyer.mobileNumber}`,
    // }) as Promise<MessageInstance>);

    // console.log(message); // Log the SID of the sent SMS

    // var params = {
    //   template: `Your verification Code is %token`,
    //   timeout: 5000,
    // };

    // messagebird.verify.create(
    //   `+88${buyer.mobileNumber}`,
    //   params,
    //   function (err, response) {
    //     if (err) {
    //       return console.log('OTP Sending failed', err);
    //     }
    //     console.log(response);
    //   }
    // );

    return createNewUser;
  });
  return data;
};
const createAdmin = async (admin: Admin, user: User): Promise<User | null> => {
  // set role
  user.role = 'admin';

  const isEmailExist = await prisma.admin.findFirst({
    where: {
      email: admin.email,
    },
  });

  if (isEmailExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This email already exists');
  }
  const isMerchantEmailExist = await prisma.merchant.findFirst({
    where: {
      email: admin.email,
    },
  });

  if (isMerchantEmailExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This email already exists');
  }
  const isBuyerEmailExist = await prisma.buyer.findFirst({
    where: {
      email: admin.email,
    },
  });

  if (isBuyerEmailExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This email already exists');
  }
  const isMobileNumberExist = await prisma.admin.findFirst({
    where: {
      mobileNumber: admin.mobileNumber,
    },
  });

  if (isMobileNumberExist) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'This mobile number already exists'
    );
  }
  const isMerchantMobileNumberExist = await prisma.merchant.findFirst({
    where: {
      mobileNumber: admin.mobileNumber,
    },
  });

  if (isMerchantMobileNumberExist) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'This mobile number already exists'
    );
  }
  const isBuyerMobileNumberExist = await prisma.buyer.findFirst({
    where: {
      mobileNumber: admin.mobileNumber,
    },
  });

  if (isBuyerMobileNumberExist) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'This mobile number already exists'
    );
  }

  const isUserNameExist = await prisma.admin.findFirst({
    where: {
      username: admin.username,
    },
  });

  if (isUserNameExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This username already exists');
  }
  const isMerchantUserNameExist = await prisma.merchant.findFirst({
    where: {
      username: admin.username,
    },
  });

  if (isMerchantUserNameExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This username already exists');
  }
  const isBuyerUserNameExist = await prisma.buyer.findFirst({
    where: {
      username: admin.username,
    },
  });

  if (isBuyerUserNameExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This username already exists');
  }

  const hashedPassword = await bcrypt.hash(
    user.password,
    Number(config.bycrypt_salt_rounds)
  );

  const data = await prisma.$transaction(async transactionClient => {
    const admins = await transactionClient.admin.create({
      data: {
        email: admin.email,
        username: admin.username,
        address: admin.address,
        mobileNumber: admin.mobileNumber,
      },
    });

    const createNewUser = await transactionClient.user.create({
      data: {
        role: user.role,
        password: hashedPassword,
        adminId: admins.id,
      },
      include: {
        admin: true,
      },
    });

    if (!createNewUser) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    // let OTPCode = Math.floor(100000 + Math.random() * 900000);
    // const createNewOtp = await transactionClient.otp.create({
    //   data: {
    //     mobileNumber: buyer.mobileNumber,
    //     otp: OTPCode,
    //   },
    // });
    //VAc5ba462e6fd12da96ec2b461d7339c3e
    // const verificationCheck = await client.verify.v2
    //   .services('VAc5ba462e6fd12da96ec2b461d7339c3e')
    //   .verificationChecks.create({
    //     to: `+88${buyer.mobileNumber}`, // Ensure mobileNumber is in E.164 format
    //     code: OTPCode.toString(), // Ensure OTPCode is a string
    //   });

    // console.log(verificationCheck.status);
    // const verificationCheck = await (client.verify.v2
    //   .services('VAc5ba462e6fd12da96ec2b461d7339c3e')
    //   .verificationChecks.create({
    //     to: `+88${buyer.mobileNumber}`,
    //     code: OTPCode.toString(),
    //   }) as Promise<VerificationCheckInstance>);

    // console.log(verificationCheck.status);

    // If the verification check is successful, you can send an SMS

    // const message = await (client.messages.create({
    //   body: `Your verification Code is ${OTPCode}`,
    //   from: '+8801644836367', // Replace with your Twilio phone number
    //   to: `+88${buyer.mobileNumber}`,
    // }) as Promise<MessageInstance>);

    // console.log(message); // Log the SID of the sent SMS

    // var params = {
    //   template: `Your verification Code is %token`,
    //   timeout: 5000,
    // };

    // messagebird.verify.create(
    //   `+88${buyer.mobileNumber}`,
    //   params,
    //   function (err, response) {
    //     if (err) {
    //       return console.log('OTP Sending failed', err);
    //     }
    //     console.log(response);
    //   }
    // );

    return createNewUser;
  });
  return data;
};
const createShopper = async (
  shopper: Shopper,
  user: User
): Promise<User | null> => {
  //User | null
  // console.log(`shopper: ${shopper}`);
  // console.log(`user: ${user}`);
  // set role
  user.role = 'shopper';

  const isEmailExist = await prisma.shopper.findFirst({
    where: {
      email: shopper.email,
    },
  });
  // console.log(isEmailExist);

  if (isEmailExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This email already exists');
  }
  const isAdminEmailExist = await prisma.admin.findFirst({
    where: {
      email: shopper.email,
    },
  });

  if (isAdminEmailExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This email already exists');
  }
  const isMerchantEmailExist = await prisma.merchant.findFirst({
    where: {
      email: shopper.email,
    },
  });

  if (isMerchantEmailExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This email already exists');
  }
  const isBuyerEmailExist = await prisma.buyer.findFirst({
    where: {
      email: shopper.email,
    },
  });

  if (isBuyerEmailExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This email already exists');
  }
  const isMobileNumberExist = await prisma.shopper.findFirst({
    where: {
      mobileNumber: shopper.mobileNumber,
    },
  });
  if (isMobileNumberExist) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'This mobile number already exists'
    );
  }
  const isAdminMobileNumberExist = await prisma.admin.findFirst({
    where: {
      mobileNumber: shopper.mobileNumber,
    },
  });

  if (isAdminMobileNumberExist) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'This mobile number already exists'
    );
  }
  const isMerchantMobileNumberExist = await prisma.merchant.findFirst({
    where: {
      mobileNumber: shopper.mobileNumber,
    },
  });

  if (isMerchantMobileNumberExist) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'This mobile number already exists'
    );
  }
  const isBuyerMobileNumberExist = await prisma.buyer.findFirst({
    where: {
      mobileNumber: shopper.mobileNumber,
    },
  });

  if (isBuyerMobileNumberExist) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'This mobile number already exists'
    );
  }

  const hashedPassword = await bcrypt.hash(
    user.password,
    Number(config.bycrypt_salt_rounds)
  );
  const id = await generateShopperId();
  // console.log(`shopper id: ${id}`);
  const picture = await uploadToCloudinary(
    shopper.picture as unknown as CloudinaryUploadFile[]
  );
  // console.log(`shopper picture: ${picture}`);
  const tradeLicensePicture = await uploadToCloudinary(
    shopper.tradeLicensePicture as unknown as CloudinaryUploadFile[]
  );

  // console.log(`trade license picture: ${tradeLicensePicture}`);

  const data = await prisma.$transaction(async transactionClient => {
    const shoppers = await transactionClient.shopper.create({
      data: {
        email: shopper.email,
        address: shopper.address,
        mobileNumber: shopper.mobileNumber,
        picture: picture,
        shopName: shopper.shopName,
        tradeLicense: shopper.tradeLicense,
        tradeLicensePicture: tradeLicensePicture,
        shopeId: id,
        ward: shopper.ward,
      },
    });

    const createNewUser = await transactionClient.user.create({
      data: {
        role: user.role,
        password: hashedPassword,
        shopperId: shoppers.id,
      },
      include: {
        shopper: true,
      },
    });

    if (!createNewUser) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    //   // let OTPCode = Math.floor(100000 + Math.random() * 900000);
    //   // const createNewOtp = await transactionClient.otp.create({
    //   //   data: {
    //   //     mobileNumber: buyer.mobileNumber,
    //   //     otp: OTPCode,
    //   //   },
    //   // });
    //   //VAc5ba462e6fd12da96ec2b461d7339c3e
    //   // const verificationCheck = await client.verify.v2
    //   //   .services('VAc5ba462e6fd12da96ec2b461d7339c3e')
    //   //   .verificationChecks.create({
    //   //     to: `+88${buyer.mobileNumber}`, // Ensure mobileNumber is in E.164 format
    //   //     code: OTPCode.toString(), // Ensure OTPCode is a string
    //   //   });

    //   // console.log(verificationCheck.status);
    //   // const verificationCheck = await (client.verify.v2
    //   //   .services('VAc5ba462e6fd12da96ec2b461d7339c3e')
    //   //   .verificationChecks.create({
    //   //     to: `+88${buyer.mobileNumber}`,
    //   //     code: OTPCode.toString(),
    //   //   }) as Promise<VerificationCheckInstance>);

    //   // console.log(verificationCheck.status);

    //   // If the verification check is successful, you can send an SMS

    //   // const message = await (client.messages.create({
    //   //   body: `Your verification Code is ${OTPCode}`,
    //   //   from: '+8801644836367', // Replace with your Twilio phone number
    //   //   to: `+88${buyer.mobileNumber}`,
    //   // }) as Promise<MessageInstance>);

    //   // console.log(message); // Log the SID of the sent SMS

    //   // var params = {
    //   //   template: `Your verification Code is %token`,
    //   //   timeout: 5000,
    //   // };

    //   // messagebird.verify.create(
    //   //   `+88${buyer.mobileNumber}`,
    //   //   params,
    //   //   function (err, response) {
    //   //     if (err) {
    //   //       return console.log('OTP Sending failed', err);
    //   //     }
    //   //     console.log(response);
    //   //   }
    //   // );

    return createNewUser;
  });
  return data;
};

export const UserService = {
  createBuyer,
  createMerchant,
  createAdmin,
  createShopper,
};
