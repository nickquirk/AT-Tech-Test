// React Imports 
import { useEffect, useState } from 'react'

// Bootstrap Imports 
import { Container, Row, Col, Form, Button, ListGroup, ListGroupItem } from 'react-bootstrap'

// Imports
import axios from 'axios'

// TODO
// - replace region based on drop-down
// - use offset for pagination 
// - error handling 
//    - 404
// - spinner for loading 

const App = () => {
  // ! State 
  const [products, setProducts] = useState([])
  const [errors, setErrors] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    region: '',
  })

  // ! Execution 
  // fetch default data from API
  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get('https://global.atdtravel.com/api/products?geo=en') 
      console.log(data)
      setProducts(data)
    }
    getData()
  }, [])

  useEffect(() => {
    console.log(formData)
  }, [formData])

  // call API with user search results 
  const getSearchData = async () => {
    const { data } = await axios.get(`https://global.atdtravel.com/api/products?geo=${formData.region}&title=${formData.title}`) 
    console.log(data)
    setProducts(data)
  }

  // update form data with user input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRegionChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    getSearchData()
  }

  // Submit user input and call API 
  const handleSubmit = (e) => {
    e.preventDefault()
    getSearchData()
    console.log('form submitted')
    setProducts('')
  }


  return (
    <Container>
      <Row>
        <h1>Product Search</h1>
      </Row>
      <Row>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Form.Group as={Row} className='search-form'>
              <Col sm={2}>
                <Form.Label>
                    Title
                </Form.Label>
              </Col>
              <Col>
                <Form.Control name='title' type='text' value={formData.title} onChange={handleChange}/>
              </Col>
            </Form.Group>
            <Col>
              <Form.Group>
                <Form.Select name='region' className='region-select' value={formData.region} onChange={handleRegionChange}>
                  <option value='en'>UK</option>
                  <option value='en-ir'>Ireland</option>
                  <option value='de-de'>Germany</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col>
              <Button type='submit'>Submit</Button>
            </Col>
          </Row>
        </Form>
      </Row>
      <ListGroup className='product-list'>
        { products.data ? 
          products.data.map(product => {
            const { id, title, dest } = product
            return (
              <ListGroupItem key={id} className='list-group'>
                <div>
                  <img className='product-image' src={product.img_sml}></img>
                </div>
                <div className='product-title'>
                  <p>{title}</p>
                </div>
                <div className='product-destination'>
                  <p>{dest}</p>
                </div>
              </ListGroupItem>
            )
          })
          :
          <p>Loading...</p>
        }
      </ListGroup>
    </Container> 
  ) 
}

export default App
