// Write your code here
import {Link} from 'react-router-dom'
import './index.css'

const SimilarProductItem = props => {
  const {similarProductDetails, updateActiveProductId} = props
  const {id, imageUrl, title, price, brand, rating} = similarProductDetails

  const onClickSimilarProduct = () => updateActiveProductId(id)

  return (
    <li className="similar-product-list" onClick={onClickSimilarProduct}>
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-product-img"
      />
      <p className="similar-product-name">{title}</p>
      <p className="similar-product-brand">{brand}</p>
      <div className="price-review-cont">
        <p className="product-price">RS {price}/- </p>
        <p className="rating">
          {rating}
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="stars"
          />
        </p>
      </div>
    </li>
  )
}

export default SimilarProductItem
