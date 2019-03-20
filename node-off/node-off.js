module.exports = function (RED) {
    function SonoffOff(config) {
        const node = this;
        RED.nodes.createNode(node, config);
        
        node.server = RED.nodes.getNode(config.server);
        const sonoffServer = node.server.sonoffServer;

        node.on('input', function (msg) {
            msg.topic = config.outlet == -1 ? config.device_id : config.device_id + "_" + config.outlet;
            if (config.outlet == -1) {
                msg.payload = sonoffServer.turnOffDevice(config.device_id);
            } else {
                msg.payload = sonoffServer.turnOffDeviceOutlet(config.device_id, config.outlet);
            }
            node.send(msg);
        });
    }
    RED.nodes.registerType("sonoff-off", SonoffOff);
}