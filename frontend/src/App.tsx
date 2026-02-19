import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header, Footer } from "@/components";
import {
  HomePage,
  QuestionsPage,
  QuestionDetailPage,
  AdminPage,
} from "@/pages";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/questions" element={<QuestionsPage />} />
          <Route path="/questions/:id" element={<QuestionDetailPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
