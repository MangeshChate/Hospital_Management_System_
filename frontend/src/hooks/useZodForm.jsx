import { useState } from 'react';

export const useZodForm = (schema) => {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = (data) => {
        const validation = schema.safeParse(data);

        if (!validation.success) {
            const formattedErrors = {};
            validation.error.issues.forEach((issue) => {
                formattedErrors[issue.path[0]] = issue.message;
            });
            setErrors(formattedErrors);
            return false;
        }

        setErrors({});
        return true;
    };

    const resetForm = () => {
        setFormData({});
        setErrors({});
    };

    return {
        formData,
        errors,
        handleChange,
        setFormData,
        validateForm,
        resetForm,
        setFormData,
    };
};
