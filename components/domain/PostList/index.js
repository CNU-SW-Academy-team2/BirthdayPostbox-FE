import { usePostContext } from "../../../contexts/PostProvider"
import PostItem from "../PostItem"

export default function PostList({ initialPosts }) {
    const { posts } = usePostContext();

    return (
        <ul>
            {
                posts.map((post) => (
                    <PostItem key={post.id} post={post} />
                ))
            }
        </ul>
    )
}