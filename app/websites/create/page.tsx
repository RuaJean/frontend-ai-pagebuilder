import ProtectedRoute from '@/components/layout/ProtectedRoute';
import WebsiteForm from '@/components/websites/WebsiteForm';

export default function WebsiteCreatePage() {
  return (
    <ProtectedRoute>
      <WebsiteForm />
    </ProtectedRoute>
  );
}
