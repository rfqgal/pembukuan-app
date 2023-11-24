import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ auth, mustVerifyEmail, status }) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Profile" />

      <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
        <UpdateProfileInformationForm
          mustVerifyEmail={mustVerifyEmail}
          status={status}
          className="max-w-xl"
        />
      </div>

      <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
        <UpdatePasswordForm className="max-w-xl" />
      </div>

      <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
        <DeleteUserForm className="max-w-xl" />
      </div>
    </AuthenticatedLayout>
  );
}
