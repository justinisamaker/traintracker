# Train Tracker
When a button is pressed, query the CTA API for a specific stop, line, and direction, then parse the XML and make a request to the Twilio API. The request to Twilio pulls out the pertinent info, and then texts the next train arrival to your phone.

	
### Tech
- Node.js
- Twilio
- xml2js
- MRAA
- Forever
- Request
- Moment
- Moment.timezone
	

### Hardware
- [Intel Edison w/ Arduino Breakout Board](https://www.sparkfun.com/products/13097)
- [Grove Button](http://www.seeedstudio.com/depot/Grove-Button-p-766.html)
- [Grove Base Shield](http://www.seeedstudio.com/depot/Grove-Base-Shield-p-754.html)