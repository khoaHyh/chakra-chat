$(document).ready(function () {
    /*global io*/
    let socket = io();
    // Handle when a user connects/disconnects on the client side
    socket.on('user', data => {
        $('#num-users').text(data.currentUsers + ' users online');
        let message = data.name +
            (data.connected ? ' has joined the chat.' : ' has left the chat.');
        $('#messages').append($('<li>').html('<b>' + message + '</b>'));
    });

    // Listen for event 'chat message' and append data to #messages
    socket.on('chat message', (data) => {
        console.log('socket.on 1');
        $('#messages').append($('<li>').text(`${data.name}: ${data.message}`));
    });

    // Form submittion with new message in field with id 'm'
    $('form').submit(function () {
        var messageToSend = $('#m').val();
        // Send message to server here
        socket.emit('chat message', messageToSend);
        $('#m').val('');
        return false; // prevent form submit from refreshing page
    });
});
