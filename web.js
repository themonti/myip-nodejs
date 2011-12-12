var http = require( 'http' )
var dns = require( 'dns')

server = http.createServer(
  function( req, res ) {
    // The true client IP can come from multiple sources, depending on whether a reverse-proxy is used or not.
    var x_forwarded_for = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0] : '';
    var ip_address = req.headers['x-real-ip'] || x_forwarded_for || req.connection.remoteAddress;

    // When this app is reverse-proxied behind Nginx, and Nginx is listening on an IPv6 socket,
    // and the client connects with IPv4, the IP address will be formatted as IPv6, such as ::ffff:1.2.3.4.
    // We need to strip the prefix so we can look up the PTR record for the IP.
    ip_address = ip_address.replace(/^::ffff:/i, '');

    // Start the response
    res.writeHead(200, {'Content-type': 'text/plain'});
    res.write(ip_address + "\n");
    console.log(ip_address);
    
    // Lookup the PTR of the client IP and add to the response
    // This will throw an exception if we don't pass in a valid IP
    try {
      dns.reverse(ip_address, function(err, domains) {
        if (err) {
          msg = "DNS failed: " + err.toString();
        } else {
          msg = ip_address + " = " + domains.join(', ');
        }
        
        console.log(msg);
        res.end(msg + "\n");

      });
    } catch(e) {
      console.log('Exception from dns.reverse: (' + e.name + '): ' + e.message);
      res.end("DNS failed\n");
    }
  }
);

// Run server on port specified by PORT environment variable, defaulting to 3000
port = process.env.PORT || 3000;
server.listen(port, function() {
  console.log("Listening on " + port);
});
