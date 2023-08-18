import React from 'react';
import { Link } from 'react-router-dom';
import { uniqueNamesGenerator, adjectives } from 'unique-names-generator';

function Home() {

    const customConfig = {
        dictionaries: [adjectives, adjectives], 
        separator: '-',
        length: 2,
    };


    return (
        <div className="container mt-5">
            <h1 className="display-4 text-center">Tip the Scales</h1>

            <h2 className="mt-5">What?</h2>
            <p>
                Tip The Scales is a simple dice rolling site that lets multiple users in a room see eachother&apos;s rolls in real time.<br></br>
                The gimmick is that users that know the password to a room may <b>secretly cheat</b> their own rolls.
            </p>

            <h2 className="mt-4">Why?</h2>
            <p>
                Maybe you&apos;re playing an RPG and want your DM to have carte blance so they can spice the game up. Use however you want.<br></br>
                Do note that players will be clearly warned upon joining a room about potential cheating.
            </p>

            <h2 className="mt-4">How?</h2>
            <p>
                Just go to {window.location.host}/<i>[anyRoomNameYouWant]</i> to enter or create a room. There is no login, no options, nothing.<br></br>
                Note that rooms are public and disposable. Anyone with the URL can view your rolls, and anyone with the password can cheat.<br></br>
                If you leak your room name or password, just make a new room.
            </p>

            <p>
                Ready to roll? Here&apos;s a randomly generated room name.
            </p>
            <div className="text-center mt-3">
                <Link to={`/${uniqueNamesGenerator(customConfig)}`} className="btn btn-primary">
                    Try an Example Room
                </Link>
            </div>
        </div>
    );
}

export default Home;
