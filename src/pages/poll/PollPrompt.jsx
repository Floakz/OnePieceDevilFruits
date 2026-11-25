import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    getPollState,
    POLL_YEAR,
    readLocalVotedFlag,
    readPollPromptSeen,
    setPollPromptSeen,
} from '../../lib/pollConfig.js';
import styles from './Poll.module.css';

export default function PollPrompt() {
    const [seen, setSeen] = useState(readPollPromptSeen);
    const [open, setOpen] = useState(false);
    const dialogRef = useRef(null);
    const pollState = getPollState();
    const hasVoted = readLocalVotedFlag();

    useEffect(() => {
        if (seen || pollState !== 'open' || hasVoted) return;
        const timeoutId = window.setTimeout(() => {
            setPollPromptSeen();
            setSeen(true);
            setOpen(true);
        }, 1500);
        return () => window.clearTimeout(timeoutId);
    }, [hasVoted, pollState, seen]);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!open || !dialog) return undefined;
        if (!dialog.open) dialog.showModal();
        return () => {
            if (dialog.open) dialog.close();
        };
    }, [open]);

    function dismiss() {
        setPollPromptSeen();
        setSeen(true);
        setOpen(false);
    }

    return (
        <dialog
            ref={dialogRef}
            className={styles.pollPrompt}
            aria-label={`${POLL_YEAR} community poll invitation`}
            onCancel={event => {
                event.preventDefault();
                dismiss();
            }}
            onClick={event => {
                if (event.target === event.currentTarget) dismiss();
            }}
        >
            <div className={styles.pollPromptArtwork}>
                <button
                    type="button"
                    className={styles.pollPromptClose}
                    aria-label="Close poll popup"
                    onClick={dismiss}
                >
                    ×
                </button>
                <div className={styles.pollPromptActions}>
                    <Link className={styles.primaryButton} to="/poll/vote" onClick={dismiss}>
                        Vote now
                    </Link>
                </div>
            </div>
        </dialog>
    );
}
