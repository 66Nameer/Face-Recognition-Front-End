import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imageURL, box}) => {
    return(
        <div className='center ma'>
            <div className='absolute mt2'>
                <img id='inputimage'alt='' src={imageURL}  width='500px' height='auto'/>
                {box.map((element, i) => {
                    return <div key={i} className='bounding-box' style={{top: element.topRow, right: element.rightCol, bottom: element.bottomRow, left: element.leftCol }}></div>
                })}
                
            </div>
        </div>
    );
}

export default FaceRecognition;