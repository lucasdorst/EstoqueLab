import "./Cabecalho.css";

function Cabecalho({paginaAtiva}) {
  return (
      <header className="barra-navegacao">
        <h2>EstoqueLab</h2>

        <nav>
            <button className={paginaAtiva === 'home' ? 'ativo' : ''}>Home</button>
            <button className={paginaAtiva === 'cadastro' ? 'ativo' : ''}>Cadastro</button>
            <button className={paginaAtiva === 'relatorios' ? 'ativo' : ''}>Relatórios</button>
            <button className={paginaAtiva === 'ajuste' ? 'ativo' : ''}>Ajuste</button>
        </nav>
      </header>
  );
}

export default Cabecalho;