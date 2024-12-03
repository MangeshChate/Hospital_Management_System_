const { createSlice } = require("@reduxjs/toolkit");

const { getUsers } = require("@/GlobalRedux/Thunks/userThunks");


const getUsersSlice = createSlice({
    name: 'getUsers',
    initialState:{
        usersData:[],
        loading:false,
        error:null
    },
    reducers:{
        getUserState : (state)=>{
            state.usersData = [],
            state.loading = false,
            state.error = null
        }
    },
    extraReducers:(builder)=>{
        builder
            .addCase(getUsers.pending , (state)=>{
                state.loading = true
            })
            .addCase(getUsers.fulfilled,(state , action)=>{
                state.loading = false
                state.usersData = action.payload,
                state.error = null
            })
            .addCase(getUsers.rejected,(state,action)=>{
                state.loading = false,
                state.error = action.error.message || "Failed to fetch users"
            })
    }
})

export const { getUserState } = getUsersSlice.actions; 
export default getUsersSlice.reducer;