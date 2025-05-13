import {nanoid} from "nanoid";
import sequelize, {models} from '../config/database.js';


const {User, Blog} = models;

export const createBlog = async (req, res) => {
    let authorId = req.user;
    console.log(authorId);


    try {
        let {title, banner, description, content, tags, authorId, draft} = req.body;

        // Input data validation from frontend
        if (!title.length) {
            return res.status(403).json({error: "Please provide a blog title before publishing!"})
        }

        if (!description.length || description.length > 200) {
            return res.status(403).json({error: "Blog description is Mandatory!"});
        }

        if (!content.blocks.length) {
            return res.status(403).json({error: "Blog content is required before publishing!"});
        }

        if (!banner.length) {
            return res.status(403).json({error: "Please provider a banner!"});
        }

        if (!tags.length || tags.length > 5) {
            return res.status(403).json({error: "Please provide tags before publishing the blog!"});
        }

        // {tags} to LowerCase()
        tags = tags.map(tag => tag.toLowerCase());


        //Generate blog_id
        let blog_id = title.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, "-").trim() + nanoid();
        console.log(blog_id);

        // Create the Blog
        const blog = await Blog.create({
            title, banner, description, content, tags, userId: authorId, blog_id, draft: Boolean(draft),
        });

        // Increment total_posts if not draft
        let incrementVal = draft ? 0 : 1;
        await User.update(
            {
                account_details: sequelize.literal(
                    `jsonb_set(account_details, '{total_posts}', ((account_details#>>'{total_posts}')::int + ${incrementVal})::text::jsonb)`
                ),
            },
            {
                where: {id: authorId},
            }
        );
        return res.status(200).json({id: blog.id});
    } catch (err) {
        return res.status(500).json({error: err.message});
    }

}
