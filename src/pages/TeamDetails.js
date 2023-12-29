import './TeamDetails.css';
import Layout from '../components/layout/Layout.js'
import { Button, Card } from '@mui/material';
import { Person } from '@mui/icons-material';

const TEAM_DETAILS = {
  name: "Code Commandos",
  members: [
    {
      name: "Abhishek Sukhija",
      email: "abhishek.sukhija@tbo.com"
    },
    {
      name: "Ashok Sharma",
      email: "ashok.sharma@tbo.com"
    },
    {
      name: "Anurag Upadhyay",
      email: "anurag.upadhyay@tbo.com"
    },
    {
      name: "Prabhat Kaushik",
      email: "prabhat.kaushik1@tbo.com"
    },
    {
      name: "Ajay Singh",
      email: "ajay.singh1@tbo.com"
    }
  ]
}

function TeamDetails() {
  return (
    <Layout title={"Team Details"}>
      <div className='team-details-wrapper'>
        <h1>{TEAM_DETAILS.name}</h1>
        {
          TEAM_DETAILS.members.map(member => {
            return (
            <Card elevation={3} className='team-member-wrapper'>
              <Person className='member-icon'/>
                <p className='member-name'>
                  {member.name}
                </p>
                <p className='member-email'>
                  {member.email}
                </p>
            </Card>
            )
          })
        }
      </div>
    </Layout>
  );
}

export default TeamDetails;
