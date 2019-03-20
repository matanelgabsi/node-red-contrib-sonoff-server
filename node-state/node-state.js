module.exports = function (RED) {
    function SonoffState(config) {
        const node = this;
        RED.nodes.createNode(node, config);
        
        node.server = RED.nodes.getNode(config.server);
        const sonoffServer = node.server.sonoffServer;

        const parseState = (rawState) => {
            if (config.outlet != -1 && rawState) {
                console.log("rawState", rawState)
                return rawState.find(elm => elm.outlet == config.outlet).switch
            }
            return rawState
        }

        onDisconnect();

        sonoffServer.registerOnDeviceUpdatedListener(config.device_id, (deviceState) => {
            deviceState = parseState(deviceState)
            if (deviceState === "on" || deviceState === "off") {
                onConnect(deviceState);
            } else {
                onDisconnect();
            }
        });

        sonoffServer.registerOnDeviceConnectedListener(config.device_id, (deviceState) => {
            deviceState = parseState(deviceState)
            onConnect(deviceState);
        });

        sonoffServer.registerOnDeviceDisconnectedListener(config.device_id, (deviceState) => {
            onDisconnect();
        });

        function onConnect(deviceState) {
            node.status({ fill: "green", shape: "dot", text: "connected/" + deviceState });
            node.send({
                topic: config.outlet == -1 ? config.device_id : config.device_id + "_" + config.outlet,
                payload: deviceState
            });
        }

        function onDisconnect() {
            node.status({ fill: "red", shape: "dot", text: "disconnected" });
            node.send({
                topic: config.outlet == -1 ? config.device_id : config.device_id + "_" + config.outlet,
                payload: "disconnected"
            });
        }

        node.on('input', function (msg) {
            msg.topic = config.outlet == -1 ? config.device_id : config.device_id + "_" + config.outlet;
            msg.payload = parseState(sonoffServer.getDeviceState(config.device_id));
            node.send(msg);
        });
    }
    RED.nodes.registerType("sonoff-state", SonoffState);
}