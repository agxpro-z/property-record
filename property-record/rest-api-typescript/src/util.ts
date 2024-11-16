import { Application } from 'express';
import { User } from './models/users';
import { createGateway, getContracts, getNetwork } from './fabric';
import { Contract } from 'fabric-network';

export const getUserContract = async (app: Application, userId: string): Promise<Contract> => {
  console.log(userId);

  if (['Org1MSP', 'Org2MSP', 'Org3MSP', 'Org4MSP', 'Org5MSP'].includes(userId)) {
    const contract = app.locals[userId]?.assetContract;
    return contract;
  } else {
    const user = await User.findOne({ email: userId });
    const gateway = await createGateway(
      app.locals[user?.orgId + 'CCP'],
      userId,
      app.locals.wallet
    );
    const network = await getNetwork(gateway);
    const contract = await getContracts(network);
    return contract.assetContract;
  }
};
