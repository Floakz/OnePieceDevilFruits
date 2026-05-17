import { useNavigate } from 'react-router-dom';
import './fruitcardstyle.css';


export default function FruitCard(props) {

    const CDN_BASE = import.meta.env.VITE_CDN_BASE;

    const cdnFruit = CDN_BASE ? `${CDN_BASE}/fruits/${props.id}.webp` : null;
    const cdnCharacter = CDN_BASE ? `${CDN_BASE}/characters/${props.id}.webp` : null;


    const localFruit = `/images/fruits/${props.id}.webp`;
    const localCharacter = `/images/characters/${props.id}.webp`;


    const fruitSrc = cdnFruit || localFruit;
    const characterSrc = cdnCharacter || localCharacter;

    const navigate = useNavigate();

    const fallbackFruit = 'https://i.postimg.cc/Sxp09zGS/unkown.png';

    return (
        <div
            onClick={() => (props.clickable ? navigate(`/fruit/${props.id}`) : null)}
            className={`fruitCard-wrapper ${props.clickable ? 'cardClickable' : ''}`}
        >
            <div className='info-wrapper'>
                <div>
                    <img
                        loading="lazy"
                        className='fruitImg'
                        src={fruitSrc}
                        alt={`${props.name} picture`}
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = fallbackFruit;
                        }}
                    />
                    <h2 className='titleFruit'>{props.name}</h2>
                </div>

                <p className='aboutSection'>{props.about}</p>

                <div className='fruitTags'>
                    <div>
                        <svg className='icons' width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 20C5.33579 17.5226 8.50702 16 12 16C15.493 16 18.6642 17.5226 21 20M16.5 7.5C16.5 9.98528 14.4853 12 12 12C9.51472 12 7.5 9.98528 7.5 7.5C7.5 5.01472 9.51472 3 12 3C14.4853 3 16.5 5.01472 16.5 7.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <p className='tag'>{props.user || props.submitedBy}</p>
                    </div>
                    <div>
                        <svg className='icons' width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 24 24"><path fill="none" stroke="#ffffff" stroke-miterlimit="10" stroke-width="1.5" d="M17.47 13.75a8 8 0 0 1 .07 1 7.35 7.35 0 1 1-7.35-7.35 7.6 7.6 0 0 1 2.1.3" /><path fill="none" stroke="#ffffff" stroke-miterlimit="10" stroke-width="1.5" d="M12 1.9a13.52 13.52 0 0 1 1.83 12.86c-2.72 7.34-5.23 7.17-5.23 7.17M20.29 1.9s2.76 2.75.92 5.51-5.51 1.83-5.51 1.83-.92-2.75.92-4.59c1.45-1.45 2.76-.92 3.67-2.75Z" /></svg>
                        <p className='tag'>{props.type}</p>
                    </div>
                    <div>
                        <svg className='icons' width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 24 24"><path fill="none" stroke="#ffffff" stroke-miterlimit="10" stroke-width="1.5" d="M7.997 15.999a3.54 3.54 0 0 1 .014 4.992l-5.006-5.006a3.54 3.54 0 0 1 5.006 0ZM23 1 8 16m-2.5 2.5L1 23m0-5 2-2m18.01-.002-5 5a3.54 3.54 0 0 1 .007-4.985 3.54 3.54 0 0 1 5.007 0ZM16 16 1 1m22 22-4.5-4.5M23 18l-2-2" /></svg>
                        <p className='tag'>{props.power}</p>
                    </div>
                </div>
            </div>

            {props.img?.user && (
                <img loading="lazy" src={characterSrc} className='userImg' alt={`${props.user} picture`} />
            )}
        </div>
    );
}
