import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Trash, Search, ChevronLeft, ChevronRight, Plus, Table2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { toast } from 'react-toastify';

const DataTable = ({
    columns,
    data,
    
    onAdd,
    onCSV,
    onEdit,
    onDelete,
    additionalButtons = [],  // Add additionalButtons prop to pass any extra buttons
}) => {
    const [search, setSearch] = useState('');
    const [selectedRows, setSelectedRows] = useState(new Set());
    const [currentPage, setCurrentPage] = useState(1);

    const hasActions = onEdit || onDelete;

    const filteredData = data.filter((row) =>
        columns.some((column) =>
            String(row[column.accessor]).toLowerCase().includes(search.toLowerCase())
        )
    );

   const pageSize = 7

    const startIndex = (currentPage - 1) * pageSize;
    const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);



    const totalPages = Math.ceil(filteredData.length / pageSize);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleSelectRow = (id) => {
        setSelectedRows((prev) => {
            const updated = new Set(prev);
            updated.has(id) ? updated.delete(id) : updated.add(id);
            return updated;
        });
    };

    const handleSelectAll = () => {
        if (selectedRows.size === paginatedData.length) {
            setSelectedRows(new Set());
        } else {
            setSelectedRows(new Set(paginatedData.map((row) => row.id)));
        }
    };

    const handleDeleteSelected = () => {
        selectedRows.forEach((id) => {
            onDelete?.(id);
        });
        setSelectedRows(new Set());
        toast.success('Selected items deleted!');
    };

    return (
        <div className="w-full p-6 space-y-6 bg-white rounded-lg shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="relative w-full sm:w-64">
                    <Input
                        placeholder="Search..."
                        value={search}
                        onChange={handleSearchChange}
                        className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>

                {/* Render additional buttons if passed */}
                <div className="flex gap-2">
                    {additionalButtons.map((btn, index) => (
                        <Button
                            key={index}
                            className="flex gap-2"
                            onClick={btn.onClick}
                            variant={btn.variant || 'default'}
                        >
                            {btn.icon && <btn.icon />}
                            {btn.label}
                        </Button>
                    ))}

                    {/* Delete Selected button */}
                    {selectedRows.size > 0 && onDelete && (
                        <Button
                            className="flex gap-2 bg-red-300 hover:bg-red-500"
                            onClick={handleDeleteSelected}
                        >
                            <Trash size={18} />
                            <span>Delete Selected</span>
                        </Button>
                    )}

                    {/* Import CSV button */}
                    {onCSV && (
                        <Button className="flex gap-2 bg-green-500" onClick={onCSV}>
                            <Table2 />
                            <span>Import CSV</span>
                        </Button>
                    )}

                    {/* Add New button */}
                    {onAdd && (
                        <Button className="flex gap-2 bg-blue-400" onClick={onAdd}>
                            <Plus />
                            <span>Add New</span>
                        </Button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border border-gray-200 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead className="w-[50px] py-3 px-4">
                                <Checkbox
                                    checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                                    onCheckedChange={handleSelectAll}
                                    className="border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                            </TableHead>
                            {columns.map((column) => (
                                <TableHead
                                    key={String(column.accessor)}
                                    className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                >
                                    {column.header}
                                </TableHead>
                            ))}
                            {hasActions && (
                                <TableHead className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Actions
                                </TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.map((row) => (
                            <TableRow key={row.id} className="hover:bg-gray-50">
                                <TableCell className="py-4 px-4">
                                    <Checkbox
                                        checked={selectedRows.has(row.id)}
                                        onCheckedChange={() => handleSelectRow(row.id)}
                                        className="border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </TableCell>
                                {columns.map((column) => (
                                    <TableCell key={String(column.accessor)} className="py-4 px-4 font-medium text-gray-900">
                                        {row[column.accessor]}
                                    </TableCell>
                                ))}
                                {hasActions && (
                                    <TableCell className="py-4 px-4">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-36">
                                                {onEdit && (
                                                    <DropdownMenuItem className="flex items-center" onClick={() => onEdit(row.id)}>
                                                        <Edit className="mr-2 h-4 w-4" /> Edit
                                                    </DropdownMenuItem>
                                                )}
                                                {onDelete && (
                                                    <DropdownMenuItem className="flex items-center text-red-600" onClick={() => onDelete(row.id)}>
                                                        <Trash className="mr-2 h-4 w-4" /> Delete
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {filteredData.length > pageSize && (
                <div className="mt-4 flex items-center justify-between">
                    <div className="flex-1 text-sm text-gray-700">
                        Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                        <span className="font-medium">{Math.min(startIndex + pageSize, filteredData.length)}</span> of{' '}
                        <span className="font-medium">{filteredData.length}</span> results
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-white">
                            Page {currentPage} of {totalPages}
                        </span>
                        <Button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataTable;
