import { getSpecificUser, updateUserRequest } from '@/api/user';
import ReusableDialog from '@/components/layouts/DialogLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useZodForm } from '@/hooks/useZodForm';
import { registerSchema, userUpdateSchema } from '@/zod/zodValidationSchema';
import { ShuffleIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

function EditUser({ isOpen, onClose, userId }) {
  const {
    formData,
    errors,
    handleChange,
    setFormData,
    validateForm,
    resetForm,
  } = useZodForm(userUpdateSchema);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data when component mounts or `userId` changes
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getSpecificUser(userId); 
        setFormData({
          fullName: response.data.userData.fullName,
          email: response.data.userData.email,
          password: '', 
        });
      } catch (err) {
        setError('Failed to fetch user data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData(); 
    }
  }, [userId, setFormData]);

  const onConfirm = async (e) => {
    e.preventDefault();

    // Validate the form before submission
    const isValid = validateForm(formData);
    if (!isValid) {
      console.error('Validation errors:', errors);
      return;
    }

    // Create the payload dynamically
    const payload = {
      fullName: formData.fullName,
      email: formData.email,
    };

    // Only include the password if it has been updated
    if (formData.password.trim()) {
      payload.password = formData.password;
    }

    try {
      // Call API to update user details
      await updateUserRequest(payload);
      console.log('User updated successfully:', payload);
      onClose(); // Close the dialog after a successful update
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Failed to update user details');
    }
  };

  if (loading) {
    return <div>Loading user data...</div>; 
  }

  if (error) {
    return <div>Error: {error}</div>; 
  }

  return (
    <ReusableDialog
      isOpen={isOpen} 
      onOpenChange={onClose}
      title="Edit User"
      description="Edit an existing user."
      onConfirm={onConfirm}
      confirmLabel="Confirm Change"
    >
      <div>
        {/* Full Name */}
        <div className="grid w-full max-w-lg items-center gap-1.5 mb-5">
          <Label htmlFor="fullName">Edit Full Name</Label>
          <Input
            type="text"
            name="fullName"
            value={formData.fullName || ''}
            onChange={handleChange}
            placeholder="Enter Full Name"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
          )}
        </div>
        
        {/* Email */}
        <div className="grid w-full max-w-lg items-center gap-1.5 mb-5">
          <Label htmlFor="email">Edit Email</Label>
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

        {/* Password */}
        <div className="grid w-full max-w-lg gap-2">
          <Label htmlFor="password">Edit Password</Label>
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
              onClick={() => {
                const randomPassword = generateRandomPassword();
                setFormData((prevData) => ({ ...prevData, password: randomPassword }));
              }}
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
  );
}

export default EditUser;

// Utility function to generate random password
const generateRandomPassword = () => {
  return Math.random().toString(36).slice(-10); // Simple random password generator
};
