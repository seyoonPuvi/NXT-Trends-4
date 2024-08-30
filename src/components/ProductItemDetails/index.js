import {Component} from 'react'

import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {
    specificProduct: {},
    similarProductList: [],
    quantity: 1,
    apiStatus: apiStatusConstants.initial,
    errorMsg: '',
    activeProductId: '',
  }

  componentDidMount() {
    this.getSpecficProduct()
  }

  getSpecficProduct = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const {activeProductId} = this.state
    const updatedId = activeProductId !== '' ? activeProductId : id

    const jwtToken = Cookies.get('jwt_token')

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const apiUrl = `https://apis.ccbp.in/products/${updatedId}`

    try {
      const response = await fetch(apiUrl, options)

      if (response.ok) {
        const data = await response.json()
        const similarProductDetails = data.similar_products.map(each => ({
          id: each.id,
          imageUrl: each.image_url,
          title: each.title,
          style: each.style,
          price: each.price,
          description: each.description,
          brand: each.brand,
          totalReviews: each.total_reviews,
          rating: each.rating,
          availability: each.availability,
        }))

        const specificProductDetails = {
          id: data.id,
          imageUrl: data.image_url,
          title: data.title,
          price: data.price,
          description: data.description,
          brand: data.brand,
          totalReviews: data.total_reviews,
          rating: data.rating,
          availability: data.availability,
        }

        this.setState(
          {
            similarProductList: similarProductDetails,
            specificProduct: specificProductDetails,
            apiStatus: apiStatusConstants.success,
          },
          this.resetWindowScroll,
        )
      } else {
        const errorData = await response.json()
        this.setState({
          apiStatus: apiStatusConstants.failure,
          errorMsg: errorData.error_msg,
        })
      }
    } catch (error) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
        errorMsg: 'Failed to fetch data. Please try again later.',
      })
    }
  }

  resetWindowScroll = () => {
    window.scrollTo(0, 0)
  }

  onIncrement = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  onDecrement = () => {
    const {quantity} = this.state

    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  onRenderSpecificProduct = () => {
    const {specificProduct, quantity} = this.state
    const {
      id,
      imageUrl,
      title,
      price,
      description,
      brand,
      totalReviews,
      rating,
      availability,
    } = specificProduct

    return (
      <div className="specific-product-cont">
        <div className="specific-img-cont">
          <img src={imageUrl} alt="product" className="specific-img" />
        </div>

        <div className="specific-product-details-cont">
          <h1 className="product-name">{title}</h1>
          <p className="product-price">RS {price}/- </p>
          <div className="rating-review-cont">
            <p className="rating">
              {rating}
              <img
                src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                alt="star"
                className="stars"
              />
            </p>
            <p className="review">{totalReviews} Reviews</p>
          </div>
          <p className="product-desc">{description}</p>
          <p className="avail-brand">
            <span className="avail-brand-title">Availability</span>:{' '}
            {availability}
          </p>
          <p className="avail-brand">
            <span className="avail-brand-title">Brand</span>: {brand}
          </p>
          <hr className="line" />
          <div className="quantity-add-cont">
            <button
              type="button"
              className="quantity-btn"
              data-testid="minus"
              aria-label="Decrement"
              onClick={this.onDecrement}
            >
              <BsDashSquare className="quantity-icon" />
            </button>
            <p className="quantity">{quantity}</p>
            <button
              type="button"
              className="quantity-btn"
              data-testid="plus"
              aria-label="Increment"
              onClick={this.onIncrement}
            >
              <BsPlusSquare className="quantity-icon" />
            </button>
          </div>
          <button type="button" className="add-to-cart-btn">
            ADD TO CART
          </button>
        </div>
      </div>
    )
  }

  onRenderSimilarProducts = () => {
    const {similarProductList} = this.state

    return (
      <div className="similar-products-cont">
        <h1 className="similar-products-title">Similar Products</h1>
        <ul className="similar-products-lists-cont">
          {similarProductList.map(each => (
            <SimilarProductItem
              key={each.id}
              similarProductDetails={each}
              updateActiveProductId={this.updateActiveProductId}
            />
          ))}
        </ul>
      </div>
    )
  }

  onRenderLoader = () => (
    <div data-testid="loader" className="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  onRenderFailure = () => {
    const {errorMsg} = this.state

    return (
      <div className="product-failure-cont">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="failure view"
          className="product-failure-img"
        />
        <h1 className="error_msg">{errorMsg}</h1>
        <button
          type="button"
          className="continue-btn"
          onClick={this.onRedirectProduct}
        >
          Continue Shopping
        </button>
      </div>
    )
  }

  onRenderSuccess = () => (
    <div className="productItemDetails-main-cont">
      {this.onRenderSpecificProduct()}
      {this.onRenderSimilarProducts()}
    </div>
  )

  updateActiveProductId = id => {
    this.setState({activeProductId: id}, this.getSpecficProduct)
  }

  onRedirectProduct = () => {
    const {history} = this.props

    history.replace('/products')
  }

  displayProductItemDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.onRenderLoader()
      case apiStatusConstants.success:
        return this.onRenderSuccess()
      case apiStatusConstants.failure:
        return this.onRenderFailure()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="productItemDetails-cont">
          {this.displayProductItemDetails()}
        </div>
      </>
    )
  }
}
export default ProductItemDetails
