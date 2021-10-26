const {io} = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();

bands.addBand(new Band('Queen 2'));
bands.addBand(new Band('Bad buuny perro'));
bands.addBand(new Band('BB king jajaja'));
bands.addBand(new Band('parcels capos'));


// Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    client.on('mensaje', (payload) => {
        console.log('mensajee!!!!', payload);
        io.emit('mensaje', {admin: 'Nuevo mensaje'});
    });


    client.on('vote-band', (payload) => {
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });

    // Escuchar add-band

    client.on('add-band', (payload) => {
        const newBand = new Band(payload.name);
        bands.addBand(newBand);
        io.emit('active-bands', bands.getBands());
    });

    // Borrar delete-band
    client.on('delete-band', (payload) => {
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });

    // client.on('emitir-mensaje', (payload) =>{
    //     // console.log(payload);
    //     client.broadcast.emit('nuevo-mensaje', payload);
    // })
});