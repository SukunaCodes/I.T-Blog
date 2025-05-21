import {Link} from "react-router-dom";
import {getDay} from "../common/date.jsx";

const MinimalTrendingBlogPost = ({content, index, author}) => {

    let {title, blog_id: id, createdAt} = content;
    let {fullname, profile_img, username} = author;

    return (
        <Link to={`/blogpost/${id}`} className="flex gap-5 mb-8">
            <h1 className="blog-index">{index <10 ? "0" + (index + 1) : index}</h1>

            <div>
                <div className="flex gap-2 items-center mb-7">
                    <img src={profile_img} className="w-6 h-6 rounded-full" alt="user profile image"/>
                    <p className="line-clamp-1">{fullname} @{username}</p>
                    <p className="min-w-fit">{getDay(createdAt)}</p>
                </div>

                <h1 className="blog-title">{title}</h1>
            </div>
        </Link>
    )
}

export default MinimalTrendingBlogPost;