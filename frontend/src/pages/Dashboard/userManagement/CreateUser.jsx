"use client"

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import LoadingAnimation from '@/components/animation/LoadingAnimation';
import DataTable from '@/components/Table/DataTable';
import { getUsers } from '@/GlobalRedux/Thunks/userThunks';
import AddUser from '@/components/specific/user-management/add_user/AddUser';
import EditUser from '@/components/specific/user-management/edit_user/EditUser';

const CreateUser = () => {
  const dispatch = useDispatch();
  const { usersData, loading, error } = useSelector((state) => state.getUsers);
  const [addDialogOpen, setAddDialogOpen] = useState(false); 
  const [editDialogOpen , setEditDialogOpen] = useState(false);
  const [userId , setUserId] = useState("");

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const columns = [
    { header: 'Name', accessor: 'fullName' },
    { header: 'Email', accessor: 'email' },
    { header: 'Created By', accessor: 'createdBy' },
    { header: 'Updated By', accessor: 'updatedBy' },
    { header: 'Created At', accessor: 'createdAt' },
    { header: 'Updated At', accessor: 'updatedAt' },
  ];

  const data = usersData?.data?.usersWithRoles?.map(user => ({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    createdBy: user.createdBy || "N/A",
    updatedBy: user.updatedBy || "N/A",
    createdAt: new Date(user.createdAt).toLocaleString(),
    updatedAt: new Date(user.updatedAt).toLocaleString(),
  })) || [];

  const handleAdd = () => {
    setAddDialogOpen(true);
  };

  const handleClose = () => {
    setAddDialogOpen(false);
    setEditDialogOpen(false)
  };

  const handleEdit = (id) => {
    setEditDialogOpen(true);
    // console.log('Edit user:', id);
    setUserId(id);
  };

  const handleDelete = (id) => {
    console.log('Delete user:', id);
  };

  const handleCSV = () => {
    
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center w-full min-h-[400px] bg-white/50 rounded-lg">
          <LoadingAnimation />
          <p className="mt-4 text-sm text-muted-foreground">Loading users data...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="w-full p-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}
              <button 
                onClick={() => dispatch(getUsers())} 
                className="ml-2 text-sm underline hover:text-red-400"
              >
                Try again
              </button>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return (
      <DataTable
        columns={columns}
        data={data}
        pageSize={5}
        onAdd={handleAdd}
        onCSV = {handleCSV}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-5 pt-0 h-full">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Add new users</h1>
        <p className="text-sm text-muted-foreground">
          You can create users manually by filling out their details, 
          or upload a CSV file containing the full name and password of multiple users to quickly add them to the system.
        </p>
      </div>
      
      <div className="mt-6">
        {renderContent()}
      </div>
      <div>
        <AddUser
          isOpen={addDialogOpen} 
          onClose={handleClose}  
        />
        <EditUser
          isOpen={editDialogOpen}
          onClose={handleClose}
          userId={userId}
        />
        
      </div>
      
    </div>
  );
};

export default CreateUser;
