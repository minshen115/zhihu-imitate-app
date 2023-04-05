import React from "react";
import "./NewsItem.less"
import {Image} from "antd-mobile"
import {Link} from "react-router-dom"

const NewsItem = function NewsItem(props){
    let {info} = props;
    if(!info) return null;

    let {id, title, hint, images, image } = info;
        if (!images) images = [image];
        if (!Array.isArray(images)) images = [''];

    return(
        

        <Link to = {{ pathname: `/detail/${id}`}}> 
            <div className="news-item-box">
            <div className="content">
                <h4 className="title">{title}</h4>
                <p className="author">{hint}</p>
            </div>
            <Image src={images[0]} lazy/>
        </div>
        </Link>
        
    )
}

export default NewsItem