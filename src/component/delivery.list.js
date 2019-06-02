import React, { Component } from 'react';
import axios from 'axios';
import { List, Avatar, Drawer, Row, Col } from 'antd';
import { relative } from 'path';


export class DeliveryComp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            fetching: true,
            visible: false,
            userData: []
        }
    }

    calculateAndDisplayRoute(directionsService, directionsDisplay, data) {
        let len = data.length
        let waypts = [];
        for (let i = 0; i < len; i++) {
            waypts.push({
                location: data[i],
                stopover: true
            });
        }

        directionsService.route({
            origin: data[0],
            destination: data[len - 1],
            waypoints: waypts,
            optimizeWaypoints: true,
            travelMode: 'DRIVING'
        });
    }

    animateCircle = (line) => {
        var count = 0;
        window.setInterval(function () {
            count = (count + 1) % 100;

            var icons = line.get('icons');
            icons[0].offset = (count / 2) + '%';
            line.set('icons', icons);
        }, 300);
    }


    userDetailmap = (data) => {
        let len = data.length
        console.log(data[1].time)
        let ts = new Date(data[1].time);
        console.log(ts.toDateString());
        console.log(data[len - 1], len)
        let map = new window.google.maps.Map(document.getElementById('detail_map2'), {
            zoom: 11,
            center: data[0]
        });

        let lineSymbol = {
            path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 2,
            strokeColor: '#393',
            strokeWeight: 2
        };

        let flightPath = new window.google.maps.Polyline({
            path: data,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2,
            icons: [{
                icon: lineSymbol,
                offset: '10%'
            }]
        });

        flightPath.setMap(map);

        this.animateCircle(flightPath)

        new window.google.maps.Marker({
            position: data[0],
            label: 'A',
            map: map
        });

        new window.google.maps.Marker({
            position: data[len - 1],
            label: 'B',
            map: map
        });

    }



    userDirection(data) {
        let len = data.length
        let directionsService = new window.google.maps.DirectionsService;
        let directionsDisplay = new window.maps.DirectionsRenderer;
        let map = new window.google.maps.Map(document.getElementById('map'), {
            zoom: 8,
            center: data[0]
        });
        directionsDisplay.setMap(map);
        this.calculateAndDisplayRoute(directionsService, directionsDisplay, data);
    }



    showDrawer = (item) => {
        console.log(item)
        this.userDetail(item)
        this.setState({
            visible: true,
        })
    }

    onClose = () => {
        this.setState({
            visible: false,
        })
    }

    convertData(data) {
        let delivery = []
        console.log('enterec')
        let result = Object.keys(data).map(function (key) {
            return key;
        });
        return result
    }


    userDetail = (user) => {
        let url = `https://freshvnf-api.firebaseio.com/tracked-locations/${user}.json`
        axios.get(url)
            .then(response => {
                console.log(response.data)
                this.userDetailmap(response.data)
                this.setState({
                    userData: response.data
                })

            })
            .catch(err => {
                console.log(err)
            })
    }


    componentDidMount() {
        let url = 'https://freshvnf-api.firebaseio.com/tracked-locations.json?shallow=true'
        axios.get(url)
            .then(response => {
                console.log(response.data)
                this.setState({
                    data: this.convertData(response.data),
                    fetching: false
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
    render() {
        return (
            <div>
                <Col
                    style={{ backgroundColor: "white", borderTopLeftRadius: '10px' }}
                    sm={{ span: 24, offset: 0 }}
                    mg={{ span: 24, offset: 0 }}
                    lg={{ span: 24, offset: 0 }}
                    xl={{ span: 24, offset: 0 }}
                >
                    <h2 style={{ textAlign: 'center' }}>Delivery People list </h2>
                </Col>
                <Col
                    className='user-list'
                    style={{ height: '80vh', position: "relative", overflow: 'auto' }}
                    sm={{ span: 24, offset: 0 }}
                    mg={{ span: 24, offset: 0 }}
                    lg={{ span: 24, offset: 0 }}
                    xl={{ span: 24, offset: 0 }}
                >
                    <List
                        dataSource={this.state.data}
                        renderItem={item => (
                            <List.Item key={item} actions={[<a onClick={() => this.showDrawer(item)}>More</a>]}>
                                <List.Item.Meta
                                    avatar={
                                        <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                                    }
                                    title={<p style={{color :"black"}}>{item}</p>}
                                    description={<h5 style={{color :"#525051d9"}}>Last Active : <span>{()=> {}}</span></h5>}
                                />
                            </List.Item>
                        )}
                    ></List>
                </Col>
                <Drawer
                    width={'60vw'}
                    placement="right"
                    closable={false}
                    onClose={this.onClose}
                    visible={this.state.visible}
                >
                    <Row id="detail_map2" style={{ height: '70vh', width: "100%" }}>
                        <Col
                            id="detail_map"
                            sm={{ span: 22, offset: 1 }}
                            mg={{ span: 22, offset: 1 }}
                            lg={{ span: 22, offset: 1 }}
                            xl={{ span: 22, offset: 1 }}
                        >
                        </Col>
                        <Col></Col>
                    </Row>
                </Drawer>
            </div>
        )
    }
}