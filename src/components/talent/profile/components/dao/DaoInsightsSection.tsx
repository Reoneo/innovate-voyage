
import React from 'react';
import { useTallyData } from '@/hooks/useTallyData';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { useEnsResolver } from '@/hooks/useEnsResolver';

interface DaoInsightsSectionProps {
  walletAddress: string;
}

const DaoInsightsSection: React.FC<DaoInsightsSectionProps> = ({ walletAddress }) => {
  const { tallyData, isLoading, error } = useTallyData(walletAddress);
  const { resolvedAddress } = useEnsResolver(undefined, walletAddress);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">DAO Memberships & Voting Power</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">DAO Memberships & Voting Power</h3>
        <Card className="p-6">
          <p className="text-sm text-gray-500">Error loading DAO data. Please try again later.</p>
        </Card>
      </div>
    );
  }

  if (!tallyData) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">DAO Memberships & Voting Power</h3>
        <Card className="p-6">
          <p className="text-sm text-gray-500">No DAO memberships found for this address.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">DAO Governance Data</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* DAO Card */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            {tallyData.daoIcon && (
              <img src={tallyData.daoIcon} alt={tallyData.daoName} className="h-8 w-8" />
            )}
            <div>
              <h4 className="font-medium">{tallyData.daoName}</h4>
              <p className="text-sm text-gray-500">{tallyData.daoSymbol} Token Holder</p>
            </div>
          </div>
          
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Voting Power:</dt>
              <dd className="text-sm font-medium">{tallyData.votingPower} {tallyData.daoSymbol}</dd>
            </div>
            
            {tallyData.delegatingTo && (
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Delegating To:</dt>
                <dd className="text-sm font-medium">{tallyData.delegatingTo}</dd>
              </div>
            )}
            
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Receiving Delegations:</dt>
              <dd className="text-sm font-medium">{tallyData.receivedDelegations}</dd>
            </div>
          </dl>
        </Card>
        
        {/* DAO Info Card */}
        <Card className="p-6 bg-gray-50">
          <h4 className="font-medium mb-3">DAO Governance Insights</h4>
          <p className="text-sm text-gray-600 mb-4">
            On-chain governance data shows involvement in decentralized organizations through token ownership and voting.
          </p>
          
          {Number(tallyData.votingPower) === 0 || tallyData.votingPower === "<0.01" ? (
            <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-md">
              <p className="text-sm text-yellow-800">
                No voting power found for this address. This could mean tokens aren't delegated yet or the address hasn't received any delegations.
              </p>
            </div>
          ) : (
            <div className="p-3 bg-green-50 border border-green-100 rounded-md">
              <p className="text-sm text-green-800">
                This address has active participation in {tallyData.daoName} governance with {tallyData.votingPower} {tallyData.daoSymbol} voting power.
              </p>
            </div>
          )}
        </Card>
      </div>
      
      {/* Code sample section */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-3">DAO Data Points for Profiles</h3>
        <Card className="p-6 bg-gray-50">
          <pre className="text-xs text-gray-700 whitespace-pre-wrap overflow-x-auto">
{`For any given address, you can surface a wide range of DAO-related insights on your recruitment.box profile by querying on-chain governance contracts and events via Infura's JSON-RPC endpoint. Here are the most "profile-worthy" DAO data points, with rough how-to's:

⸻

1. DAO Memberships & Token Holdings

What it shows: which governance tokens they hold (e.g. COMP, UNI, APE) and their balance, implying which DAOs they have voting power in.

// ERC-20 balance call for each DAO's governance token:
const govToken = new web3.eth.Contract(ERC20_ABI, daoTokenAddress);
const balance = await govToken.methods.balanceOf(userAddress).call();
// then convert from Wei to human units


⸻

2. Delegate / Voting Power

What it shows: whether they've delegated their tokens (and to whom), plus their current voting weight.

// For Compound-style DAOs:
const comp = new web3.eth.Contract(CompABI, compTokenAddress);
const votes = await comp.methods.getCurrentVotes(userAddress).call();
const delegatee = await comp.methods.delegates(userAddress).call();


⸻

3. Proposals Created

What it shows: any governance proposals they've authored (title + status).

// Filter for ProposalCreated events in a DAO's Governor contract:
const events = await governor.getPastEvents('ProposalCreated', {
  filter: { proposer: userAddress },
  fromBlock: genesisBlock,
  toBlock: 'latest'
});


⸻

4. Votes Cast

What it shows: their voting participation history (proposal ID, support/against/abstain, weight).

// Filter for VoteCast events:
const votes = await governor.getPastEvents('VoteCast', {
  filter: { voter: userAddress },
  fromBlock: genesisBlock,
  toBlock: 'latest'
});


⸻

5. Active Proposals & Positions

What it shows: among current live proposals, which ones they've already voted on vs. those pending their vote.

const latestProposalId = await governor.methods.proposalCount().call();
for (let id = latestProposalId - 9; id <= latestProposalId; id++) {
  const state = await governor.methods.state(id).call();
  const receipt = await governor.methods.getReceipt(id, userAddress).call();
  // state tells you "Pending", "Active", etc.
  // receipt.support > 0 means they voted
}


⸻

6. Delegation History

What it shows: changes in who they've delegated to over time (track "DelegateChanged" events).

const delEvents = await comp.getPastEvents('DelegateChanged', {
  filter: { delegator: userAddress },
  fromBlock: genesisBlock,
  toBlock: 'latest'
});


⸻

7. Snapshot Scores (Off-chain DAOs)

What it shows: if the DAO uses Snapshot, you can fetch their off-chain voting scores by calling the Snapshot GraphQL API for each space they participated in. (Infura alone can't query Snapshot, but you can mix in a quick REST/GraphQL call.)`}
          </pre>
        </Card>
      </div>
    </div>
  );
};

export default DaoInsightsSection;
