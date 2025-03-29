
import React from 'react';
import { TalentProfileData, PassportSkill } from '@/api/types/web3Types';
import { Badge } from '@/components/ui/badge';
import { truncateAddress } from '@/lib/utils';

interface PDFExportProps {
  data: TalentProfileData;
}

const PDFExport: React.FC<PDFExportProps> = ({ data }) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (e) {
      return 'N/A';
    }
  };

  // Calculate first transaction date if available
  const firstTransactionDate = data.blockchainProfile?.latestTransactions?.length 
    ? new Date(Math.min(...data.blockchainProfile.latestTransactions.map(tx => parseInt(tx.timeStamp) * 1000))).getFullYear()
    : 'recent years';

  const skillsWithProof = data.skills.filter(skill => skill.proof).length;
  const totalSkills = data.skills.length;

  return (
    <div id="pdf-content" className="pdf-export bg-white text-black">
      <div className="pdf-header flex items-center gap-4 border-b pb-4 mb-4">
        {data.avatar_url && (
          <div className="avatar-container w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
            <img src={data.avatar_url} alt={data.name} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{data.name}</h1>
          <p className="text-gray-600">{data.resolvedEns || truncateAddress(data.owner_address)}</p>
          {data.score !== undefined && data.category && (
            <div className="mt-1">
              <span className="text-sm font-medium text-gray-600">Human Score: </span>
              <span className="font-bold">{data.score} - {data.category}</span>
            </div>
          )}
        </div>
      </div>

      <div className="pdf-two-column grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="left-column">
          {/* About Section */}
          <div className="mb-4">
            <h2 className="text-lg font-bold border-b pb-1 mb-2">About</h2>
            <p className="text-sm">
              Web3 professional with blockchain expertise. Active on Ethereum since {firstTransactionDate}. 
              Has {skillsWithProof} verified skills out of {totalSkills} total skills.
            </p>
          </div>

          {/* Skills Section */}
          <div className="mb-4">
            <h2 className="text-lg font-bold border-b pb-1 mb-2">Skills & Expertise</h2>
            <div className="flex flex-wrap gap-1">
              {data.skills.map((skill: PassportSkill, idx: number) => (
                <span 
                  key={`${skill.name}-${idx}`} 
                  className={`inline-block px-2 py-0.5 rounded-full text-xs 
                    ${skill.proof 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800'
                    } mb-1 mr-1`}
                >
                  {skill.proof && '✓ '}
                  {skill.name}
                </span>
              ))}
            </div>
          </div>

          {/* Blockchain Metrics */}
          <div className="mb-4">
            <h2 className="text-lg font-bold border-b pb-1 mb-2">Blockchain Metrics</h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Ethereum Address:</div>
              <div className="font-medium text-right">{truncateAddress(data.owner_address)}</div>
              
              {data.resolvedEns && (
                <>
                  <div>ENS Name:</div>
                  <div className="font-medium text-right">{data.resolvedEns}</div>
                </>
              )}
              
              <div>ETH Balance:</div>
              <div className="font-medium text-right">{data.blockchainProfile?.balance || "0"} ETH</div>
              
              <div>Transaction Count:</div>
              <div className="font-medium text-right">{data.blockchainProfile?.transactionCount || "0"}</div>
              
              <div>Human Score:</div>
              <div className="font-medium text-right">{data.score} ({data.category})</div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          {/* Contact Information */}
          <div className="mb-4">
            <h2 className="text-lg font-bold border-b pb-1 mb-2">Contact Information</h2>
            <div className="grid gap-1 text-sm">
              {data.socials?.email && (
                <div className="grid grid-cols-2">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium text-right">{data.socials.email}</span>
                </div>
              )}
              {data.socials?.github && (
                <div className="grid grid-cols-2">
                  <span className="text-gray-600">GitHub:</span>
                  <span className="font-medium text-right">{data.socials.github.replace('https://github.com/', '')}</span>
                </div>
              )}
              {data.socials?.twitter && (
                <div className="grid grid-cols-2">
                  <span className="text-gray-600">Twitter:</span>
                  <span className="font-medium text-right">{data.socials.twitter.replace('https://twitter.com/', '@')}</span>
                </div>
              )}
              {data.socials?.linkedin && (
                <div className="grid grid-cols-2">
                  <span className="text-gray-600">LinkedIn:</span>
                  <span className="font-medium text-right">Connected</span>
                </div>
              )}
              {data.socials?.website && (
                <div className="grid grid-cols-2">
                  <span className="text-gray-600">Website:</span>
                  <span className="font-medium text-right">{data.socials.website.replace(/^https?:\/\//, '')}</span>
                </div>
              )}
              {data.socials?.discord && (
                <div className="grid grid-cols-2">
                  <span className="text-gray-600">Discord:</span>
                  <span className="font-medium text-right">Connected</span>
                </div>
              )}
              {(!data.socials || Object.values(data.socials).filter(Boolean).length === 0) && (
                <p className="text-gray-500">No contact information provided</p>
              )}
            </div>
          </div>

          {/* Recent Transactions */}
          {data.blockchainProfile?.latestTransactions && data.blockchainProfile.latestTransactions.length > 0 && (
            <div className="mb-4">
              <h2 className="text-lg font-bold border-b pb-1 mb-2">Recent Transactions</h2>
              <div className="overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-1 text-left">Date</th>
                      <th className="p-1 text-left">Type</th>
                      <th className="p-1 text-right">Value (ETH)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.blockchainProfile.latestTransactions.slice(0, 5).map((tx, idx) => {
                      const date = new Date(parseInt(tx.timeStamp) * 1000);
                      const isSent = tx.from.toLowerCase() === data.owner_address.toLowerCase();
                      const value = parseFloat(tx.value) / 1e18;
                      
                      return (
                        <tr key={idx} className="border-t border-gray-100">
                          <td className="p-1">{date.toLocaleDateString()}</td>
                          <td className="p-1">
                            <span className={`inline-block px-1 rounded text-xs ${isSent ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                              {isSent ? 'Sent' : 'Received'}
                            </span>
                          </td>
                          <td className="p-1 text-right font-medium">{value.toFixed(4)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Account Status */}
          <div className="mb-4">
            <h2 className="text-lg font-bold border-b pb-1 mb-2">Account Status</h2>
            <div className="grid grid-cols-2 gap-1 text-sm">
              <span className="text-gray-600">Profile Created:</span>
              <span className="font-medium text-right">{formatDate(data.issued)}</span>
              
              <span className="text-gray-600">Verified Skills:</span>
              <span className="font-medium text-right">{skillsWithProof} of {totalSkills}</span>
              
              <span className="text-gray-600">Status:</span>
              <span className="font-medium text-right">{data.score && data.score > 60 ? 'Active' : 'New User'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pdf-footer mt-6 pt-2 border-t text-center text-xs text-gray-500">
        <p>Blockchain Talent Profile • Generated on {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default PDFExport;
