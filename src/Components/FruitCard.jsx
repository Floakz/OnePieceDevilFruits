import './fruitcardstyle.css'

export default function FruitCard(props) {
    return (

        <div className='fruitCard-wrapper'>

            <img src={props.img.user} alt={`${props.user} picture`} />

            <div className='info-wrapper'>
                <div>
                    <img className='fruit-img' src={props.img.fruit} alt={`${props.name} picture`} />
                    <h2 className="title-fruit">{props.name}</h2>
                </div>
                <p>{props.about}</p>
                <div className='fruit-tags'>
                    <p>User: <span className='bold-tag'>{props.user}</span></p>
                    <p>Type:<span className='bold-tag'> {props.type}</span></p>
                </div>
            </div>
        </div>
    )
}