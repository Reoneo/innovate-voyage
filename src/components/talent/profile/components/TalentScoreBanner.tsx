
import React, { useEffect, useState } from 'react';

const TALENT_PROTOCOL_API_KEY = "2c95fd7fc86931938e0fc8363bd62267096147882462508ae18682786e4f";

interface TalentScoreBannerProps {
  walletAddress: string;
}

interface TalentProtocolScoreResponse {
  score: {
    points: number;
    last_calculated_at: string;
  };
}

const badgeBg =
  "bg-gradient-to-r from-[#9b87f5] via-[#0FA0CE]/80 to-[#1EAEDB] shadow-[0_1.5px_5px_#7e69ab55,0_0px_0px_#7E69AB00_inset] px-6 py-3 rounded-xl my-3 flex flex-col items-center border-0";

const TalentScoreBanner: React.FC<TalentScoreBannerProps> = ({ walletAddress }) => {
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [calculatedAt, setCalculatedAt] = useState<string | null>(null);

  useEffect(() => {
    if (!walletAddress) return;
    const fetchScore = async () => {
      setLoading(true);
      try {
        const resp = await fetch(
          `https://api.talentprotocol.com/score?id=${walletAddress}&account_source=wallet`,
          {
            headers: {
              "X-API-KEY": TALENT_PROTOCOL_API_KEY,
            },
          }
        );
        if (resp.ok) {
          const data: TalentProtocolScoreResponse = await resp.json();
          setScore(data.score?.points ?? null);
          setCalculatedAt(data.score?.last_calculated_at ?? null);
        } else {
          setScore(null);
        }
      } catch (e) {
        setScore(null);
      } finally {
        setLoading(false);
      }
    };

    fetchScore();
  }, [walletAddress]);

  return (
    <div className={badgeBg}>
      <span className="uppercase text-xs font-bold text-sky-50/90 tracking-widest mb-0.5">Talent Protocol Score</span>
      {loading ? (
        <span className="text-lg font-semibold text-white/80 animate-pulse">Loading...</span>
      ) : score !== null ? (
        <span className="text-3xl font-bold text-sky-50 drop-shadow glow animate-fade-in" style={{letterSpacing: 1}}>{score} pts</span>
      ) : (
        <span className="text-lg text-slate-200/80">Not available</span>
      )}
      {calculatedAt && (
        <span className="text-xs text-sky-100/70 mt-1">Updated {new Date(calculatedAt).toLocaleDateString()}</span>
      )}
    </div>
  );
};

export default TalentScoreBanner;
