// React Imports 
import { useEffect, useState } from 'react'

// Imports
import axios from 'axios'

// TODO
// - get data 
// - replace region based on drop-down
// - replace title based on search parameter 
// - use offset for pagination 

const App = () => {
  // ! State 
  const [events, setEvents] = useState('')
  const [location, setLocation] = useState('')
  const [errors, setErrors] = useState('')
  const [formData, setFormData] = useState({
    search: '',
    region: '',
  })

  // ! Execution 
  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get(' https://global.atdtravel.com/api/products?geo=en') 
      console.log(data)
      setEvents(data)
    }
    getData()
  }, [])

  return ( 
    <h1>Product Search</h1>

  ) 
}

export default App
