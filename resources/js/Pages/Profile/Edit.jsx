import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ auth, status }) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Profile" />

      <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
        <UpdateProfileInformationForm
          status={status}
          className="max-w-xl"
        />
      </div>

      <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
        <UpdatePasswordForm className="max-w-xl" />
      </div>
    </AuthenticatedLayout>
  );
}
