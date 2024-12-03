import api from "@/utils/api";


//user-management
export const createUserRequest = async (userData) => {
    try {
        const res = await api.post('/users/register', userData, {
            headers: { 'Content-Type': 'application/json' },
        });

        console.log(res.data);
        return res.data;
    } catch (error) {
        console.log("Error in createUserRequest:", error.message);
        throw error; // Rethrow the error if needed
    }
};

export const updateUserRequest = async(userData )=>{
    try{
        const res = await api.post(`/users/update-user` ,userData,{
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        });
        console.log(res.data);
        return res.data

    }catch(error){
        console.log("Error in update user request",error.message);
        throw error;
    }
}

export const getSpecificUser = async(userId)=>{
    try {
        
        const res = await api.get(`/users/${userId}/get-specific-user` ,{
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        });
        return res.data
    } catch (error) {
        console.log("Error in fetching user request",error.message)
        throw error;
    }
}