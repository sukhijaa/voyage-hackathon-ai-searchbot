import './LandingPage.css';
import Layout from '../components/layout/Layout.js'
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';

function LandingPage() {
  return (
    <Layout title={"Home"}>
      <div className='landing-page-wrapper'>
        <div className='landing-page-title'>
          Welcome to TBO.com
        </div>
        <div className='landing-page-subtitle'>
          Your one stop travel solution - Now powered with Artificial Intelligence
          <br/>
          <br/>
          We have come up with a powerful chatbot to enhance your travel booking experience.
          <br/>
        </div>
        <div className='laning-page-search-wrapper'>
          <ul className='landing-page-ul'>
          Share your requirements in your preferred way
          <li className='landing-page-li'>
            Type your requirements in plain english
          </li>
          <li className='landing-page-li'>
            Speak out your requirements
          </li>
          <li className='landing-page-li'>
            Upload an image of the place you want to visit
          </li>
          </ul>
          <div className='landing-page-details'>
            And we will create the entire iininerary, just the way you like it.
            <br/>
            All you have to do is choose from our curated list of suggestions and you're done
            <br/>
            No need to perform multilpe searches for Hotels, Flights, Car Rentals etc.
            <br/>
            <br/>
            For more details on how to use this chatbot more efficiently, click <Link to="/faq">here</Link>
          </div>
          <div className='landing-page-search'>
          <Link to="/search"><Button variant='outlined'>Start Searching</Button></Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default LandingPage;
