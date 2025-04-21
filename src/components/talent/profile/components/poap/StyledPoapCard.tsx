
import React from "react";
import styles from "./StyledPoapCard.module.css";

interface StyledPoapCardProps {
  imageUrl: string;
  name: string;
  dropId: string | number;
  poapId: string | number;
  mintedBy: string;
  tokenCount?: number;
  holdersCount?: number;
  transferCount?: number;
  explorerUrl?: string;
}

/**
 * Pixel-perfect POAP card using pure CSS and minimal SVG (for stats only).
 * @see Reference image in user upload
 */
const StyledPoapCard: React.FC<StyledPoapCardProps> = ({
  imageUrl,
  name,
  dropId,
  poapId,
  mintedBy,
  tokenCount = 1,
  holdersCount = 1,
  transferCount = 1,
  explorerUrl
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.thumbnail}>
        <a href={explorerUrl || "#"} target="_blank" rel="noopener noreferrer">
          <img src={imageUrl} alt={name} loading="lazy" />
        </a>
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{name}</h3>
        <div className={styles.ids}>
          <div>
            <span>DROP ID:</span>#{dropId}
          </div>
          <div>
            <span>POAP ID:</span>#{poapId}
          </div>
        </div>
        <div className={styles.minted}>
          MINTED BY: <strong>{mintedBy}</strong>
        </div>
        <div className={styles.stats}>
          <div>
            {/* POAP count icon */}
            <svg viewBox="0 0 24 24" className={styles.icon}><circle cx="12" cy="12" r="10" fill="#a3a1ff"/></svg>
            <span>{tokenCount}</span>
          </div>
          <div>
            {/* Holders icon */}
            <svg viewBox="0 0 24 24" className={styles.icon}><path fill="#a3a1ff" d="M12 2a5 5 0 0 1 5 5v1H7V7a5 5 0 0 1 5-5z"/></svg>
            <span>{holdersCount}</span>
          </div>
          <div>
            {/* Copies (transfer count) icon */}
            <svg viewBox="0 0 24 24" className={styles.icon}><path fill="#a3a1ff" d="M4 12h16M12 4v16"/></svg>
            <span>{transferCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyledPoapCard;
