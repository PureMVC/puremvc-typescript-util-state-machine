'use strict';
const PUREMVC = '../../node_modules/@puremvc/puremvc-typescript-multicore-framework';

// THIS IS THE MOST ABSURD THING I'VE EVER HAD TO DO TO MAKE A TEST SUITE WORK.
module.exports = jest.requireActual(PUREMVC);
