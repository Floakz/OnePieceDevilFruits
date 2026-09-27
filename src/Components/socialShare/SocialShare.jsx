import { useState } from 'react';
import styles from './socialShare.module.css';

import {
  WhatsappShareButton,
  RedditShareButton,
  WhatsappIcon,
  RedditIcon,
} from 'react-share';

export default function SocialShare({
  title = 'One Piece Devil Fruits',
  text,
  url,
  className = '',
}) {
  const [copied, setCopied] = useState(false);

  const shareUrl =
    url ||
    (typeof window !== 'undefined' ? window.location.href : 'https://onepiecedevilfruits.com');

  const shareText =
    text || `Check this out on One Piece Devil Fruits: ${title}`;

  const handleCopyLink = async () => {
    const value = `${shareText} ${shareUrl}`;

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(value);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.warn('Unable to copy share link:', error);
    }
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title || 'One Piece Devil Fruits',
        text: shareText,
        url: shareUrl,
      }).catch(() => {});
    }
  };

  return (
    <div className={`${styles.socialShare} ${className}`.trim()}>
      <span className={styles.label}>Share</span>
      <div className={styles.row}>
        <WhatsappShareButton url={shareUrl} title={shareText} className={styles.shareButton}>
          <WhatsappIcon size={28} round />
          <span>WhatsApp</span>
        </WhatsappShareButton>

        <RedditShareButton url={shareUrl} title={title} className={styles.shareButton}>
          <RedditIcon size={28} round />
          <span>Reddit</span>
        </RedditShareButton>

        <button
          type="button"
          className={styles.shareButton}
          aria-label="More options"
          onClick={handleNativeShare}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Share</span>
        </button>
      </div>
    </div>
  );
}
