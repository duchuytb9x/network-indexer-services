// Copyright 2020-2023 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Field, ID, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn, BeforeInsert } from 'typeorm';
import { ProjectType } from './types';

// TODO: temp place to put these types
@ObjectType('ProjectInfo')
export class ProjectInfo {
  @Field()
  name: string;
  @Field()
  owner: string;
  @Field({ nullable: true })
  image: string;
  @Field({ nullable: true })
  description: string;
  @Field({ nullable: true })
  websiteUrl: string;
  @Field({ nullable: true })
  codeUrl: string;
  @Field({ nullable: true })
  version: string;
  @Field({ nullable: true })
  createdTimestamp: string;
  @Field({ nullable: true })
  updatedTimestamp: string;
  @Field({ nullable: true })
  metadata: string;
}

@ObjectType('ProjectManifest')
export class ProjectManifest {
  @Field()
  kind: string;
  @Field()
  specVersion: string;
  @Field()
  version: string;
  @Field()
  name: string;
  @Field()
  chainId: string;
  @Field()
  genesisHash: string;
  @Field((type) => [String])
  rpcFamily: string[];
  @Field()
  clientName: string;
  @Field()
  clientVersion: string;
  @Field()
  nodeType: string;
}

@ObjectType('Log')
export class LogType {
  @Field()
  log: string;
}

@ObjectType('Metadata')
export class MetadataType {
  @Field(() => Int)
  lastProcessedHeight: number;
  @Field()
  lastProcessedTimestamp: number;
  @Field(() => Int)
  startHeight: number;
  @Field(() => Int)
  targetHeight: number;
  @Field()
  chain: string;
  @Field()
  specName: string;
  @Field()
  genesisHash: string;
  @Field()
  indexerHealthy: boolean;
  @Field()
  indexerNodeVersion: string;
  @Field()
  queryNodeVersion: string;
  @Field()
  indexerStatus: string;
  @Field()
  queryStatus: string;
}

export interface IProjectBaseConfig {
  networkEndpoints: string[];
  networkDictionary: string;
  nodeVersion: string;
  queryVersion: string;
  usePrimaryNetworkEndpoint?: boolean;
}

export interface IProjectAdvancedConfig {
  poiEnabled: boolean;
  purgeDB?: boolean;
  timeout: number;
  worker: number;
  batchSize: number;
  cache: number;
  cpu: number;
  memory: number;
}

@InputType('ProjectBaseConfigInput')
@ObjectType('ProjectBaseConfig')
export class ProjectBaseConfig implements IProjectBaseConfig {
  @Field((type) => [String])
  networkEndpoints: string[];
  @Field()
  networkDictionary: string;
  @Field()
  nodeVersion: string;
  @Field()
  queryVersion: string;
  @Field({ nullable: true, defaultValue: true })
  usePrimaryNetworkEndpoint?: boolean;
}

@InputType('ProjectAdvancedConfigInput')
@ObjectType('ProjectAdvancedConfig')
export class ProjectAdvancedConfig implements IProjectAdvancedConfig {
  @Field()
  poiEnabled: boolean;
  @Field({ nullable: true, defaultValue: false })
  purgeDB?: boolean;
  @Field(() => Int)
  timeout: number;
  @Field(() => Int)
  worker: number;
  @Field(() => Int)
  batchSize: number;
  @Field(() => Int)
  cache: number;
  @Field(() => Int)
  cpu: number;
  @Field(() => Int)
  memory: number;
}

export interface IProjectNetworkEndpoints {
  nodeEndpoint?: string;
  queryEndpoint?: string;
}

export interface IProjectRpcEndpoints {
  httpEndpoint?: string;
  wsEndpoint?: string;
}

export interface IProjectConfig {
  [key: string]: any;
}

export class ProjectConfig implements IProjectConfig {}

export interface IProjectSubqueryConfig extends IProjectConfig {
  networkEndpoints: string[];
  networkDictionary: string;
  nodeVersion: string;
  queryVersion: string;
  usePrimaryNetworkEndpoint?: boolean;
  poiEnabled: boolean;

  purgeDB?: boolean;
  timeout: number;
  worker: number;
  batchSize: number;
  cache: number;
  cpu: number;
  memory: number;
}

@InputType('ProjectSubqueryConfigInput')
@ObjectType('ProjectSubqueryConfig')
export class ProjectSubqueryConfig implements IProjectSubqueryConfig {
  @Field((type) => [String])
  networkEndpoints: string[];
  @Field()
  networkDictionary: string;
  @Field()
  nodeVersion: string;
  @Field()
  queryVersion: string;
  @Field({ nullable: true, defaultValue: true })
  usePrimaryNetworkEndpoint?: boolean;
  @Field()
  poiEnabled: boolean;

  @Field({ nullable: true, defaultValue: false })
  purgeDB?: boolean;
  @Field(() => Int)
  timeout: number;
  @Field(() => Int)
  worker: number;
  @Field(() => Int)
  batchSize: number;
  @Field(() => Int)
  cache: number;
  @Field(() => Int)
  cpu: number;
  @Field(() => Int)
  memory: number;
}

