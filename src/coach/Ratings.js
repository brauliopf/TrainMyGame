import React from 'react'

// https://css-tricks.com/five-methods-for-five-star-ratings/
export default function Ratings(props) {

  const getStars = (fill) => {
    let html = []
    for (let count = 0; count < 5; count++) {
      (count < fill) ?
        html.push(<span className="text-warning" key={count}>★</span>)
        : html.push(<span className="text-warning" key={count}>☆</span>)
    }
    return html
  }

  return (
    <div>
      <div id="rate">
        {getStars(props.rating ? props.rating.rate : 0)}
      </div>
      <span>({(props.rating && props.rating.qtyReviews) || 0} reviews)</span>
    </div>
  )
}
