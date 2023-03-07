// React Imports 
import { useEffect, useState } from 'react'

// Bootstrap Imports 
import { Container, Row, Col, Form, Button, Table, Pagination } from 'react-bootstrap'

// Imports
import axios from 'axios'

// TODO
// - use offset for pagination 
//    - limit parameter to change number of reults per page 
// - spinner for loading 

// ? Styling
// portrait for pics 
// colour things correct colour : buttons etc...

const App = () => {
  // ! Variables
  const ITEMS_PER_PAGE = 10

  // ! State 
  const [products, setProducts] = useState([])
  const [errors, setErrors] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    region: 'en',
  })
  // Pagination 
  const [totalItems, setTotalItems] = useState('')
  const [totalPages, setTotalPages] = useState('')
  const [totalCount, setTotalCount] = useState('')
  const [items, setItems] = useState([])
  const [displayItems, setDisplayItems] = useState([])
  const [activePage, setActivePage] = useState(1)
  const [offset, setOffset] = useState(0)
    

  // ! Execution 
  // fetch default data from API
  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get('https://global.atdtravel.com/api/products?geo=en')
        console.log('data from generic API call ->', data)
        setErrors(false) // clear error state
        setProducts(data)
      } catch (err) {
        console.log(err)
        setErrors(true)
        setErrorMessage(err.message)
      }
    }
    getData()
  }, [])


  // Call paginate function when relevant details change 
  useEffect(() => {
    products ? handlePagination() : ''
    console.log('useEffect products', products)
  }, [activePage, ITEMS_PER_PAGE, products])

  // call API with user search results 
  const getSearchData = async () => {
    try {
      const { data } = await axios.get(`https://global.atdtravel.com/api/products?geo=${formData.region}&title=${formData.title}`)
      console.log('data from custom API call ->', data)
      setErrors(false) // clear error state
      setProducts(data)
    } catch (err) {
      console.log(err.message)
      setErrors(true)
      setErrorMessage(err.message)
    }
  }

  // call API when offset value changes 
  useEffect(() => {
    setProducts('')
    const updateOffset = async () => {
      try {
        const { data } = await axios.get(`https://global.atdtravel.com/api/products?geo=${formData.region}&title=${formData.title}&offset=${offset}`)
        console.log('data from offset API call ->', data)
        setErrors(false) // clear error state
        setProducts(data)
      } catch (err) {
        console.log(err.message)
        setErrors(true)
        setErrorMessage(err.message)
      }
    }
    updateOffset()
  }, [offset])
  

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
    setErrors(false) // clear error state
    setProducts('') // set products to '' so that loading spinner shows
  }

  // Pagination for product results 
  const handlePagination = () => {
    // TODO
    // handle offset - recall API with offset = page no * items per page
    // dynamically create pagination numbers based on num pages 


    const totalCount = products.meta ? products.meta.total_count : 0 // get total number of products from API call
    console.log('total count ->', totalCount)
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)
    console.log('total pages ->', totalPages)

    const startIndex = (activePage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const paginatedItems = []

    for (let number = 1; number <= totalCount; number++) {
      paginatedItems.push(
        <Pagination.Item
          key={number}
          active={number === activePage}
          onClick={() => setActivePage(number)}
        >
          {number}
        </Pagination.Item>
      )
    }
    const productOffset = (activePage * 10) - 10 // calculate required offset
    setOffset(productOffset) // set API offset parameter 
    setTotalItems(totalCount) // set total number of items
    setItems(paginatedItems)
    setDisplayItems(items.slice(startIndex, endIndex))
    console.log('display items ->', displayItems)
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
                <Form.Control name='title' type='text' value={formData.title} onChange={handleChange} />
              </Col>
            </Form.Group>
            <Col className='d-flex align-items-center'>
              <Button type='submit'>Submit</Button>
            </Col>
            <Col className='d-flex align-items-center'>
              <Form.Label>
                Region
              </Form.Label>
              <Form.Group>
                <Form.Select
                  name='region'
                  className='region-select'
                  value={formData.region}
                  onChange={handleRegionChange}>
                  <option value='en'>UK</option>
                  <option value='en-ie'>Ireland</option>
                  <option value='de-de'>Germany</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Row>
      <Table striped hover>
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Destination</th>
          </tr>
        </thead>
        <tbody>
          {products.data ?
            products.data.map(product => {
              const { id, title, dest } = product
              return (
                <tr key={id}>
                  <td><img className='product-image' src={product.img_sml} /></td>
                  <td>{title}</td>
                  <td>{dest}</td>
                </tr>
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
        </tbody>
      </Table>
      <div>
        <Pagination>{items}</Pagination>
      </div>
    </Container>
  )
}

export default App
