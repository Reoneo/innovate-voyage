
import { TalentProtocolScores } from './types';

export const parseCredentialsData = (credentials: any[]): TalentProtocolScores => {
  return {
    humanCheckmark: {
      name: 'Human Checkmark',
      score: credentials.find((c: any) => c.name === 'human_checkmark')?.score || 0,
      maxScore: 20,
      verified: credentials.find((c: any) => c.name === 'human_checkmark')?.verified || false
    },
    github: {
      name: 'GitHub',
      score: credentials.find((c: any) => c.name === 'github')?.score || 0,
      maxScore: 130
    },
    talentProtocol: {
      name: 'Talent Protocol',
      score: credentials.find((c: any) => c.name === 'talent_protocol')?.score || 0,
      maxScore: 40
    },
    onchainActivity: {
      name: 'Onchain Activity',
      score: credentials.find((c: any) => c.name === 'onchain_activity')?.score || 0,
      maxScore: 48
    },
    twitter: {
      name: 'X/Twitter',
      score: credentials.find((c: any) => c.name === 'twitter')?.score || 0,
      maxScore: 4
    },
    farcaster: {
      name: 'Farcaster',
      score: credentials.find((c: any) => c.name === 'farcaster')?.score || 0,
      maxScore: 82
    },
    base: {
      name: 'Base',
      score: credentials.find((c: any) => c.name === 'base')?.score || 0,
      maxScore: 143
    },
    bountycaster: {
      name: 'Bountycaster',
      score: credentials.find((c: any) => c.name === 'bountycaster')?.score || 0,
      maxScore: 12
    },
    build: {
      name: 'BUILD',
      score: credentials.find((c: any) => c.name === 'build')?.score || 0,
      maxScore: 20
    },
    celo: {
      name: 'Celo',
      score: credentials.find((c: any) => c.name === 'celo')?.score || 0,
      maxScore: 60
    },
    cryptoNomads: {
      name: 'Crypto Nomads',
      score: credentials.find((c: any) => c.name === 'crypto_nomads')?.score || 0,
      maxScore: 12
    },
    daoBase: {
      name: 'DAOBase',
      score: credentials.find((c: any) => c.name === 'dao_base')?.score || 0,
      maxScore: 8
    },
    developerDao: {
      name: 'Developer DAO',
      score: credentials.find((c: any) => c.name === 'developer_dao')?.score || 0,
      maxScore: 20
    },
    devfolio: {
      name: 'Devfolio',
      score: credentials.find((c: any) => c.name === 'devfolio')?.score || 0,
      maxScore: 50
    },
    ens: {
      name: 'ENS',
      score: credentials.find((c: any) => c.name === 'ens')?.score || 0,
      maxScore: 6
    },
    ethGlobal: {
      name: 'ETHGlobal',
      score: credentials.find((c: any) => c.name === 'eth_global')?.score || 0,
      maxScore: 106
    },
    lens: {
      name: 'Lens',
      score: credentials.find((c: any) => c.name === 'lens')?.score || 0,
      maxScore: 6
    },
    optimism: {
      name: 'Optimism',
      score: credentials.find((c: any) => c.name === 'optimism')?.score || 0,
      maxScore: 15
    },
    scroll: {
      name: 'Scroll',
      score: credentials.find((c: any) => c.name === 'scroll')?.score || 0,
      maxScore: 20
    },
    stack: {
      name: 'Stack',
      score: credentials.find((c: any) => c.name === 'stack')?.score || 0,
      maxScore: 12
    }
  };
};

export const getFallbackScores = (): TalentProtocolScores => {
  return {
    humanCheckmark: { name: 'Human Checkmark', score: 20, maxScore: 20, verified: true },
    github: { name: 'GitHub', score: 28, maxScore: 130 },
    talentProtocol: { name: 'Talent Protocol', score: 1, maxScore: 40 },
    onchainActivity: { name: 'Onchain Activity', score: 20, maxScore: 48 },
    twitter: { name: 'X/Twitter', score: 4, maxScore: 4 },
    farcaster: { name: 'Farcaster', score: 1, maxScore: 82 },
    base: { name: 'Base', score: 0, maxScore: 143 },
    bountycaster: { name: 'Bountycaster', score: 0, maxScore: 12 },
    build: { name: 'BUILD', score: 0, maxScore: 20 },
    celo: { name: 'Celo', score: 0, maxScore: 60 },
    cryptoNomads: { name: 'Crypto Nomads', score: 0, maxScore: 12 },
    daoBase: { name: 'DAOBase', score: 0, maxScore: 8 },
    developerDao: { name: 'Developer DAO', score: 0, maxScore: 20 },
    devfolio: { name: 'Devfolio', score: 0, maxScore: 50 },
    ens: { name: 'ENS', score: 0, maxScore: 6 },
    ethGlobal: { name: 'ETHGlobal', score: 0, maxScore: 106 },
    lens: { name: 'Lens', score: 0, maxScore: 6 },
    optimism: { name: 'Optimism', score: 0, maxScore: 15 },
    scroll: { name: 'Scroll', score: 0, maxScore: 20 },
    stack: { name: 'Stack', score: 0, maxScore: 12 }
  };
};
