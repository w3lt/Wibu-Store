import React from "react";

import "./Reviews.css";

import starSymbol from "../../../assets/star.png";
import halfStarSymbol from "../../../assets/half-star.png";
import fullStarSymbol from "../../../assets/full-star.png";

function Reviews({ avg_point, reviews, pointStars }) {
    return (
        <div className="reviews">
            <div className="reviews-resume">
                <div className="total-point">
                    <div className="avg-point">{avg_point}</div>
                    <div className="point-stars">
                        {pointStars.map((pointStar, index) => {
                            if (pointStar === 0) return <img key={index} src={starSymbol} alt="" />
                            else if (0.4 <= pointStar && pointStar <= 0.6) return <img key={index} src={halfStarSymbol} alt="" />
                            else return <img key={index} src={fullStarSymbol} alt="" />
                        })}
                    </div>
                    <div style={{marginLeft: "10px"}}>{reviews.length} reviews</div>
                </div>

                <div className="points-count">
                    {[5, 4, 3, 2, 1].map((pointSegment, index) => (
                        <div key={index} className="point-count">{pointSegment} <img src={fullStarSymbol} alt="" style={{width: "20px", height: "20px", margin: "0 10px 5px 5px"}} /> {reviews.filter(review => review.point === pointSegment).length}</div>
                    ))}
                </div>
            </div>

            <div className="reviews-content">
                {reviews.map(({reviewer, review, point}, index) => {
                    return (
                        <div key={index} className="review">
                            <div>{reviewer}</div>
                            {review}
                        </div>
                    )
                })}
            </div>
            
        </div>
    )
}

export default Reviews;