import './fruitcardstyle.css'

export default function FruitCard(props) {


    return (

        <div className='fruitCard-wrapper'>
            <div className='info-wrapper'>
                <div>
                    <img className='fruitImg' src={props.img.fruit} alt={`${props.name} picture`} />
                    <h2 className="titleFruit">{props.name}</h2>
                </div>
                <p className='aboutSection'>{props.about}</p>
                <div className='fruitTags'>
                    <div>
                        <img className='icon' src="https://i.ibb.co/1tzwX47Z/user-icon.png" alt="user-icon" />
                        <p className='tag'>{props.user || props.submitedBy}</p>
                    </div>
                    <div>
                        <img className='icon' src="https://i.ibb.co/BKysPs26/fruit-icon.png" alt="fruit-icon" />
                        <p className='tag'> {props.type}</p>
                    </div>
                    <div>
                        <img className='icon' src="https://i.ibb.co/60RgVc5D/power-icon.png" alt="power-icon" />
                        <p className='tag'> {props.power}</p>
                    </div>
                </div>
            </div>

            {props.img.user && <img src={props.img.user} className="userImg" alt={`${props.user} picture`} />}



        </div>
    )
}

