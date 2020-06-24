'use strict';
const path = require('path');
const variables = require('./variables');
const ip = require('ip');
const escpos = require('escpos');

const venta = path.join('/home/pi/mirariapp-printer/img/'+variables.organizationCode+'/', 'logo.png');
const bocadillos = path.join('/home/pi/mirariapp-printer/img/'+variables.organizationCode+'/', 'bocadillos.png');
const cenas = path.join('/home/pi/mirariapp-printer/img/'+variables.organizationCode+'/', 'cenas.png');
const comida = path.join('/home/pi/mirariapp-printer/img/'+variables.organizationCode+'/', 'comida.png');
const horneado = path.join('/home/pi/mirariapp-printer/img/'+variables.organizationCode+'/', 'horneado.png');
const pan = path.join('/home/pi/mirariapp-printer/img/'+variables.organizationCode+'/', 'pan.png');

let logo = path.join('/home/pi/mirariapp-printer/img/'+variables.organizationCode+'/', 'logo.png');

var PublicSocket = require('socket.io-client')('http://50.18.229.242:8002');
PublicSocket.emit('room', variables.organizationCode);

let PrinterConection = () => {
    PublicSocket.emit('Send_Event', variables.organizationCode, 'printerConection', {
        url: 'http://'+ip.address().toString()+':'+variables.port.toString(),
        name: variables.sellpoint,
        organizationCode: variables.organizationCode,
    });
};

PrinterConection();
setInterval(function(){
    PrinterConection();
}, 60000);

var io = require('socket.io')(variables.port);
io.on('connection', function (privateSocket) {
    privateSocket.on('Send_Event', function(organizationCode, event, data) {
        if (event == 'Print') {
            logo = venta
        }
        //if (event == 'PrintBocadillos') {
            //logo = bocadillos
            //event = 'Print'
        //}
        //if (event == 'PrintCenas') {
            //logo = cenas
            //event = 'Print'
        //}
        //if (event == 'PrintComida') {
            //logo = comida
            //event = 'Print'
        //}
        //if (event == 'PrintHorneado') {
            //logo = horneado
            //event = 'Print'
        //}
        //if (event == 'PrintPan') {
            //logo = pan
            //event = 'Print'
        //}
        if (event == 'Print'){
            (async () => {
                var times = 1
                await '.'.repeat(data[0][1]).split('').forEach(x => {
                    const device  = new escpos.USB();
                    const printer = new escpos.Printer(device);
                    escpos.Image.load(logo, function(image){
                        device.open(function(err){
                            data.forEach(t => {
                                if (t[0] == 'set') {
                                    printer.align(t[1][0])
                                    printer.font(t[1][1])
                                    printer.style(t[1][2])
                                    printer.size(t[1][3],t[1][4])
                                } 
                                if (t[0] == 'text') printer.text(t[1], '857')
                                if (t[0] == 'qr') {
                                    printer.qrimage(t[1], function(){
                                        this.cut()
                                        this.flush()
                                    });
                                }
                                if (t[0] == 'cut'){
                                    //if (logo != venta){
                                        //if (times == 1) printer.text('COMPROBANTE', '857')
                                        //if (times == 2) printer.text('ORDEN DE PRODUCCION', '857')
                                        //if (times == 3) printer.text('TICKET DE CAJA', '857')
                                    //}
                                    printer.text('', '857')
                                    printer.cut()
                                    printer.flush()
                                    times += 1
                                } 
                                if (t[0] == 'image') {
                                    printer.raster(image)
                                    printer.flush()
                                }
                            });
                        });
                    });
                    
                });
            })();
        }
    });
});
