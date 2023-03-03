// React Imports 
import { useEffect, useState } from 'react'

// Bootstrap Imports 
import { Container, Row, Col, Form, Button, ListGroup, ListGroupItem } from 'react-bootstrap'

// Imports
import axios from 'axios'

// TODO
// - get data 
// - replace region based on drop-down
// - replace title based on search parameter 
// - use offset for pagination 

const App = () => {
  // ! State 
  const [products, setProducts] = useState('')
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
      setProducts(data)
    }
    getData()
  }, [])

  const handleChange = (e) => {
    console.log(e.target.value)
    setLocation(e.target.value)
  }


  return (
    <Container>
      <Row>
        <h1>Product Search</h1>
      </Row>
      <Row>
        <Form>
          <Row>
            <Form.Group as={Row} className='search-form'>
              <Col sm={2}>
                <Form.Label>
                    Title
                </Form.Label>
              </Col>
              <Col>
                <Form.Control type='text' onChange={handleChange}/>
              </Col>
            </Form.Group>
            <Col>
              <Button type='submit'>Submit</Button>
            </Col>
          </Row>
        </Form>
      </Row>
      <ListGroup className='product-list'>
        <ListGroupItem className='list-group'>
          <div>
            <img className='product-image' src='https://res.cloudinary.com/dhjguxvm1/image/upload/v1669369462/sample.jpg' ></img>
          </div>
          <div className='product-title'>
            <h4>Title</h4>
          </div>
          <div className='product-destination'>
            <h4>Destination</h4>
          </div>
        </ListGroupItem>
      </ListGroup>
    </Container> 
  ) 
}

export default App
