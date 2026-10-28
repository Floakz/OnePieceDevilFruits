export default function CharacterPortrait({ profile, ...props }) {
    return <img {...props} src={profile.portrait} alt={profile.name}
        onError={event => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = '/images/character-placeholder.svg';
        }} />;
}
