import {Component} from 'react'
import Cookies from 'js-cookie'

import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Loader from 'react-loader-spinner'

import Header from '../Header'

import './index.css'
import SimilarProductItem from '../SimilarProductItem'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {
    productsData: '',
    similarProductsData: [],
    apiStatus: apiStatusConstants.initial,
    quantity: 1,
  }

  componentDidMount() {
    this.getProductsData()
  }

  fetchFormattedData = data => ({
    id: data.id,
    imageUrl: data.image_url,
    title: data.title,
    style: data.style,
    price: data.price,
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    rating: data.rating,
    totalReviews: data.total_reviews,
  })

  getProductsData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      console.log(data)
      const formattedProductsdata = this.fetchFormattedData(data)
      const formattedSimilarProductsData = data.similar_products.map(
        eachProduct => ({
          id: eachProduct.id,
          imageUrl: eachProduct.image_url,
          title: eachProduct.title,
          style: eachProduct.style,
          price: eachProduct.price,
          availability: eachProduct.availability,
          brand: eachProduct.brand,
          description: eachProduct.description,
          rating: eachProduct.rating,
        }),
      )

      this.setState({
        productsData: formattedProductsdata,
        similarProductsData: formattedSimilarProductsData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickPlusButton = () => {
    this.setState(prevState => ({
      quantity: prevState.quantity + 1,
    }))
  }

  onClickMinusButton = () => {
    const {quantity} = this.state
    if (quantity === 1) {
      this.setState({quantity: 1})
    } else {
      this.setState(prevState => ({
        quantity: prevState.quantity - 1,
      }))
    }
  }

  renderProductsList = () => {
    const {productsData, similarProductsData, quantity} = this.state
    const {
      imageUrl,
      title,
      price,
      rating,
      totalReviews,
      description,
      availability,
      brand,
    } = productsData
    return (
      <>
        <div className="active-product-item-container">
          <img src={imageUrl} alt="product" className="select-product-image" />
          <div className="product-details-container">
            <h1 className="product-title">{title}</h1>
            <p className="product-price">Rs {price}/-</p>
            <div className="rating-review-container">
              <div className="rating-container">
                <p className="product-rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png "
                  alt="star"
                  className="star-icon"
                />
              </div>
              <p className="product-reviews">{totalReviews} Reviews</p>
            </div>
            <p className="product-description">{description}</p>
            <p className="product-availability">
              <span className="span-element">Available:</span>
              {availability}
            </p>
            <p className="brand-heading">
              <span className="span-element">Brand:</span>
              {brand}
            </p>
            <hr className="horizontal-line" />
            <div className="increase-decrease-buttons">
              <BsDashSquare
                data-testid="minus"
                onClick={this.onClickMinusButton}
                className="quantity-control-buttons"
              />

              <p>{quantity}</p>

              <BsPlusSquare
                data-testid="plus"
                onClick={this.onClickPlusButton}
                className="quantity-control-buttons"
              />
            </div>
            <button type="button" className="add-to-cart-button">
              ADD TO CART
            </button>
          </div>
        </div>
        <h1 className="similar-products-heading">Similar Products</h1>
        <ul className="similar-products-container">
          {similarProductsData.map(eachSimilarProduct => (
            <SimilarProductItem
              key={eachSimilarProduct.id}
              eachSimilarProduct={eachSimilarProduct}
            />
          ))}
        </ul>
      </>
    )
  }

  onClickContinueShoppingButton = () => {
    const {history} = this.props
    console.log(history)
    history.replace('/products')
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="failure-view-image"
      />
      <h1 className="failure-view-text">Product Not Found</h1>
      <button
        type="button"
        className="continue-shopping-button"
        onClick={this.onClickContinueShoppingButton}
      >
        Continue Shopping
      </button>
    </div>
  )

  renderLoaderSpinner = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderProductsContent = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductsList()
      case apiStatusConstants.inProgress:
        return this.renderLoaderSpinner()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="product-item-details-container">
        <Header />
        <div className="products-list-container">
          {this.renderProductsContent()}
        </div>
      </div>
    )
  }
}

export default ProductItemDetails
