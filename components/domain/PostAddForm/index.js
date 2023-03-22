import { usePostContext } from "../../../contexts/PostProvider";
import { useForm } from "../../../hooks";
import Spinner from "../../base/Spinner";

export default function PostAddForm() {
    const { onAddPost } = usePostContext();
    const { isLoading, errors, handleChange, handleSubmit } = useForm({
        initialState: {
            userId: 1,
            title: '',
            body: ''
        },
        onSubmit: async (values) => {
            await onAddPost(values);
        },
        validate: ({ title, body }) => {
            const errors = {};
            if (!title) errors.title = '제목을 입력해주세요';
            if (!body) errors.body = '내용을 입력해주세요';
            return errors;
        }
        });

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <input type="text" name="title" placeholder="제목" onChange={handleChange} />
                {errors.title}
            </div>
            <div>
                <input type="text" name="body" placeholder="내용" onChange={handleChange} />
                {errors.body}
            </div>
            { isLoading ? <Spinner /> : <button type="submit">춪가</button> }
        </form>
    )
}