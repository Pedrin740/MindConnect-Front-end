import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Integrantes from "./pages/Integrantes";
import Sobre from "./pages/Sobre";
import FAQ from "./pages/FAQ";
import Contato from "./pages/Contato";
import Servicos from "./pages/Servicos";
import Conteudos from "./pages/Conteudos";
import Diario from "./pages/Diario";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Páginas institucionais */}
        <Route path="/" element={<Home />} />
        <Route path="/integrantes" element={<Integrantes />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contato" element={<Contato />} />

        {/* Funcionalidades do Mind Connect */}
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/conteudos" element={<Conteudos />} />
        <Route path="/diario" element={<Diario />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;