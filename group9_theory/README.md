Four Voice Harmony Generator

Problem:
	A web application to do basic theory 
	exercises such as voice leading. 
	(People are sick of doing their music 
	theory homework and want a program to 
	do it for them. )

Solution:
	Allow the user to input a chord 
	progression and have the computer give 
	them sheet music in four voices that 
	follows the rules of tonal theory.

Pick 5:
        Front-end framework (Bootstrap? for many device sizes)
        Client-side data persistence (Cookies storage of good pieces)
        Send emails (containing sheet music and 
        			 or midi data to user)
        Reporting with chart (sheet music)
		Screen Scraping (get image of ouput off 
	       of the screen so that it can be 
	       sent to the user?) -- IS THIS NECESSARY?
        Geolocation (for pseudo-randomly generated 
        			 data based on location)
API's:
	abcjs: create sheet music and midi files
	mandrill: send emails (containing sheet 
						   music and midi file)

What Data:
        Output:
	    Sheet music
	    ABC plaintext?	
	    MIDI
        Collecting:
            Characters repersenting the chord 
	    progression
	    Location (optionally use digits of
	    their lat and lng as a random seed
	    to produce output.)

Algorithms:
	We will have an algorithm which will 
	   use the rules of music theory to 
	   realize the progression.
	We will use the ABC JS library to render
	   ABC markup as sheet music. 
	   (https://github.com/paulrosen/abcjs)

Mockup: 
	The mockup wireframe can be found in the 
	    group github folder.
	    
#Comments by Ming
* "Geolocation (just for kicks)" --I have no idea what the value of this is
* You fell into a trap I didn't want you to fall into. You listed a bunch for technologies for features but for what will they be used for what? Example: for what will email be used for?
* No APIs listed.  Example: how will you be reading in or outputting MIDI?
