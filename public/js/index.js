var Snap = require('Snap.js');

var snapper = new Snap({
  element: document.getElementById('content'),
  disable: 'right'
});

snapper.open('left');
snapper.disable();