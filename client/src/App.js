// React Imports 
import { useEffect, useState } from 'react'

// Bootstrap Imports 
import { Container, Row, Col, Form, Button, Table, Pagination } from 'react-bootstrap'

// Imports
import axios from 'axios'
import spinner from './assets/spinner.gif'

const App = () => {
  // ! State 
  const [products, setProducts] = useState([])
  const [errors, setErrors] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    region: 'en',
    productNumber: 10,
  })
  // ? Pagination 
  const [totalPages, setTotalPages] = useState('')
  const [pageNumbers, setPageNumbers] = useState([])
  const [offset, setOffset] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  // ! Execution 
  // fetch default data from API
  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(`https://global.atdtravel.com/api/products?geo=${formData.region}`)
        setErrors(false) // clear error state
        setProducts(data)
        setCurrentPage(1)
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
    generatePageNumbers()
  }, [currentPage, formData.productNumber, products])

  // update offset parameter when page changes
  useEffect(() => {
    setOffset((currentPage * 10) - 10)
  }, [currentPage])

  // call API with user search results when submit button is clicked
  const getSearchData = async () => {
    try {
      const { data } = await axios.get(`https://global.atdtravel.com/api/products?geo=${formData.region}&title=${formData.title}`)
      setErrors(false) // clear error state
      setProducts(data)
      setCurrentPage(1)
    } catch (err) {
      console.log(err.message)
      setErrors(true)
      setErrorMessage(err.message)
    }
  }

  // call API when offset or region/no of products per page values changes 
  useEffect(() => {
    setProducts('')
    const updateProducts = async () => {
      try {
        const { region, title, productNumber } = formData
        const { data } = await axios.get(`https://global.atdtravel.com/api/products?geo=${region}&title=${title}&offset=${offset}&limit=${productNumber}`)
        setErrors(false) // clear error state
        setProducts(data)
      } catch (err) {
        console.log(err.message)
        setErrors(true)
        setErrorMessage(err.message)
      }
    }
    updateProducts()
    generatePageNumbers()
  }, [offset, formData.region, formData.productNumber])


  // update form data with user input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Submit user input and call API 
  const handleSubmit = (e) => {
    e.preventDefault()
    getSearchData()
    console.log('form submitted')
    setErrors(false) // clear error state
    setProducts('') // set products to '' so that loading spinner shows
  }

  // populate array to create page numbers 
  const generatePageNumbers = () => {
    const totalCount = products.meta ? products.meta.total_count : 0 // get total number of products from API call
    const totalPageAmount = Math.ceil(totalCount / parseInt(formData.productNumber)) // calculate total amount of pages
    const arr = []
    for (let i = 1; i <= totalPageAmount; i++) {
      arr.push(i)
    }
    setPageNumbers(arr)
    setTotalPages(totalPageAmount)
  }

  // ! JSX
  return (
    <Container>
      <Row>
        <h1>Product Search</h1>
      </Row>
      <Row className='mt-4'>
        <Col className='region-select'>
          <Form.Label>
            Region
          </Form.Label>
        </Col>
        <Col sm={2}>
          <Form.Group>
            <Form.Select
              name='region'
              // className='region-select'
              value={formData.region}
              onChange={handleChange}>
              <option value='en'>UK</option>
              <option value='en-ie'>Ireland</option>
              <option value='de-de'>Germany</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      <Row className='product-number mt-2'>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Form.Group as={Row} className='search-form'>
              <Col sm={2} className='label'>
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
            <Col sm={2} className='label'>
              <Form.Label>
                Products per page
              </Form.Label>
            </Col>
            <Col sm={2}>
              <Form.Group>
                <Form.Select
                  name='productNumber'
                  value={formData.productNumber}
                  onChange={handleChange}>
                  <option value='10'>10</option>
                  <option value='20'>20</option>
                  <option value='50'>50</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Row>
      {errors && <div className='messages'>
        <p>Oops, looks like there&apos;s an error:</p> 
        <div className='error'>{errorMessage}</div></div>}
      <Table striped hover className='mt-2'>
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Destination</th>
            <th>Price from</th>
          </tr>
        </thead>
        <>
          <tbody>
            {products.data ? products.data.map(product => {
              const { id, title, dest } = product
              return (
                <tr key={id}>
                  <td><img className='product-image' src={product.img_sml} /></td>
                  <td>{title}</td>
                  <td>{dest}</td>
                  <td> {formData.region === 'en' ? '??' : '???'} {product.price_from_adult !== '0.00' ? product.price_from_adult : 'N/A'}</td>
                </tr>
              )
            })
              :
              null
            }
          </tbody>
        </>
      </Table>
      {!products && !errors && <div className='messages'><img src={spinner}/></div>}
      <div className='page-number'>
        <p>page {currentPage} of {totalPages}</p>
      </div>
      <div className='pagination'>
        <Pagination>
          <Pagination.First onClick={() => setCurrentPage(1)} />
          <Pagination.Prev onClick={() => currentPage > 1 ? setCurrentPage(currentPage - 1) : setCurrentPage(1)} />
          {pageNumbers
            .filter((page) => page >= currentPage - 3 && page <= currentPage + 3)
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
