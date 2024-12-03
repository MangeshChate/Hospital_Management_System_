import { z } from "zod";

const loginSchema = z.object({
    email:z.string().email("Please enter a valid email"),
    password:z.string().min(6,"Password must be at least 6 characters")
})


const registerSchema = z.object({
    fullName:z.string().min(3,"Name must more than 3 alphabet"),
    email:z.string().email("Please enter a valid email"),
    password:z.string().min(6,"Password must be at least 6 characters")
})

const userUpdateSchema = z.object({
    email:z.string().email("Please enter a valid email"),
})

export {loginSchema ,registerSchema, userUpdateSchema}

