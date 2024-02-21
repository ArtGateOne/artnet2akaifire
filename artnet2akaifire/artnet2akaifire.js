//artnet2akaifire by ArtGateOne v1.0

var dmxlib = require('dmxnet');
var easymidi = require('easymidi');

midi_out = 'FL STUDIO FIRE';    //set correct midi out device name

var output = new easymidi.Output(midi_out);

var dmxnet = new dmxlib.dmxnet(
    {
        //log: { level: 'info' }, // Winston logger options
        //oem: 0, // OEM Code from artisticlicense, default to dmxnet OEM.
        //esta: 0, // ESTA Manufacturer ID from https://tsp.esta.org, default to ESTA/PLASA (0x0000)
        //sName: "Text", // 17 char long node description, default to "dmxnet"
        //lName: "Long description", // 63 char long node description, default to "dmxnet - OpenSource ArtNet Transceiver"
        //hosts: ["2.0.0.2"], // Interfaces to listen to, all by default
        errFunc: function (err) {
            this.error(`Do some error handling or throw it: ${err.message}, stack: ${err.stack}`);
        }.bind(this) // optional function to handle errors from the library by yourself. If omitted the errors will be thrown by the library
    }
);


var receiver = dmxnet.newReceiver(
    {
        subnet: 0, //Destination subnet, default 0
        universe: 0, //Destination universe, default 0
        net: 0, //Destination net, default 0
    });


receiver.on('data', function (data) {
    //console.log('DMX data:', data);
    var array = [0xF0, 0x47, 0x7F, 0x43, 0x65, 0x02, 0x00];
    

    for (var i = 0; i < 64; i++) {
        array.push(i);
        array.push(Math.round(data[i * 3] * (127 / 255)));
        array.push(Math.round(data[i * 3 + 1] * (127 / 255)));
        array.push(Math.round(data[i * 3 + 2] * (127 / 255)));
    }

    array.push(0xF7);

    output.send('sysex', array);
});
