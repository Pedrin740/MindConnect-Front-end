import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./components/MainLayout";

import Home from "./pages/Home";
import { Integrantes } from "./pages/Integrantes";
import Sobre from "./pages/Sobre";
import FAQ from "./pages/FAQ";
import Contato from "./pages/Contato";
import Servicos from "./pages/Servicos";
import ServicoDetalhe from "./pages/ServicoDetalhe";
import Conteudos from "./pages/Conteudos";
import Diario from "./pages/Diario";
import Cadastro from "./pages/Cadastro";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/integrantes" element={<Integrantes />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contato" element={<Contato />} />

          <Route path="/servicos" element={<Servicos />} />
          <Route path="/servicos/:id" element={<ServicoDetalhe />} />

          <Route path="/conteudos" element={<Conteudos />} />
          <Route path="/diario" element={<Diario />} />

          <Route path="/cadastro" element={<Cadastro />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;