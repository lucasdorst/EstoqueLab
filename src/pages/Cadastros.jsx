
import { useState } from "react";
import Cabecalho from "../components/Cabecalho";

import GerenciarUnidades from "../features/cadastros/GerenciarUnidades";
import CadastrarProduto from "../features/cadastros/CadastrarProduto";
import CadastrarLote from "../features/cadastros/CadastrarLote";
import GerenciarFabricantes from "../features/cadastros/GerenciarFabricantes";

import "./Cadastros.css";

function Cadastros({
    unidades,
    fabricantes,
    produtos,
    lotes,
    adicionarUnidade,
    editarUnidade,
    excluirUnidade,
    adicionarFabricante,
    editarFabricante,
    excluirFabricante,
    adicionarProduto,
    adicionarLote,
    onNavegar
}) {
    const [unidadeSelecionada, setUnidadeSelecionada] = useState("");
    const [modalAberto, setModalAberto] = useState(false);

    const [produtoSelecionado, setProdutoSelecionado] = useState("");
    const [fabricanteSelecionado, setFabricanteSelecionado] = useState("");

    const [modalFabricantesAberto, setModalFabricantesAberto] = useState(false);

    const fabricantesEmUso = lotes.map(
        (lote) => lote.fabricanteId
    );

    const unidadesEmUso = produtos.map(
        (produto) => produto.unidadeId
    );

    return (
        <div className="cadastros-container">

            <Cabecalho
                paginaAtiva="cadastros"
                onNavegar={onNavegar}
            />

            <main className="cadastros-conteudo">

                <CadastrarProduto
                    unidades={unidades}
                    unidadeSelecionada={unidadeSelecionada}
                    setUnidadeSelecionada={setUnidadeSelecionada}
                    onAbrirGerenciarUnidades={() => setModalAberto(true)}
                    onCadastrarProduto={adicionarProduto}
                    produtos={produtos}
                />

                <CadastrarLote
                    produtos={produtos}
                    produtoSelecionado={produtoSelecionado}
                    setProdutoSelecionado={setProdutoSelecionado}
                    fabricantes={fabricantes}
                    fabricanteSelecionado={fabricanteSelecionado}
                    setFabricanteSelecionado={setFabricanteSelecionado}
                    lotes={lotes}
                    onAbrirGerenciarFabricantes={() =>
                        setModalFabricantesAberto(true)
                    }
                    onCadastrarLote={adicionarLote}
                />

            </main>

            <GerenciarFabricantes
                aberto={modalFabricantesAberto}
                fabricantes={fabricantes}
                fabricantesEmUso={fabricantesEmUso}
                onAdicionar={adicionarFabricante}
                onEditar={editarFabricante}
                onExcluir={excluirFabricante}
                onFechar={() => setModalFabricantesAberto(false)}
            />

            <GerenciarUnidades
                aberto={modalAberto}
                unidades={unidades}
                unidadesEmUso={unidadesEmUso}
                onAdicionar={adicionarUnidade}
                onEditar={editarUnidade}
                onExcluir={excluirUnidade}
                onFechar={() => setModalAberto(false)}
            />

        </div>
    );
}

export default Cadastros;
