import Cabecalho from "../components/Cabecalho";
import RegistrarConsumo from "../features/home/RegistrarConsumo";
import AlertasEstoque from "../features/home/AlertasEstoque";
import "./Home.css";

function Home({
    produtos,
    lotes,
    unidades,
    onRegistrarConsumo,
    onAguardarConsumo,
    onNavegar
}) {
    return (
        <div className="home-container">
            <Cabecalho
                paginaAtiva="home"
                onNavegar={onNavegar}
            />

            <main className="home-conteudo">
                <RegistrarConsumo
                    produtos={produtos}
                    lotes={lotes}
                    unidades={unidades}
                    onRegistrarConsumo={onRegistrarConsumo}
                    onAguardarConsumo={onAguardarConsumo}
                />

                <AlertasEstoque
                    produtos={produtos}
                    lotes={lotes}
                />
            </main>
        </div>
    );
}

export default Home;
