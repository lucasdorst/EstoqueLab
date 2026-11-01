
import { useState } from "react";
import "./App.css";

import Home from "./pages/Home";
import Cadastros from "./pages/Cadastros";
import Relatorios from "./pages/Relatorios";
import Ajustes from "./pages/Ajustes";

function App() {
    // CONTROLE DA NAVEGAÇÃO

    const [paginaAtual, setPaginaAtual] = useState("home");
    const [unidades, setUnidades] = useState([]);
    const [fabricantes, setFabricantes] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [lotes, setLotes] = useState([]);
    const [movimentacoes, setMovimentacoes] = useState([]);
    const [historicoAjustes, setHistoricoAjustes] = useState([]);
    const [consumosPendentes, setConsumosPendentes] = useState([]);

    // GERENCIAMENTO DE UNIDADES

    function adicionarUnidade(nome) {
        const novaUnidade = {
            id: Date.now(),
            nome: nome
        };

        setUnidades((atuais) => [...atuais, novaUnidade]);
    }

    function editarUnidade(id, novoNome) {
        setUnidades((atuais) =>
            atuais.map((unidade) =>
                unidade.id === id
                    ? { ...unidade, nome: novoNome }
                    : unidade
            )
        );
    }

    function excluirUnidade(id) {
        setUnidades((atuais) =>
            atuais.filter((unidade) => unidade.id !== id)
        );
    }

    // GERENCIAMENTO DE FABRICANTES

    function adicionarFabricante(nome) {
        const novoFabricante = {
            id: Date.now(),
            nome: nome
        };

        setFabricantes((atuais) => [...atuais, novoFabricante]);
    }

    function editarFabricante(id, novoNome) {
        setFabricantes((atuais) =>
            atuais.map((fabricante) =>
                fabricante.id === id
                    ? { ...fabricante, nome: novoNome }
                    : fabricante
            )
        );
    }

    function excluirFabricante(id) {
        setFabricantes((atuais) =>
            atuais.filter((fabricante) => fabricante.id !== id)
        );
    }

    // CADASTRO DE PRODUTOS

    function adicionarProduto(dadosProduto) {
        const novoProduto = {
            id: Date.now(),
            ...dadosProduto
        };

        setProdutos((atuais) => [...atuais, novoProduto]);
    }

    // AJUSTE DE PRODUTO

    function ajustarProduto(dadosAjuste) {
        const produtoAtual = produtos.find(
            (produto) => produto.id === dadosAjuste.id
        );

        if (!produtoAtual) {
            alert("Produto não encontrado.");
            return false;
        }

        const nomeExiste = produtos.some(
            (produto) =>
                produto.id !== produtoAtual.id &&
                produto.nome.trim().toLowerCase() ===
                dadosAjuste.nome.trim().toLowerCase()
        );

        if (nomeExiste) {
            alert("Já existe outro produto cadastrado com esse nome.");
            return false;
        }

        const campos = [
            { chave: "nome", titulo: "Nome do produto" },
            { chave: "unidadeId", titulo: "Unidade de medida" },
            { chave: "estoqueMinimo", titulo: "Estoque mínimo" },
            { chave: "estoqueMaximo", titulo: "Estoque máximo" }
        ];

        const alteracoes = campos.filter(
            (campo) =>
                produtoAtual[campo.chave] !== dadosAjuste[campo.chave]
        );

        if (alteracoes.length === 0) {
            alert("Nenhuma alteração foi realizada.");
            return false;
        }

        setProdutos((atuais) =>
            atuais.map((produto) =>
                produto.id === produtoAtual.id
                    ? { ...produto, ...dadosAjuste }
                    : produto
            )
        );

        setHistoricoAjustes((atuais) => [
            ...atuais,
            ...alteracoes.map((campo) => ({
                id: Date.now() + Math.random(),
                tipo: "produto",
                data: new Date().toLocaleString("pt-BR"),
                produto: dadosAjuste.nome,
                lote: "",
                campo: campo.titulo,
                valorAnterior: produtoAtual[campo.chave],
                novoValor: dadosAjuste[campo.chave]
            }))
        ]);

        alert("Produto atualizado com sucesso!");

        return true;
    }

    // CADASTRO DE LOTES

    function adicionarLote(dadosLote) {
        const novoLote = {
            id: Date.now(),
            ...dadosLote
        };

        setLotes((atuais) => [...atuais, novoLote]);
    }

    // AJUSTE DE LOTE

    function ajustarLote(dadosAjuste) {
        const loteAtual = lotes.find(
            (lote) => lote.id === dadosAjuste.id
        );

        if (!loteAtual) {
            alert("Lote não encontrado.");
            return false;
        }

        const fabricanteNovo = fabricantes.find(
            (fabricante) =>
                fabricante.id === dadosAjuste.fabricanteId
        );

        if (!fabricanteNovo) {
            alert("Fabricante não encontrado.");
            return false;
        }

        const campos = [
            {
                chave: "fabricanteId",
                titulo: "Fabricante / Marca"
            },
            {
                chave: "validade",
                titulo: "Validade"
            }
        ];

        const alteracoes = campos.filter(
            (campo) =>
                loteAtual[campo.chave] !== dadosAjuste[campo.chave]
        );

        if (alteracoes.length === 0) {
            alert("Nenhuma alteração nos dados do lote foi realizada.");
            return false;
        }

        setLotes((atuais) =>
            atuais.map((lote) =>
                lote.id === loteAtual.id
                    ? {
                        ...lote,
                        fabricanteId: dadosAjuste.fabricanteId,
                        validade: dadosAjuste.validade
                    }
                    : lote
            )
        );

        const produto = produtos.find(
            (item) => item.id === loteAtual.produtoId
        );

        setHistoricoAjustes((atuais) => [
            ...atuais,
            ...alteracoes.map((campo) => {
                const valorAnterior =
                    campo.chave === "fabricanteId"
                        ? fabricantes.find(
                            (item) => item.id === loteAtual.fabricanteId
                        )?.nome || "Não identificado"
                        : loteAtual.validade;

                const novoValor =
                    campo.chave === "fabricanteId"
                        ? fabricanteNovo.nome
                        : dadosAjuste.validade;

                return {
                    id: Date.now() + Math.random(),
                    tipo: "lote",
                    data: new Date().toLocaleString("pt-BR"),
                    produto: produto?.nome || "Produto não encontrado",
                    lote: loteAtual.numeroLote,
                    campo: campo.titulo,
                    valorAnterior: valorAnterior,
                    novoValor: novoValor
                };
            })
        ]);

        alert("Dados do lote atualizados com sucesso!");

        return true;
    }

    // REGISTRO DE CONSUMO

    function registrarConsumo(dadosConsumo) {
        const lote = lotes.find(
            (item) => item.id === dadosConsumo.loteId
        );

        if (!lote) {
            alert("Lote não encontrado.");
            return;
        }

        const novoSaldo =
            lote.quantidadeAtual - dadosConsumo.quantidade;

        if (novoSaldo < 0) {
            alert("Saldo insuficiente para esse consumo.");
            return;
        }

        setLotes((atuais) =>
            atuais.map((item) =>
                item.id === dadosConsumo.loteId
                    ? { ...item, quantidadeAtual: novoSaldo }
                    : item
            )
        );

        const produto = produtos.find(
            (item) => item.id === dadosConsumo.produtoId
        );

        setMovimentacoes((atuais) => [
            ...atuais,
            {
                id: Date.now(),
                data: new Date().toISOString(),
                produto: produto?.nome || "Produto não encontrado",
                lote: lote.numeroLote,
                tipo: "Consumo",
                quantidade: dadosConsumo.quantidade,
                saldoFinal: novoSaldo
            }
        ]);
    }

    // AGUARDAR CONSUMO

    function aguardarConsumo(dadosConsumo) {
        const lote = lotes.find(
            (item) => item.id === dadosConsumo.loteId
        );

        if (!lote) {
            alert("Lote não encontrado.");
            return false;
        }

        const quantidade = Number(dadosConsumo.quantidade);

        if (
            !Number.isFinite(quantidade) ||
            quantidade <= 0 ||
            quantidade > lote.quantidadeAtual
        ) {
            alert("Quantidade inválida ou superior ao saldo disponível.");
            return false;
        }

        const produto = produtos.find(
            (item) => item.id === dadosConsumo.produtoId
        );

        const novoConsumoPendente = {
            id: Date.now(),
            produtoId: dadosConsumo.produtoId,
            produto: produto?.nome || "Produto não encontrado",
            loteId: lote.id,
            lote: lote.numeroLote,
            quantidade: quantidade,
            dataRegistro: new Date().toISOString()
        };

        setConsumosPendentes((atuais) => [
            ...atuais,
            novoConsumoPendente
        ]);

        return true;
    }

    // CONFIRMAR CONSUMO PENDENTE

    function confirmarConsumoPendente(dadosConfirmacao) {
        const consumo = consumosPendentes.find(
            (item) => item.id === dadosConfirmacao.id
        );

        if (!consumo) {
            alert("Consumo pendente não encontrado.");
            return false;
        }

        const lote = lotes.find(
            (item) => item.id === consumo.loteId
        );

        if (!lote) {
            alert("Lote não encontrado.");
            return false;
        }

        const dataHora = new Date(
            `${dadosConfirmacao.data}T${dadosConfirmacao.hora}:00`
        );

        if (
            !dadosConfirmacao.data ||
            !dadosConfirmacao.hora ||
            Number.isNaN(dataHora.getTime())
        ) {
            alert("Informe uma data e hora válidas.");
            return false;
        }

        if (dataHora > new Date()) {
            alert("A data e hora do consumo não podem ser futuras.");
            return false;
        }

        if (consumo.quantidade > lote.quantidadeAtual) {
            alert("O saldo atual do lote é insuficiente para confirmar esse consumo.");
            return false;
        }

        const novoSaldo =
            lote.quantidadeAtual - consumo.quantidade;

        const produto = produtos.find(
            (item) => item.id === consumo.produtoId
        );

        setLotes((atuais) =>
            atuais.map((item) =>
                item.id === lote.id
                    ? { ...item, quantidadeAtual: novoSaldo }
                    : item
            )
        );

        setMovimentacoes((atuais) => [
            ...atuais,
            {
                id: Date.now(),
                data: dataHora.toISOString(),
                produto: produto?.nome || "Produto não encontrado",
                lote: lote.numeroLote,
                tipo: "Consumo",
                quantidade: consumo.quantidade,
                saldoFinal: novoSaldo
            }
        ]);

        setConsumosPendentes((atuais) =>
            atuais.filter((item) => item.id !== consumo.id)
        );

        alert("Consumo confirmado e estoque atualizado!");

        return true;
    }

    // CORREÇÃO DE ESTOQUE

    function corrigirEstoque(dadosAjuste) {
        const lote = lotes.find(
            (item) => item.id === dadosAjuste.loteId
        );

        if (!lote) {
            alert("Lote não encontrado.");
            return false;
        }

        const novoSaldo = Number(dadosAjuste.novoSaldo);

        if (!Number.isFinite(novoSaldo) || novoSaldo < 0) {
            alert("Informe um saldo válido.");
            return false;
        }

        if (novoSaldo === lote.quantidadeAtual) {
            alert("O novo saldo é igual ao saldo atual. Nenhuma correção necessária.");
            return false;
        }

        const saldoAnterior = lote.quantidadeAtual;

        setLotes((atuais) =>
            atuais.map((item) =>
                item.id === lote.id
                    ? { ...item, quantidadeAtual: novoSaldo }
                    : item
            )
        );

        setHistoricoAjustes((atuais) => [
            ...atuais,
            {
                id: Date.now(),
                tipo: "estoque",
                data: new Date().toLocaleString("pt-BR"),
                produto: produtos.find(
                    (item) => item.id === lote.produtoId
                )?.nome || "Produto não encontrado",
                lote: lote.numeroLote,
                saldoAnterior: saldoAnterior,
                novoSaldo: novoSaldo,
            }
        ]);

        alert("Correção de estoque registrada com sucesso!");

        return true;
    }

    // EXIBIÇÃO DAS PÁGINAS

    return (
        <>
            {paginaAtual === "home" && (
                <Home
                    produtos={produtos}
                    lotes={lotes}
                    unidades={unidades}
                    movimentacoes={movimentacoes}
                    onRegistrarConsumo={registrarConsumo}
                    onAguardarConsumo={aguardarConsumo}
                    onNavegar={setPaginaAtual}
                />
            )}

            {paginaAtual === "cadastros" && (
                <Cadastros
                    unidades={unidades}
                    fabricantes={fabricantes}
                    produtos={produtos}
                    lotes={lotes}
                    adicionarUnidade={adicionarUnidade}
                    editarUnidade={editarUnidade}
                    excluirUnidade={excluirUnidade}
                    adicionarFabricante={adicionarFabricante}
                    editarFabricante={editarFabricante}
                    excluirFabricante={excluirFabricante}
                    adicionarProduto={adicionarProduto}
                    adicionarLote={adicionarLote}
                    onNavegar={setPaginaAtual}
                />
            )}

            {paginaAtual === "relatorios" && (
                <Relatorios
                    produtos={produtos}
                    lotes={lotes}
                    fabricantes={fabricantes}
                    unidades={unidades}
                    movimentacoes={movimentacoes}
                    historicoAjustes={historicoAjustes}
                    onNavegar={setPaginaAtual}
                />
            )}

            {paginaAtual === "ajustes" && (
                <Ajustes
                    produtos={produtos}
                    lotes={lotes}
                    fabricantes={fabricantes}
                    unidades={unidades}
                    consumosPendentes={consumosPendentes}
                    onConfirmarConsumoPendente={confirmarConsumoPendente}
                    onCorrigirEstoque={corrigirEstoque}
                    onAjustarProduto={ajustarProduto}
                    onAjustarLote={ajustarLote}
                    onNavegar={setPaginaAtual}
                />
            )}
        </>
    );
}

export default App;
