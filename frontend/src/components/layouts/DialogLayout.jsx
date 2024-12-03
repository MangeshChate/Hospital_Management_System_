import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ReusableDialog = ({ 
  isOpen,
  
  onOpenChange, 
  title, 
  description, 
  children, 
  onConfirm, 
  confirmLabel = "Confirm", 
  cancelLabel = "Cancel" 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto p-6 bg-white shadow-lg rounded-lg">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-semibold text-gray-800">{title}</DialogTitle>
          <DialogDescription className="text-gray-600">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {children}
        </div>
        <DialogFooter className="mt-6 flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="text-gray-600 border-gray-300 hover:bg-gray-100">
            {cancelLabel}
          </Button>
          <Button type="button" onClick={onConfirm} className="bg-blue-600 hover:bg-blue-700 text-white">
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReusableDialog;
