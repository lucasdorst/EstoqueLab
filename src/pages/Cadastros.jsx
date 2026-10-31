import { useState } from "react";
import Cabecalho from "../components/Cabecalho";
import GerenciarUnidades from "../features/cadastros/GerenciarUnidades";
import CadastrarProduto from "../features/cadastros/CadastrarProduto";
import CadastrarLote from "../features/cadastros/CadastrarLote";
import GerenciarFabricantes from "../features/cadastros/GerenciarFabricantes";
import "./Cadastros.css";



function Cadastros() {
    const [unidades, setUnidades] = useState([
        { id: 1, nome: "UN" },
        { id: 2, nome: "mL" },
        { id: 3, nome: "L" },
        { id: 4, nome: "g" },
        { id: 5, nome: "kg" },
        { id: 6, nome: "CAIXA" }
    ]);

    const [unidadeSelecionada, setUnidadeSelecionada] = useState("");
    const [modalAberto, setModalAberto] = useState(false);
    const [produtoSelecionado, setProdutoSelecionado] = useState("");
    const [fabricanteSelecionado, setFabricanteSelecionado] = useState("");
    const [modalFabricantesAberto, setModalFabricantesAberto] = useState(false);
    const [fabricantes, setFabricantes] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [lotes, setLotes] = useState([]);

    const fabricantesEmUso = lotes.map(
        (lote) => lote.fabricanteId
    );

    const unidadesEmUso = produtos.map(
        (produto) => produto.unidadeId
    );

    function adicionarUnidade(nome) {
        const novaUnidade = {
            id: Date.now(),
            nome: nome
        };

        setUnidades((unidadesAtuais) => [
            ...unidadesAtuais,
            novaUnidade
        ]);
    }

    function editarUnidade(id, novoNome) {
        setUnidades((unidadesAtuais) =>
            unidadesAtuais.map((unidade) =>
                unidade.id === id
                    ? { ...unidade, nome: novoNome }
                    : unidade
            )
        );
    }

    function adicionarProduto(dadosProduto) {
        const novoProduto = {
            id: Date.now(),
            ...dadosProduto
        };

        setProdutos((produtosAtuais) => [
            ...produtosAtuais,
            novoProduto
        ]);
    }

    function adicionarLote(dadosLote) {
        const novoLote = {
            id: Date.now(),
            ...dadosLote
        };

        setLotes((lotesAtuais) => [
            ...lotesAtuais,
            novoLote
        ]);
    }

    function excluirUnidade(id) {
        setUnidades((unidadesAtuais) =>
            unidadesAtuais.filter((unidade) => unidade.id !== id)
        );

        if (unidadeSelecionada === id) {
            setUnidadeSelecionada("");
        }
    }

    function adicionarFabricante(nome) {
        const novoFabricante = {
            id: Date.now(),
            nome: nome
        };

        setFabricantes((fabricantesAtuais) => [
            ...fabricantesAtuais,
            novoFabricante
        ]);
    }

    function editarFabricante(id, novoNome) {
        setFabricantes((fabricantesAtuais) =>
            fabricantesAtuais.map((fabricante) =>
                fabricante.id === id
                    ? { ...fabricante, nome: novoNome }
                    : fabricante
            )
        );
    }

    function excluirFabricante(id) {
        setFabricantes((fabricantesAtuais) =>
            fabricantesAtuais.filter(
                (fabricante) => fabricante.id !== id
            )
        );

        setFabricanteSelecionado("");
    }

    return (
        <div className="cadastros-container">
            <Cabecalho paginaAtiva="cadastros" />

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
