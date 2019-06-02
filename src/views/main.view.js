import React ,{Component} from  'react';
import { Row, Col } from 'antd';
import { MapComponent } from '../component/map';
import { DeliveryComp } from '../component/delivery.list';


export class MainView extends Component {




    render(){
        return(
            <Row className='main-view'>
                <Col
                    style={{height : '90vh', backgroundColor : "#f4f4f4", borderBottomLeftRadius: '10px'}}
                    sm={{ span: 7, offset: 0 }}
                    mg={{ span: 7, offset: 0 }}
                    lg={{ span: 7, offset: 0 }}
                    xl={{ span: 7, offset: 0 }}
                >
                    <DeliveryComp/>
                </Col>
                <Col
                    sm={{ span: 17, offset: 0 }}
                    mg={{ span: 17, offset: 0 }}
                    lg={{ span: 17, offset: 0 }}
                    xl={{ span: 17, offset: 0 }}
                >
                    <MapComponent/>
                </Col>
            </Row>
        )
    }
}