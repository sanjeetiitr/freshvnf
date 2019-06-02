import React ,{Component} from  'react';
import { Row, Col , message} from 'antd';
import axios from "axios";


export class MapComponent extends Component {
    constructor(props){
        super(props);
        this.state ={
            data : [],
            isFetching : true
        }
    }

    convertData(data){
        const keys = Object.keys(data[0]);
        // console.log(keys,'keys')
        let loc = []
        // console.log(loc,"loc1")
        for(var i = 0 ; i < data.length ; i++){
            let a = data[i]
            let key = Object.keys(a)
            // console.log(key[0])
            let name = key[0]
            let b = a[name].lat
            let c = a[name].lng
            // console.log(a,b,c)
            let coord = { lat : b , lng : c}
            loc.push(coord)
        }

        let map = new window.google.maps.Map(document.getElementById('map'), {
            center: loc[0],
            zoom: 6,
            gestureHandling: 'cooperative'
          });


          let markers = loc.map(function(location, i) {
            return new window.google.maps.Marker({
              position: location,
              map:map
            });
          });
  
          new window.MarkerClusterer(map, markers,
              {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
        

        
    }




    markerPoints(){
        let url = 'https://route.freshvnf.com/delivery_details/live_data'
        axios.get(url)
            .then(response => {
                if( response.status === 201 || response.status === 200 || response.status === 301 || response.status === 302) {
                    let data = response.data
                    console.log(data.live_location," sent comments")
                    this.convertData(data.live_location)
                    this.setState({
                      isFetching : false
                    })
                    message.success('Map Loaded Successfully', 2.5);
                }
                else if(response.status === 403 || response.status === 401 || response.status === 400){
                    message.error('Map Loading Failed', 2.5);
                }
            })
            .catch(err =>{
            });
    }




    componentDidMount(){
        this.markerPoints()
    }



    render(){

        return(
            <div>
                {this.state.isFetching === true ?             <Row id="map" style={{height : '90vh' , width : "100%" }}>
                <Col
                    
                    sm={{ span: 22, offset: 1 }}
                    mg={{ span: 22, offset: 1 }}
                    lg={{ span: 22, offset: 1 }}
                    xl={{ span: 22, offset: 1 }}
                >
                    <h3 style={{textAlign : "center", paddingTop : "30%"}}>Map is Loading. Please wait !</h3>
                </Col>
            </Row>:            <Row id="map" style={{height : '90vh' , width : "100%" }}>
                <Col
                    
                    sm={{ span: 22, offset: 1 }}
                    mg={{ span: 22, offset: 1 }}
                    lg={{ span: 22, offset: 1 }}
                    xl={{ span: 22, offset: 1 }}
                >
                </Col>
            </Row>}
            </div>
            // <Row id="map" style={{height : '90vh' , width : "100%" }}>
            //     <Col
                    
            //         sm={{ span: 22, offset: 1 }}
            //         mg={{ span: 22, offset: 1 }}
            //         lg={{ span: 22, offset: 1 }}
            //         xl={{ span: 22, offset: 1 }}
            //     >
            //     </Col>
            // </Row>
        )
    }
}