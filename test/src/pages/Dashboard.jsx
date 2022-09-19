import React, {useState, useEffect} from 'react'
import '../styles/Dashboard.css';
import axios from 'axios';
import Sidenav from '../components/Sidenav';
import Songs from '../components/Songs';

const Dashboard = () => {

  const [user, setUser] = useState({});
  const getUser = async () => {
    const result = await axios.get('http://localhost:3001/spuser');
    setUser(result.data);
    return result;
  }
  
  useEffect(() => {
    getUser();
  }, [])

  return (
    <div className="Dashboard-Container">
      <Sidenav user={user} />
      <Songs user={user} />
    </div>
  )
}

export default Dashboard