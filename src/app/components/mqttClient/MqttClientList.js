import React, {Component} from 'react';

import LeftMenuButton from '../common/LeftMenuButton';
import NavUtils from '../../utils/NavUtils';
import MqttClientService from '../../services/MqttClientService';
import MqttClientConstants from '../../utils/MqttClientConstants';

const styles = {
    container: {
        marginTop:10
    },
    buttonContainer: {
        marginTop:10,
        marginRight:5
    },
    clientConnected: {
        textAlign:'center',
        border:'2px solid #398439',
        cursor:'pointer'
    },
    clientDisConnected: {
        textAlign:'center',
        border:'2px solid #204d74',
        cursor:'pointer'
    },
    clientConnError: {
        textAlign:'center',
        border:'2px solid #b92c28',
        cursor:'pointer'
    }
}
class MqttClientList extends Component {

    constructor(props) {
        super(props);

        this.getAllMqttClientSettings = this.getAllMqttClientSettings.bind(this);

        this.state = {mqttClientSettings:MqttClientService.getAllMqttClientSettings()};
    }

    getAllMqttClientSettings() {
        this.setState({mqttClientSettings:MqttClientService.getAllMqttClientSettings()});
    }

    componentDidMount() {
        MqttClientService.addChangeListener(MqttClientConstants.EVENT_MQTT_CLIENT_DATA_CHANGED,this.getAllMqttClientSettings);
        MqttClientService.addChangeListener(MqttClientConstants.EVENT_MQTT_CLIENT_CONN_STATE_CHANGED,this.getAllMqttClientSettings);
    }

    componentWillUnmount() {
        MqttClientService.removeChangeListener(MqttClientConstants.EVENT_MQTT_CLIENT_DATA_CHANGED,this.getAllMqttClientSettings);
        MqttClientService.removeChangeListener(MqttClientConstants.EVENT_MQTT_CLIENT_CONN_STATE_CHANGED,this.getAllMqttClientSettings);
    }

    render() {
        var mqttClients = [];
        var message = '';
        var clientConnStates = MqttClientService.getAllMqttClientStates();

        if(this.state.mqttClientSettings!=null && this.state.mqttClientSettings.length>0) {
            for(var i=0;i<this.state.mqttClientSettings.length;i++) {
                var mqttClient = this.state.mqttClientSettings[i];
                var conState = clientConnStates[mqttClient.mcsId];
                var connClass = styles.clientDisConnected;
                var conStateText = 'Not Connected';
                if(conState == MqttClientConstants.CONNECTION_STATE_CONNECTED) {
                    connClass = styles.clientConnected;
                    conStateText = 'Connected';
                } else if(conState == MqttClientConstants.CONNECTION_STATE_ERROR) {
                   connClass = styles.clientConnError;
                   conStateText = 'Connection Error';
                }

                mqttClients.push(
                    <div key={this,mqttClient.mcsId} className="col-xs-12 col-sm-6 col-md-3" onClick={NavUtils.goToMqttClientDashboard.bind(this,mqttClient.mcsId)}>
                        <div style={connClass} className="thumbnail">
                            <div>
                                <h4>{mqttClient.mqttClientName}</h4>
                                <div><small>{mqttClient.protocol+' '+mqttClient.host}</small></div>
                                <div><b>{conStateText}</b></div>
                            </div>
                        </div>
                    </div>
                );
            }
        }

        if(mqttClients.length ==0) {
            message = <div className="alert" role="alert">
                <b>No MQTT clients added. Click <button onClick={NavUtils.gotToAddMqttClient} type="button" style={{margin:10}} className="btn btn-primary"><b>Create MQTT Client</b></button> to add new MQTT client</b></div>;
        }

        return (
            <div>
                <nav className="navbar navbar-default navbar-fixed-top">
                    <div>
                        <div className="navbar-header">
                            <LeftMenuButton/>
                            <span style={{margin:15}}><b>MQTT CLIENTS</b></span>
                        </div>
                        <div id="navbar" className="navbar-collapse collapse">
                            <ul className="nav navbar-nav">
                                <li style={styles.buttonContainer}>
                                    <button onClick={NavUtils.gotToAddMqttClient} type="button" className="btn btn-primary">
                                        <b>Create MQTT Client</b>
                                    </button>
                                </li>
                                <li style={styles.buttonContainer}>
                                    <button onClick={NavUtils.goToMqttLoadList} title="MQTT LOAD" type="button" className="btn btn-default">
                                      <span className="glyphicon glyphicon-flash" aria-hidden="true"></span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <div className="container-fluid" style={styles.container}>
                    <div className="row">
                        {mqttClients}
                    </div>
                    <div>
                        {message}
                    </div>
                </div>
            </div>
        );
    }
}

export default MqttClientList;