export interface IProjectRpcConfig extends IProjectConfig {
  rpcFamily: string[];
}

@InputType('ProjectRpcConfigInput')
@ObjectType('ProjectRpcConfig')
export class ProjectRpcConfig implements IProjectRpcConfig {
  @Field(() => [String])
  rpcFamily: string[];
}

const defaultBaseConfig: IProjectBaseConfig = {
  networkEndpoints: [],
  networkDictionary: '',
  nodeVersion: '',
  queryVersion: '',
  usePrimaryNetworkEndpoint: true,
};

const defaultAdvancedConfig: IProjectAdvancedConfig = {
  purgeDB: false,
  poiEnabled: true,
  timeout: 1800,
  worker: 2,
  batchSize: 50,
  cache: 300,
  cpu: 2,
  memory: 2046,
};

const defaultNetworkConfig: IProjectSubqueryConfig = {
  networkEndpoints: [],
  networkDictionary: '',
  nodeVersion: '',
  queryVersion: '',
  usePrimaryNetworkEndpoint: true,

  // purgeDB: false,
  poiEnabled: true,
  timeout: 1800,
  worker: 2,
  batchSize: 50,
  cache: 300,
  cpu: 2,
  memory: 2046,
};

const defaultRpcConfig: IProjectRpcConfig = {
  rpcFamily: [],
};

@Entity()
@ObjectType()
export class ProjectEntity {
  @PrimaryColumn()
  @Field(() => ID)
  id: string; // deploymentId

  @Column()
  @Field()
  status: number;

  @Column({ default: '' })
  @Field()
  chainType: string;

  @Column({ default: '' })
  @Field()
  projectType: ProjectType;

  @Column({ default: '' })
  @Field()
  nodeEndpoint: string; // endpoint of indexer service

  @Column({ default: '' })
  @Field()
  queryEndpoint: string; // endpoint of query service

  @Column('jsonb', { default: {} })
  serviceEndpoints: Record<string, string>;
  @Field(() => String, { nullable: true })
  serviceEndpointsStr: string;

  @Column('jsonb', { default: {} })
  @Field(() => ProjectInfo)
  details: ProjectInfo;

  @Column('jsonb', { default: {} })
  @Field(() => ProjectManifest)
  manifest: ProjectManifest;

  @Column('jsonb', { default: defaultBaseConfig })
  @Field(() => ProjectBaseConfig)
  baseConfig: ProjectBaseConfig;

  @Column('jsonb', { default: defaultAdvancedConfig })
  @Field(() => ProjectAdvancedConfig)
  advancedConfig: ProjectAdvancedConfig;

  @Column('jsonb', { default: {} })
  projectConfig: ProjectConfig;
  @Field(() => String, { nullable: true })
  projectConfigStr: string;

  // Explicitly set default values for the fields, ignoring the default values set in the DB schema.
  @BeforeInsert()
  setupDefaultValuesOnInsert: () => void = () => {
    this.chainType = this.chainType ?? '';
    this.nodeEndpoint = this.nodeEndpoint ?? '';
    this.queryEndpoint = this.queryEndpoint ?? '';
    this.serviceEndpoints = this.serviceEndpoints ?? {};
    // @ts-ignore
    this.details = this.details ?? {};
    // @ts-ignore
    this.manifest = this.manifest ?? {};
    this.baseConfig = this.baseConfig ?? defaultBaseConfig;
    this.advancedConfig = this.advancedConfig ?? defaultAdvancedConfig;
    if (this.projectType === ProjectType.Subquery) {
      this.projectConfig = this.projectConfig ?? defaultNetworkConfig;
    } else if (this.projectType === ProjectType.ChainRpc) {
      this.projectConfig = this.projectConfig ?? defaultRpcConfig;
    } else {
      // @ts-ignore
      this.projectConfig = this.projectConfig ?? {};
    }
  };
}

@InputType('PaygConfigInput')
@ObjectType('PaygConfig')
export class PaygConfig {
  @Field()
  price: string;
  @Field()
  expiration: number;
  @Field()
  threshold: number;
  @Field()
  overflow: number;
  @Field()
  token: string;
}

@Entity()
@ObjectType()
export class PaygEntity {
  @PrimaryColumn()
  @Field(() => ID)
  id: string;

  @Column({ default: '' })
  @Field()
  price: string;

  @Column({ default: 0 })
  @Field()
  expiration: number;

  @Column({ default: 100 })
  @Field()
  threshold: number;

  @Column({ default: 5 })
  @Field()
  overflow: number;

  @Column({ default: '' })
  @Field()
  token: string;
}

@ObjectType('Project')
export class Project extends ProjectEntity {}

@ObjectType('Payg')
export class Payg extends PaygEntity {}

@ObjectType('ProjectDetails')
export class ProjectDetails extends ProjectEntity {
  @Field(() => MetadataType)
  metadata: MetadataType;

  @Field(() => Payg)
  payg: Payg;
}
