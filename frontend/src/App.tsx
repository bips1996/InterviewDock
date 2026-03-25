import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header, Footer } from "@/components";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  HomePage,
  QuestionsPage,
  QuestionDetailPage,
  AdminPage,
  LoginPage,
  UserManagementPage,
} from "@/pages";
import { useAuthStore } from "@/store/useAuthStore";

function App() {
  const loadFromStorage = useAuthStore((state) => state.loadFromStorage);

  // Load auth state from localStorage on app mount
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/questions" element={<QuestionsPage />} />
          <Route path="/questions/:id" element={<QuestionDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <UserManagementPage />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
