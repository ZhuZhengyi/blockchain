/**
 * Created by WeiChen on 2016/5/5.
 */
'use strict'
var Http = require( 'http' ),
    Router = require( 'router' ),
    server,
    router= new Router();

server = Http.createServer( function( request, response ) {
    router( request, response, function( error ) {
        if ( !error ) {
            response.writeHead( 404 );
        } else {
            // Handle errors
            console.log( error.message, error.stack );
            response.writeHead( 400 );
        }
        response.end( 'API Server is running!' );
    });
});

server.listen( 3000, function() {
    console.log( 'Listening on port 3000' );
});


function createContract( request, response ) {
    console.log( 'Create contract');
    response.writeHead( 201, {
        'Content-Type' : 'text/plain'
    });
    response.end( 'created' );
}
router.post( '/create', createContract );
