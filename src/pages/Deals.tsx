import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { PlusCircle, Search, Edit, Trash2 } from 'lucide-react';
import { dealsApi } from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Pagination from '../components/Pagination';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { z } from 'zod';

interface Deal {
  id: string;
  name: string;
  type: string;
  status: string;
  value: string;
}

const dealSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.string().min(1, 'Type is required'),
  status: z.string().min(1, 'Status is required'),
  value: z.string().min(1, 'Value is required'),
});

const columnHelper = createColumnHelper<Deal>();

const Deals: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dealToDelete, setDealToDelete] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<z.ZodIssue[]>([]);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['deals', currentPage, searchTerm],
    queryFn: async () => {
      const response = await dealsApi.getDeals(currentPage, 10, searchTerm);
      return response.data;
    },
  });

  const deals = data?.deals || [];
  const totalPages = data?.totalPages || 1;

  const createMutation = useMutation({
    mutationFn: dealsApi.createDeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, deal }: { id: string; deal: any }) => dealsApi.updateDeal(id, deal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: dealsApi.deleteDeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    },
  });

  const columns = [
    columnHelper.accessor('name', {
      cell: info => info.getValue(),
      header: () => <span>Name</span>,
    }),
    columnHelper.accessor('type', {
      cell: info => info.getValue(),
      header: () => <span>Type</span>,
    }),
    columnHelper.accessor('status', {
      cell: info => info.getValue(),
      header: () => <span>Status</span>,
    }),
    columnHelper.accessor('value', {
      cell: info => info.getValue(),
      header: () => <span>Value</span>,
    }),
    columnHelper.display({
      id: 'actions',
      cell: (info) => (
        <div className="flex space-x-2">
          <button onClick={() => handleEdit(info.row.original)} className="text-blue-600 hover:text-blue-800">
            <Edit size={18} />
          </button>
          <button onClick={() => handleDeleteClick(info.row.original.id)} className="text-red-600 hover:text-red-800">
            <Trash2 size={18} />
          </button>
        </div>
      ),
      header: () => <span>Actions</span>,
    }),
  ];

  const table = useReactTable({
    data: deals,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleEdit = (deal: Deal) => {
    setEditingDeal(deal);
    setFormErrors([]);
  };

  const handleDeleteClick = (id: string) => {
    setDealToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (dealToDelete) {
      deleteMutation.mutate(dealToDelete);
    }
    setIsDeleteDialogOpen(false);
    setDealToDelete(null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const dealData = Object.fromEntries(formData.entries());

    const validationResult = dealSchema.safeParse(dealData);

    if (!validationResult.success) {
      setFormErrors(validationResult.error.issues);
      return;
    }

    if (editingDeal) {
      updateMutation.mutate({ id: editingDeal.id, deal: dealData });
    } else {
      createMutation.mutate(dealData);
    }

    setEditingDeal(null);
    setFormErrors([]);
    event.currentTarget.reset();
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage message={(error as Error).message} />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Deals</h1>
        <button
          onClick={() => setEditingDeal({})}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors duration-200"
        >
          <PlusCircle className="w-5 h-5" />
          <span>New Deal</span>
        </button>
      </div>
      <div className="mb-6 relative">
        <input
          type="text"
          placeholder="Search deals..."
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchTerm}
          onChange={handleSearch}
        />
        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
      </div>
      
      {editingDeal && (
        <form onSubmit={handleSubmit} className="mb-6 bg-white p-6 rounded-lg shadow">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={editingDeal.name}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              {formErrors.find(error => error.path[0] === 'name') && (
                <p className="mt-1 text-sm text-red-600">{formErrors.find(error => error.path[0] === 'name')?.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
              <input
                type="text"
                id="type"
                name="type"
                defaultValue={editingDeal.type}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              {formErrors.find(error => error.path[0] === 'type') && (
                <p className="mt-1 text-sm text-red-600">{formErrors.find(error => error.path[0] === 'type')?.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
              <input
                type="text"
                id="status"
                name="status"
                defaultValue={editingDeal.status}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              {formErrors.find(error => error.path[0] === 'status') && (
                <p className="mt-1 text-sm text-red-600">{formErrors.find(error => error.path[0] === 'status')?.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="value" className="block text-sm font-medium text-gray-700">Value</label>
              <input
                type="text"
                id="value"
                name="value"
                defaultValue={editingDeal.value}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              {formErrors.find(error => error.path[0] === 'value') && (
                <p className="mt-1 text-sm text-red-600">{formErrors.find(error => error.path[0] === 'value')?.message}</p>
              )}
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => {
                setEditingDeal(null);
                setFormErrors([]);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {editingDeal.id ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      )}

      {createMutation.isError && <ErrorMessage message={(createMutation.error as Error).message} />}
      {updateMutation.isError && <ErrorMessage message={(updateMutation.error as Error).message} />}
      {deleteMutation.isError && <ErrorMessage message={(deleteMutation.error as Error).message} />}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Deal"
        message="Are you sure you want to delete this deal? This action cannot be undone."
      />
    </div>
  );
};

export default Deals;