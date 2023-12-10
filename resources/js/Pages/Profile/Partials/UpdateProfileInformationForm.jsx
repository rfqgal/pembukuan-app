import { useForm, usePage } from '@inertiajs/react';
import { notification } from 'antd';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function UpdateProfileInformation({ className = '' }) {
  const { user } = usePage().props.auth;

  const {
    data, setData, patch, errors, processing,
  } = useForm({
    name: user.name,
    email: user.email,
  });

  const submit = (e) => {
    e.preventDefault();

    patch(route('profile.update'), {
      onSuccess: () => {
        notification.success({
          message: 'Sukses',
          description: 'Update data profil berhasil!',
          placement: 'bottomRight',
        });
      },
    });
  };

  return (
    <section className={className}>
      <header>
        <h2 className="text-lg font-medium text-gray-900">
          Update Profil
        </h2>

        <p className="mt-1 text-sm text-gray-600">
          Ubah informasi profil dan email akun Anda.
        </p>
      </header>

      <form onSubmit={submit} className="mt-6 space-y-6">
        <div>
          <InputLabel htmlFor="name" value="Nama" />

          <TextInput
            id="name"
            className="mt-1 block w-full"
            value={data.name}
            onChange={(e) => setData('name', e.target.value)}
            required
            isFocused
            autoComplete="name"
          />

          <InputError className="mt-2" message={errors.name} />
        </div>

        <div>
          <InputLabel htmlFor="email" value="Email" />

          <TextInput
            id="email"
            type="email"
            className="mt-1 block w-full"
            value={data.email}
            onChange={(e) => setData('email', e.target.value)}
            required
            autoComplete="username"
          />

          <InputError className="mt-2" message={errors.email} />
        </div>

        <div className="flex items-center gap-4">
          <PrimaryButton type="submit" disabled={processing}>Simpan</PrimaryButton>
        </div>
      </form>
    </section>
  );
}
