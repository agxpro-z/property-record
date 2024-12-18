/*
 * SPDX-License-Identifier: Apache-2.0
 */
// Deterministic JSON.stringify()
import {Context, Contract, Info, Returns, Transaction} from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import sortKeysRecursive from 'sort-keys-recursive';
import {Asset} from './asset';

@Info({title: 'AssetTransfer', description: 'Smart contract for trading assets'})
export class AssetTransferContract extends Contract {

  @Transaction()
  public async InitLedger(ctx: Context): Promise<void> {
    const assets: Asset[] = [
      {
        ID: 'LAND-0001-2024',
        Type: 'Private Property',
        Size: 500, // Size in square meters
        Owner: 'Alpha',
        OwnerId: 'OWNER-001',
        OwnerContact: '9001100100',
        State: 'Unknown',
        District: 'Interstellar',
        Pin: '000000',
        AppraisedValue: 100000000000 // Appraised value in INR
      },
      {
        ID: 'LAND-0002-2024',
        Type: 'Plot',
        Size: 750,
        Owner: 'Beta',
        OwnerId: 'OWNER-002',
        OwnerContact: '9001100101',
        State: 'Telangana',
        District: 'Warangal',
        Pin: '506004',
        AppraisedValue: 20000000
      },
      {
        ID: 'LAND-0003-2024',
        Type: 'Agricultural Land',
        Size: 1200,
        Owner: 'Gamma',
        OwnerId: 'OWNER-003',
        OwnerContact: '9001100102',
        State: 'Madhya Pradesh',
        District: 'Indore',
        Pin: '452001',
        AppraisedValue: 30000000
      },
      {
        ID: 'LAND-0004-2024',
        Type: 'Commercial Property',
        Size: 2000,
        Owner: 'Delta',
        OwnerId: 'OWNER-004',
        OwnerContact: '9001100103',
        State: 'Uttar Pradesh',
        District: 'Lucknow',
        Pin: '226001',
        AppraisedValue: 50000000
      },
      {
        ID: 'LAND-0005-2024',
        Type: 'Residential Plot',
        Size: 600,
        Owner: 'Epsilon',
        OwnerId: 'OWNER-005',
        OwnerContact: '9001100104',
        State: 'Telangana',
        District: 'Hyderabad',
        Pin: '500001',
        AppraisedValue: 18000000
      }
    ];

    for (const asset of assets) {
      asset.docType = 'asset';
      // example of how to write to world state deterministically
      // use convetion of alphabetic order
      // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
      // when retrieving data, in any lang, the order of data will be the same and consequently also the corresonding hash
      await ctx.stub.putState(asset.ID, Buffer.from(stringify(sortKeysRecursive(asset))));
      console.info(`Asset ${asset.ID} initialized`);
    }
  }

    // CreateAsset issues a new asset to the world state with given details.
  @Transaction()
  public async CreateAsset(
    ctx: Context,
    id: string,
    type: string,
    size: number,
    owner: string,
    ownerId: string,
    ownerContact: string,
    state: string,
    district: string,
    pin: string,
    appraisedValue: number
  ): Promise<void> {
    const exists = await this.AssetExists(ctx, id);
    if (exists) {
      throw new Error(`The asset ${id} already exists`);
    }

    const asset: Asset = {
      ID: id,
      Type: type,
      Size: size,
      Owner: owner,
      OwnerId: ownerId,
      OwnerContact: ownerContact,
      State: state,
      District: district,
      Pin: pin,
      AppraisedValue: appraisedValue
    };
    // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
    await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(asset))));
  }

  // ReadAsset returns the asset stored in the world state with given id.
  @Transaction(false)
  public async ReadAsset(ctx: Context, id: string): Promise<string> {
    const assetJSON = await ctx.stub.getState(id); // get the asset from chaincode state
    if (assetJSON.length === 0) {
      throw new Error(`The asset ${id} does not exist`);
    }
    return assetJSON.toString();
  }

  // UpdateAsset updates an existing asset in the world state with provided parameters.
  @Transaction()
  public async UpdateAsset(
    ctx: Context,
    id: string,
    type: string,
    size: number,
    owner: string,
    ownerId: string,
    ownerContact: string,
    state: string,
    district: string,
    pin: string,
    appraisedValue: number
  ): Promise<void> {
    const exists = await this.AssetExists(ctx, id);
    if (!exists) {
      throw new Error(`The asset ${id} does not exist`);
    }

    // overwriting original asset with new asset
    const updatedAsset: Asset = {
      ID: id,
      Type: type,
      Size: size,
      Owner: owner,
      OwnerId: ownerId,
      OwnerContact: ownerContact,
      State: state,
      District: district,
      Pin: pin,
      AppraisedValue: appraisedValue
    };
    // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
    return ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(updatedAsset))));
  }

  // DeleteAsset deletes an given asset from the world state.
  @Transaction()
  public async DeleteAsset(ctx: Context, id: string): Promise<void> {
    const exists = await this.AssetExists(ctx, id);
    if (!exists) {
      throw new Error(`The asset ${id} does not exist`);
    }
    return ctx.stub.deleteState(id);
  }

  // AssetExists returns true when asset with given ID exists in world state.
  @Transaction(false)
  @Returns('boolean')
  public async AssetExists(ctx: Context, id: string): Promise<boolean> {
    const assetJSON = await ctx.stub.getState(id);
    return assetJSON.length > 0;
  }

  // TransferAsset updates the owner field of asset with given id in the world state, and returns the old owner.
  @Transaction()
  public async TransferAsset(
    ctx: Context, id: string, newOwner: string, newOwnerId: string, newOwnerContact: string, newAppraisedValue: number
  ): Promise<{oldOwner: string, oldOwnerId: string, oldOwnerContact: string}> {
    const assetString = await this.ReadAsset(ctx, id);
    const asset = JSON.parse(assetString) as Asset;
    const oldOwner = asset.Owner;
    asset.Owner = newOwner;
    const oldOwnerId = asset.OwnerId;
    asset.OwnerId = newOwnerId;
    const oldOwnerContact = asset.OwnerContact;
    asset.OwnerContact = newOwnerContact;
    asset.AppraisedValue = newAppraisedValue;
    // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
    await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(asset))));
    return {oldOwner: oldOwner, oldOwnerId: oldOwnerId, oldOwnerContact: oldOwnerContact};
  }

  // GetAllAssets returns all assets found in the world state.
  @Transaction(false)
  @Returns('string')
  public async GetAllAssets(ctx: Context): Promise<string> {
    const allResults = [];
    // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
    const iterator = await ctx.stub.getStateByRange('', '');
    let result = await iterator.next();
    while (!result.done) {
      const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
      let record;
      try {
        record = JSON.parse(strValue) as Asset;
      } catch (err) {
        console.log(err);
        record = strValue;
      }
      allResults.push(record);
      result = await iterator.next();
    }
    return JSON.stringify(allResults);
  }
}
