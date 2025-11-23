import { useNavigate } from 'react-router-dom';
import './fruitcardstyle.css';

export default function FruitCard(props) {
    const fruitImgLocation = '/images/fruits';
    const characterImgLocation = '/images/characters';

    const characterSrc = `${characterImgLocation}/${props.id}.webp` ?? props.img?.user;
    const fruitSrc = `${fruitImgLocation}/${props.id}.webp` ?? props.img?.fruit;

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
                            e.currentTarget.onerror = null; // prevent loop
                            e.currentTarget.src = fallbackFruit;
                        }}
                    />
                    <h2 className='titleFruit'>{props.name}</h2>
                </div>

                <p className='aboutSection'>{props.about}</p>

                <div className='fruitTags'>
                    <div>
                        <img loading="lazy" className='icon' src='https://i.ibb.co/1tzwX47Z/user-icon.png' alt='user-icon' />
                        <p className='tag'>{props.user || props.submitedBy}</p>
                    </div>
                    <div>
                        <img loading="lazy" className='icon' src='https://i.ibb.co/BKysPs26/fruit-icon.png' alt='fruit-icon' />
                        <p className='tag'>{props.type}</p>
                    </div>
                    <div>
                        <img loading="lazy" className='icon' src='https://i.ibb.co/60RgVc5D/power-icon.png' alt='power-icon' />
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
