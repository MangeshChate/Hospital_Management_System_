"use client"
import { createUserRequest } from '@/api/user';
import ReusableDialog from '@/components/layouts/DialogLayout'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getUsers } from '@/GlobalRedux/Thunks/userThunks';
import { useZodForm } from '@/hooks/useZodForm';
import { registerSchema } from '@/zod/zodValidationSchema';
import { ShuffleIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';


const AddUser = ({ isOpen, onClose }) => {

    const userData = JSON.parse(sessionStorage.getItem('userInfo'));
    const dispatch = useDispatch();

    const {
        formData,
        errors,
        handleChange,
        validateForm,
        setFormData,
        resetForm,
    } = useZodForm(registerSchema);

    const onConfirm = async (e) => {
        e.preventDefault();
        
        if (validateForm(formData)) {
            console.log(formData);
            
            const newUserData = {
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password,
                createdBy: userData.fullName,
            };

            await createUserRequest(newUserData);
            dispatch(getUsers());
            
        }
    };



    const generateRandomPassword = () => {
        const randomPassword = Array.from({ length: 12 }, () => {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
            return characters.charAt(Math.floor(Math.random() * characters.length));
        }).join('');
        setFormData({ ...formData, password: randomPassword });
    };


    return (
        <ReusableDialog
            isOpen={isOpen} onOpenChange={onClose}
            title="Add New User"
            description="Define a new role and set its permissions."
            onConfirm={onConfirm}
            confirmLabel="Add User"
        >

            <div>
                <div className="grid w-full max-w-lg items-center gap-1.5 mb-5">
                    <Label htmlFor="email">Full Name</Label>
                    <Input
                        type="text"
                        name="fullName"
                        value={formData.fullName || ''}
                        onChange={handleChange}
                        placeholder="Enter Fullname"
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
                    )}
                </div>
                <div className="grid w-full max-w-lg items-center gap-1.5 mb-5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        type="email"
                        name="email"
                        value={formData.email || ''}
                        onChange={handleChange}
                        placeholder="Enter Email"
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                    )}
                </div>

                <div className="grid w-full max-w-lg gap-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="flex items-center gap-2">
                        <Input
                            type="text"
                            name="password"
                            value={formData.password || ''}
                            onChange={handleChange}
                            placeholder="Enter Password"
                            className="w-full"
                        />
                        <button
                            type="button"
                            onClick={() => generateRandomPassword()}
                            className="flex items-center gap-1 px-3 py-2 text-sm font-medium bg-blue-100 hover:bg-blue-200 rounded-md text-blue-600"
                        >
                            <ShuffleIcon className="w-4 h-4" />
                            Generate
                        </button>
                    </div>
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                        Use a strong password or generate a random one.
                    </p>
                </div>

            </div>
        </ReusableDialog>
    )
}

export default AddUser
