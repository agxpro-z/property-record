/*
  SPDX-License-Identifier: Apache-2.0
*/

import {Object, Property} from 'fabric-contract-api';

@Object()
export class Asset {
  @Property()
  public docType?: string;

  @Property()
  public ID: string = '';

  @Property()
  public Type: string = '';

  @Property()
  public Size: number = 0;

  @Property()
  public Owner: string = '';

  @Property()
  public OwnerId: string = '';

  @Property()
  public OwnerContact: string = '';

  @Property()
  public State: string = '';

  @Property()
  public District: string = '';

  @Property()
  public Pin: string = '';

  @Property()
  public AppraisedValue: number = 0;
}
