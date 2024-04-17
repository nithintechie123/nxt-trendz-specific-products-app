import './index.css'

const SimilarProductItem = props => {
  const {eachSimilarProduct} = props
  const {imageUrl, title, brand, price, rating} = eachSimilarProduct
  return (
    <li className="each-similar-product-item-container">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-product-thumbnail"
      />
      <h1 className="similar-products-title">{title}</h1>
      <p className="similar-products-brand">by {brand}</p>
      <div className="price-rating-container">
        <p className="similar-products-price">Rs {price}/-</p>
        <div className="similar-products-rating-container">
          <p className="similar-products-rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png "
            alt="star"
            className="similar-products-star-icon"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
