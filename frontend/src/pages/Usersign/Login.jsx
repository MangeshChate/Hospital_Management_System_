import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { login, verifyAuth } from '@/GlobalRedux/Thunks/userThunks';
import { toast } from '@/hooks/use-toast';
import { useZodForm } from '@/hooks/useZodForm';
import { loginSchema } from '@/zod/zodValidationSchema';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Login = () => {
    const dispatch = useDispatch();
    const { userInfo, isLoggedIn, status, error } = useSelector((state) => state.user);

    const {
        formData,
        errors,
        handleChange,
        validateForm,
        resetForm,
    } = useZodForm(loginSchema);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm(formData)) {
            dispatch(login(formData));
        }
    };

    // Store userInfo in session storage when logged in
    useEffect(() => {
        if (isLoggedIn && userInfo) {
            sessionStorage.setItem('userInfo', JSON.stringify(userInfo.data.user));
            toast({
                title: "Login Successful",
                description: "Welcome back! ",
                variant: "success",
            });
        }
    }, [isLoggedIn, userInfo]);

    // Display error message when login fails
    useEffect(() => {
        if (error) {
            toast({
                title: error,
                variant: "destructive"
            });
        }
    }, [error]);

    // Verify authentication status on mount
    useEffect(() => {
        dispatch(verifyAuth());
    }, [dispatch]);

    return (
        <div className="h-screen w-full flex bg-slate-100">
            <div className="flex-1 flex items-center justify-center p-5">
                <Image
                    src="/assets/images/abstract3.jpg"
                    alt="abstract image"
                    className="w-full h-full rounded-3xl shadow-xl"
                    layout="responsive"
                    width={1920}
                    height={1080}
                    quality={100}
                />
            </div>
            <div className="flex-1 flex items-center justify-center p-5">
                <Card className="max-w-[40rem] w-full shadow-lg p-5 rounded-2xl">
                    <CardHeader className="w-full text-center">
                        <CardTitle className="text-3xl font-bold text-slate-700">Sign In To Your Account</CardTitle>
                    </CardHeader>
                    <CardContent className="p-10">
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-5 w-full justify-center items-center"
                        >
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

                            <div className="grid w-full max-w-lg items-center gap-1.5 mb-5">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    type="password"
                                    name="password"
                                    value={formData.password || ''}
                                    onChange={handleChange}
                                    placeholder="Enter Password"
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                                )}
                            </div>

                            <div className="flex justify-between mt-5 w-full">
                                <div className="flex flex-1 gap-3 max-w-lg w-full items-center">
                                    <Input type="checkbox" className="w-4 h-4" />
                                    <span>Remember me</span>
                                </div>
                                <div className="flex flex-1 gap-3 max-w-lg w-full items-center justify-end">
                                    <span className="cursor-pointer text-blue-600 font-semibold">
                                        Forgot your password?
                                    </span>
                                </div>
                            </div>
                            <Button size="lg"
                                type="submit" className="w-full max-w-lg hover:bg-primary bg-primary/90 shadow-xl">
                                <span className="text-lg">Sign In</span>
                            </Button>

                            <div className="mt-5 text-slate-700">
                                <span>
                                    Don't have an account?
                                    <Link href="/register" className="ms-2 text-blue-600 font-semibold cursor-pointer">
                                        Register here
                                    </Link>
                                </span>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Login;
