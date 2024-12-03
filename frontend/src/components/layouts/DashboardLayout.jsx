import React from 'react';
import { SidebarInset, SidebarProvider } from '../ui/sidebar';
import { AppSidebar } from '../sidebar/app-sidebar';

const DashboardLayout = ({ children }) => {
    return (
        <SidebarProvider >
            <AppSidebar className="" />
            <SidebarInset>
                <main className='min-h-screen '>{children}</main> 
            </SidebarInset>
        </SidebarProvider>
    );
};

export default DashboardLayout;
