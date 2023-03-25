import { useState } from 'react';

export default function useForm({ initialState, onSubmit, validate }) {
    const [values, setValues] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setValues({ ...values, [name]: value });
    }

    const handleSubmit = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        const newErrors = validate ? validate(values) : {};
        if (Object.keys(newErrors).length === 0) {
            await onSubmit(values);
        }
        setErrors(newErrors);
        setIsLoading(false);
    }

    return {
        values,
        errors,
        isLoading,
        handleChange,
        handleSubmit
    };
}
