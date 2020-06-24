'use strict';
const {Network, Printer} = require('escpos');
const device = new Network('192.168.1.100', 9100);
const printer = new Printer(device);

device.open(function (err) {
    printer
    .font('a')
    .align('ct')
    .style('bu')
    .size(1, 1)
    .text('The quick brown fox jumps over the lazy dog')
    .text('敏捷的棕色狐狸跳过懒狗')
    .barcode('1234567', 'EAN8')
    .qrimage('https://github.com/song940/node-escpos', function (err) {
        this.cut();
        this.close();
    });
});