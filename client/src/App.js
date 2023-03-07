// React Imports 
import { useEffect, useState } from 'react'

// Bootstrap Imports 
import { Container, Row, Col, Form, Button, Table, Pagination } from 'react-bootstrap'

// Imports
import axios from 'axios'

// TODO
// - use offset for pagination 
//    - limit parameter to change number of reults per page 
// set current page to 1 on reload 
// recreate page num array on reload 
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
  const [pageNumbers, setPageNumbers] = useState([])
  const [offset, setOffset] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)


  // ! Execution 
  // fetch default data from API
  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get('https://global.atdtravel.com/api/products?geo=en')
        console.log('data from generic API call ->', data)
        setErrors(false) // clear error state
        setProducts(data)
        generatePageNumbers()
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
    console.log('currentPage -> ', currentPage)
    generatePageNumbers()
  }, [currentPage, ITEMS_PER_PAGE, products])

  // update offset parameter when page changes
  useEffect(() => {
    setOffset((currentPage * 10) - 10)
  }, [currentPage])


  // call API with user search results 
  const getSearchData = async () => {
    try {
      const { data } = await axios.get(`https://global.atdtravel.com/api/products?geo=${formData.region}&title=${formData.title}`)
      console.log('data from custom API call ->', data)
      setErrors(false) // clear error state
      setProducts(data)
      setCurrentPage(1)
      generatePageNumbers()
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

  const handleClick = (e) => {
    const target = e.target.text
    let activePage
    if (target === '«') {
      activePage = 1
    } else if (target === '‹') {
      activePage++
    } else if (target === '›') {
      activePage--
    } else if (target === '»') {
      activePage = totalPages
    } else {
      activePage = parseInt(target)
    }
    console.log('active page ->', activePage)
    setCurrentPage(activePage)
  }


  // Pagination for product results 
  const handlePagination = () => {
    // TODO
    // dynamically create pagination numbers based on num pages 
    generatePageNumbers()
    const totalCount = products.meta ? products.meta.total_count : 0 // get total number of products from API call
    setTotalItems(totalCount)
    setTotalPages(Math.ceil(totalCount / ITEMS_PER_PAGE))
    console.log('total pages ->', totalPages)
  }

  // populate array to create page numbers 
  const generatePageNumbers = () => {
    const arr = []
    for (let i = 1; i <= totalPages; i++) {
      arr.push(i)
    }
    setPageNumbers(arr)
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
      <div className='page-number'>
        <p>page {currentPage} of {totalPages}</p>
      </div>
      <div className='pagination'>
        <Pagination>
          <Pagination.First onClick={() => setCurrentPage(1)} />
          <Pagination.Prev onClick={() => currentPage > 1 ? setCurrentPage(currentPage - 1) : setCurrentPage(1)} />
          {pageNumbers
            .filter((page) => page >= currentPage - 3 && page <= currentPage + 4)
            .map((page) => (
              <Pagination.Item
                key={page}
                active={page === currentPage}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Pagination.Item>
            ))}
          <Pagination.Next onClick={() => currentPage < totalPages ? setCurrentPage(currentPage + 1) : setCurrentPage(totalPages)} />
          <Pagination.Last onClick={() => setCurrentPage(totalPages)} />
        </Pagination>
      </div>
    </Container>
  )
}

export default App
