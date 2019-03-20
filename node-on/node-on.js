module.exports = function (RED) {
    function SonoffOn(config) {
        const node = this;
        RED.nodes.createNode(node, config);
        
        node.server = RED.nodes.getNode(config.server);
        const sonoffServer = node.server.sonoffServer;

        node.on('input', function (msg) {
            msg.topic = config.outlet == -1 ? config.device_id : config.device_id + "_" + config.outlet;
            if (config.outlet == -1) {
                msg.payload = sonoffServer.turnOnDevice(config.device_id);
            } else {
                msg.payload = sonoffServer.turnOnDeviceOutlet(config.device_id, config.outlet);
            }
            node.send(msg);
        });
    }
    RED.nodes.registerType("sonoff-on", SonoffOn);
}