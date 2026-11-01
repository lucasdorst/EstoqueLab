
import "./Cabecalho.css";

function Cabecalho({ paginaAtiva, onNavegar }) {
    return (
        <header className="barra-navegacao">
            <h2>EstoqueLab</h2>

            <nav>
                <button
                    className={paginaAtiva === "home" ? "ativo" : ""}
                    onClick={() => onNavegar("home")}
                >
                    Home
                </button>

                <button
                    className={paginaAtiva === "cadastros" ? "ativo" : ""}
                    onClick={() => onNavegar("cadastros")}
                >
                    Cadastro
                </button>

                <button
                    className={paginaAtiva === "relatorios" ? "ativo" : ""}
                    onClick={() => onNavegar("relatorios")}
                >
                    Relatórios
                </button>

                <button
                    className={paginaAtiva === "ajustes" ? "ativo" : ""}
                    onClick={() => onNavegar("ajustes")}
                >
                    Ajuste
                </button>
            </nav>
        </header>
    );
}

export default Cabecalho;
