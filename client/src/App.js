// React Imports 
import { useEffect, useState } from 'react'

// Bootstrap Imports 
import { Container, Row, Col, Form, Button, ListGroup, ListGroupItem, Table } from 'react-bootstrap'

// Imports
import axios from 'axios'

// TODO
// - use offset for pagination 
//    - limit parameter to change number of reults per page 
// - error handling 
// - try/catch blocks 
//    - 404
// - spinner for loading 
// - Titles above list 
// - Remake with table rather than List group 

// ? Styling
// portrait for pics 
// align description text left 

const App = () => {
  // ! State 
  const [products, setProducts] = useState([])
  const [errors, setErrors] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    region: 'en',
  })

  // ! Execution 
  // fetch default data from API
  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get('https://global.atdtravel.com/api/products?geo=en') 
        console.log(data)
        setProducts(data)
        setErrors(false) // clear error state
      } catch (err) {
        console.log(err)
        setErrors(true)
        setErrorMessage(err.message)
      }
    }
    getData()
  }, [])

  useEffect(() => {
    //console.log(formData)
  }, [formData])

  // call API with user search results 
  const getSearchData = async () => {
    try {
      const { data } = await axios.get(`https://global.atdtravel.com/api/products?geo=${formData.region}&title=${formData.title}`) 
      console.log(data)
      setProducts(data)
      setErrors(false) // clear error state
    } catch (err) {
      console.log(err.message)
      setErrors(true)
      setErrorMessage(err.message)
    }
  }

  // update form data with user input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // update region and call API
  const handleRegionChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    getSearchData()
  }

  // Submit user input and call API 
  const handleSubmit = (e) => {
    e.preventDefault()
    getSearchData()
    console.log('form submitted')
    setProducts('') // set products to '' so that loading spinner shows
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
              <Col sm={2} className='form-title'>
                <Form.Label>
                    Title
                </Form.Label>
              </Col>
              <Col>
                <Form.Control name='title' type='text' value={formData.title} onChange={handleChange}/>
              </Col>
            </Form.Group>
            <Col>
              <Button type='submit'>Submit</Button>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>
                    Region
                </Form.Label>
                <Col>
                  <Form.Select 
                    name='region' 
                    className='region-select' 
                    value={formData.region} 
                    onChange={handleRegionChange}>
                    <option value='en'>UK</option>
                    <option value='en-ie'>Ireland</option>
                    <option value='de-de'>Germany</option>
                  </Form.Select>
                </Col>
              </Form.Group>
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
          : errors ?
            <div className='messages'>
              <p>Oops, looks like there&apos;s an error...</p>
              <p className='error'>{errorMessage}</p>
            </div>
            : 
            <div className='messages'>
              <p>Loading...</p>
            </div>
        }
      </ListGroup>
      <Table striped border hover>
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Destination</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><img className='product-image' src='https://res.cloudinary.com/dhjguxvm1/image/upload/v1669369462/sample.jpg'/></td>
            <td>I&apos;m baby crucifix cloud bread heirloom jianbing fit selvage affogato chia gatekeep. Cray prism listicle fashion axe, </td>
            <td>London</td>
          </tr>
          <tr>
            <td><img className='product-image' src='https://res.cloudinary.com/dhjguxvm1/image/upload/v1669369462/sample.jpg'/></td>
            <td>Title here....</td>
            <td>London</td>
          </tr>
        </tbody>
      </Table>
    </Container> 
  ) 
}

export default App
