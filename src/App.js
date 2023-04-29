import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import './App.css';



const returnClarifaiRequestOptions = (imageUrl) => {
  const PAT = '1a6ab1527d1c48c6b92c125b30aa8184';
  const USER_ID = 'ux28zm66zuy1';       
  const APP_ID = 'test';
  const MODEL_ID = 'face-detection';    
  const IMAGE_URL = imageUrl;

  const raw = JSON.stringify({
    "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": IMAGE_URL
                }
            }
        }
    ]
  });
  const requestOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
    },
    body: raw
  };

  return requestOptions;

}

    

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageURL: '',
      box: [],
      route: 'signin',
      isSignedIn: false,
    }
  }
  

  calculateFaceLocation = (data) => {
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    // empty array
    // loop
        // push all objects into the empty array
          // return the array
    let arrayOfObjects = [];
    const dataLength = data.outputs[0].data.regions.length;

    for(let i = 0; i < dataLength; i++) {
      arrayOfObjects[i] = {
        leftCol: data.outputs[0].data.regions[i].region_info.bounding_box.left_col * width,
        topRow: data.outputs[0].data.regions[i].region_info.bounding_box.top_row * height,
        rightCol: width - (data.outputs[0].data.regions[i].region_info.bounding_box.right_col *  width),
        bottomRow: height - (data.outputs[0].data.regions[i].region_info.bounding_box.bottom_row * height)

      };
    }
    return arrayOfObjects;

  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageURL: this.state.input})
    fetch("https://api.clarifai.com/v2/models/" + 'face-detection' + "/outputs", returnClarifaiRequestOptions(this.state.input))
      .then(response => response.json())
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if(route === 'signout') {
      this.setState({isSignedIn: false});
    }else if(route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    const { isSignedIn, imageURL, route, box } = this.state;
    return (
      <div className="App">
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home' 
          ? <div> 
              <Logo />
              <ImageLinkForm 
              onInputChange={this.onInputChange} 
              onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition box={box} imageURL={imageURL}/>
            </div>
          : (
            route === 'signin'
              ? <Signin onRouteChange={this.onRouteChange}/>
              : <Register onRouteChange={this.onRouteChange}/>
          )
        }
          </div>
    );
  }
}

export default App;
