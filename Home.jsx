
import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div>
           
            <div>
            <div className='app'>
                <Link to="/app"><div className='box'></div></Link>
            </div>
                <iframe className='home-frame' src="https://sust-hackathon.netlify.app/"></iframe>
            </div>
        </div>
    );
}
