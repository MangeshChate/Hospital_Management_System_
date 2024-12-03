import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Register = () => {
    return (
        <div className="h-screen w-full flex bg-slate-100">
            <div className="flex-1 flex items-center justify-center p-5">
                <Image
                    src="/assets/images/abstract1.jpeg"
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
                        <CardTitle className="text-3xl font-bold text-slate-700">Create Your Account as Admin</CardTitle>
                    </CardHeader>
                    <CardContent className="p-10">
                        <form className="flex flex-col gap-5 w-full justify-center items-center">
                            <div className="grid w-full max-w-lg items-center gap-1.5 mb-5">
                                <Label htmlFor="email">Email</Label>
                                <Input type="email" id="email" placeholder="Enter Email" className="" />
                            </div>

                            <div className="grid w-full max-w-lg items-center gap-1.5 mb-5">
                                <Label htmlFor="password">Password</Label>
                                <Input type="password" id="password" placeholder="Enter Password" />
                            </div>

                            <div className="grid w-full max-w-lg items-center gap-1.5 mb-5">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input type="password" id="confirmPassword" placeholder="Confirm Password" />
                            </div>

                            <div className="grid w-full text-center max-w-lg items-center gap-1.5 ">
                                <span className='text-sm '>( You will be the default admin after registration )</span>
                            </div>

                            <Button size="lg" className="w-full max-w-lg hover:bg-primary bg-primary/90 shadow-xl">
                                <span className="text-lg">Register as Admin</span>
                            </Button>

                            <div className="mt-5 text-slate-700">
                                <span>Already have an account? 
                                    <Link href="/login" className="ms-2 text-blue-600 font-semibold cursor-pointer">Login here</Link>
                                </span>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Register;
