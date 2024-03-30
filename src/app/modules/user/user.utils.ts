import prisma from '../../../shared/prisma';

// Shopper ID
export const findLastShopperId = async (): Promise<string | undefined> => {
  const lastShopper = await prisma.shopper.findFirst({
    orderBy: {
      createdAt: 'desc',
    },
  });
  return lastShopper?.shopeId;
};

// export const generateShopperId = async (): Promise<string> => {
//   const currentId =
//     (await findLastShopperId()) || (0).toString().padStart(4, '0'); //00000
//   // increment by 1
//   console.log(parseInt(currentId));
//   let incrementedId = (parseInt(currentId) + 1).toString().padStart(4, '0');
//   console.log(incrementedId);

//   incrementedId = `${incrementedId}`;

//   console.log(incrementedId);
//   return incrementedId;

//   // return incrementedId;
// };

export const generateShopperId = async (): Promise<string> => {
  const currentId = (await findLastShopperId()) || '00000000'; // Default to '00000000' if no previous shopper

  // increment by 1
  let incrementedId = (parseInt(currentId) + 1).toString().padStart(8, '0');

  incrementedId = `${incrementedId}`;

  return incrementedId;
};
