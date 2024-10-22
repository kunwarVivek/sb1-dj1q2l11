import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const tenantSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Tenant name is required'),
  domain: z.string().min(1, 'Domain is required'),
  plan: z.enum(['basic', 'pro', 'enterprise']),
  maxUsers: z.number().min(1, 'Must have at least 1 user'),
  features: z.array(z.string()),
});

type TenantFormData = z.infer<typeof tenantSchema>;

// Mock API functions
const fetchTenants = async (): Promise<TenantFormData[]> => {
  // Simulated API call
  return [
    { id: '1', name: 'Acme Corp', domain: 'acme.com', plan: 'pro', maxUsers: 50, features: ['analytics', 'api_access'] },
    { id: '2', name: 'Globex', domain: 'globex.com', plan: 'enterprise', maxUsers: 100, features: ['analytics', 'api_access', 'custom_branding'] },
  ];
};

const createTenant = async (tenant: TenantFormData): Promise<TenantFormData> => {
  // Simulated API call
  console.log('Creating tenant:', tenant);
  return { ...tenant, id: Date.now().toString() };
};

const updateTenant = async (tenant: TenantFormData): Promise<TenantFormData> => {
  // Simulated API call
  console.log('Updating tenant:', tenant);
  return tenant;
};

const deleteTenant = async (id: string): Promise<void> => {
  // Simulated API call
  console.log('Deleting tenant:', id);
};

const TenantSettings: React.FC = () => {
  const [editingTenant, setEditingTenant] = useState<TenantFormData | null>(null);
  const queryClient = useQueryClient();

  const { data: tenants = [] } = useQuery({
    queryKey: ['tenants'],
    queryFn: fetchTenants,
  });

  const createMutation = useMutation({
    mutationFn: createTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TenantFormData>({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      name: '',
      domain: '',
      plan: 'basic',
      maxUsers: 1,
      features: [],
    },
  });

  const onSubmit = (data: TenantFormData) => {
    if (editingTenant) {
      updateMutation.mutate({ ...data, id: editingTenant.id });
    } else {
      createMutation.mutate(data);
    }
    reset();
    setEditingTenant(null);
  };

  const handleEdit = (tenant: TenantFormData) => {
    setEditingTenant(tenant);
    reset(tenant);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this tenant?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Tenant Settings</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Tenant Name
          </label>
          <input
            {...register('name')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Tenant Name"
          />
          {errors.name && <p className="text-red-500 text-xs italic">{errors.name.message}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="domain">
            Domain
          </label>
          <input
            {...register('domain')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="domain"
            type="text"
            placeholder="yourdomain.com"
          />
          {errors.domain && <p className="text-red-500 text-xs italic">{errors.domain.message}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="plan">
            Plan
          </label>
          <select
            {...register('plan')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="plan"
          >
            <option value="basic">Basic</option>
            <option value="pro">Pro</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="maxUsers">
            Max Users
          </label>
          <input
            {...register('maxUsers', { valueAsNumber: true })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="maxUsers"
            type="number"
            min="1"
          />
          {errors.maxUsers && <p className="text-red-500 text-xs italic">{errors.maxUsers.message}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Features</label>
          <div>
            <label className="inline-flex items-center">
              <input type="checkbox" {...register('features')} value="analytics" className="form-checkbox" />
              <span className="ml-2">Analytics</span>
            </label>
          </div>
          <div>
            <label className="inline-flex items-center">
              <input type="checkbox" {...register('features')} value="api_access" className="form-checkbox" />
              <span className="ml-2">API Access</span>
            </label>
          </div>
          <div>
            <label className="inline-flex items-center">
              <input type="checkbox" {...register('features')} value="custom_branding" className="form-checkbox" />
              <span className="ml-2">Custom Branding</span>
            </label>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            {editingTenant ? 'Update Tenant' : 'Create Tenant'}
          </button>
          {editingTenant && (
            <button
              className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={() => {
                setEditingTenant(null);
                reset();
              }}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <h2 className="text-2xl font-bold mt-8 mb-4">Existing Tenants</h2>
      <div className="bg-white shadow-md rounded overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Domain</th>
              <th className="py-3 px-6 text-left">Plan</th>
              <th className="py-3 px-6 text-left">Max Users</th>
              <th className="py-3 px-6 text-left">Features</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {tenants.map((tenant) => (
              <tr key={tenant.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{tenant.name}</td>
                <td className="py-3 px-6 text-left">{tenant.domain}</td>
                <td className="py-3 px-6 text-left">{tenant.plan}</td>
                <td className="py-3 px-6 text-left">{tenant.maxUsers}</td>
                <td className="py-3 px-6 text-left">{tenant.features.join(', ')}</td>
                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => handleEdit(tenant)}
                    className="text-blue-600 hover:text-blue-900 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(tenant.id!)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TenantSettings;