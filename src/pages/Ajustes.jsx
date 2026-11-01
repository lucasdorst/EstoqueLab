
import { useState } from "react";
import Cabecalho from "../components/Cabecalho";
import "./Ajustes.css";

function Ajustes({
    produtos,
    lotes,
    fabricantes,
    unidades,
    consumosPendentes,
    onConfirmarConsumoPendente,
    onCorrigirEstoque,
    onAjustarProduto,
    onAjustarLote,
    onNavegar
}) {
    // NAVEGAÇÃO INTERNA DOS AJUSTES

    const [funcaoAtual, setFuncaoAtual] = useState("");

    // ESTADOS DO CONTROLE DE ESTOQUE

    const [produtoSelecionado, setProdutoSelecionado] = useState("");
    const [loteSelecionado, setLoteSelecionado] = useState("");
    const [fabricanteLote, setFabricanteLote] = useState("");
    const [validadeLote, setValidadeLote] = useState("");
    const [novoSaldo, setNovoSaldo] = useState("");

    // ESTADOS DO AJUSTE DE PRODUTO

    const [produtoEditarSelecionado, setProdutoEditarSelecionado] = useState("");
    const [nomeProduto, setNomeProduto] = useState("");
    const [unidadeProduto, setUnidadeProduto] = useState("");
    const [estoqueMinimo, setEstoqueMinimo] = useState("");
    const [estoqueMaximo, setEstoqueMaximo] = useState("");

    // ESTADOS DOS CONSUMOS PENDENTES

    const [consumoSelecionado, setConsumoSelecionado] = useState("");
    const [dataConsumo, setDataConsumo] = useState("");
    const [horaConsumo, setHoraConsumo] = useState("");
    const [filtroProdutoPendente, setFiltroProdutoPendente] = useState("");
    const [filtroLotePendente, setFiltroLotePendente] = useState("");

    // FILTRAR LOTES DO PRODUTO SELECIONADO

    const lotesFiltrados = lotes.filter(
        (lote) => String(lote.produtoId) === produtoSelecionado
    );

    // LOCALIZAR LOTE SELECIONADO

    const loteEscolhido = lotes.find(
        (lote) => String(lote.id) === loteSelecionado
    );

    // LOCALIZAR CONSUMO PENDENTE

    const consumoEscolhido = consumosPendentes.find(
        (consumo) => String(consumo.id) === consumoSelecionado
    );

    // FILTRAR CONSUMOS PENDENTES

    const consumosPendentesFiltrados = consumosPendentes.filter((consumo) => {
        const produtoCorresponde = (consumo.produto || "")
            .toLowerCase()
            .includes(filtroProdutoPendente.toLowerCase().trim());

        const loteCorresponde = String(consumo.lote || "")
            .toLowerCase()
            .includes(filtroLotePendente.toLowerCase().trim());

        return produtoCorresponde && loteCorresponde;
    });

    // FORMATAR DATA PARA DD/MM/AAAA

    function formatarDataBrasileira(data) {
        if (!data) return "";

        const [ano, mes, dia] = data.split("-");

        if (!ano || !mes || !dia) return "";

        return `${dia}/${mes}/${ano}`;
    }

    // VALIDAR DATA

    function validarData(data) {
        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(data)) {
            return false;
        }

        const [dia, mes, ano] = data.split("/").map(Number);
        const dataValida = new Date(ano, mes - 1, dia);

        return (
            ano >= 1900 &&
            dataValida.getFullYear() === ano &&
            dataValida.getMonth() === mes - 1 &&
            dataValida.getDate() === dia
        );
    }

    // SELECIONAR LOTE PARA EDIÇÃO

    function selecionarLoteParaEditar(id) {
        setLoteSelecionado(id);

        const lote = lotes.find(
            (item) => String(item.id) === id
        );

        if (!lote) {
            setFabricanteLote("");
            setValidadeLote("");
            setNovoSaldo("");
            return;
        }

        setFabricanteLote(String(lote.fabricanteId));
        setValidadeLote(formatarDataBrasileira(lote.validade));
        setNovoSaldo(String(lote.quantidadeAtual));
    }

    // SELECIONAR PRODUTO PARA EDIÇÃO

    function selecionarProdutoParaEditar(id) {
        setProdutoEditarSelecionado(id);

        const produto = produtos.find(
            (item) => String(item.id) === id
        );

        if (!produto) {
            setNomeProduto("");
            setUnidadeProduto("");
            setEstoqueMinimo("");
            setEstoqueMaximo("");
            return;
        }

        setNomeProduto(produto.nome);
        setUnidadeProduto(String(produto.unidadeId));
        setEstoqueMinimo(String(produto.estoqueMinimo));
        setEstoqueMaximo(String(produto.estoqueMaximo));
    }

    // CONFIRMAR AJUSTE DO PRODUTO

    function confirmarAjusteProduto() {
        if (
            !produtoEditarSelecionado ||
            !nomeProduto.trim() ||
            !unidadeProduto ||
            estoqueMinimo === "" ||
            estoqueMaximo === ""
        ) {
            alert("Preencha todos os campos do produto.");
            return;
        }

        const minimo = Number(estoqueMinimo);
        const maximo = Number(estoqueMaximo);

        if (
            !Number.isFinite(minimo) ||
            !Number.isFinite(maximo) ||
            minimo < 0 ||
            maximo < 0
        ) {
            alert("Informe valores válidos para os estoques.");
            return;
        }

        if (maximo < minimo) {
            alert("O estoque máximo não pode ser menor que o mínimo.");
            return;
        }

        const sucesso = onAjustarProduto({
            id: Number(produtoEditarSelecionado),
            nome: nomeProduto.trim(),
            unidadeId: Number(unidadeProduto),
            estoqueMinimo: minimo,
            estoqueMaximo: maximo
        });

        if (!sucesso) return;

        setProdutoEditarSelecionado("");
        setNomeProduto("");
        setUnidadeProduto("");
        setEstoqueMinimo("");
        setEstoqueMaximo("");
    }

    // SALVAR ALTERAÇÕES DO CONTROLE DE ESTOQUE

    function salvarAlteracoesEstoque() {
        if (!loteEscolhido) {
            alert("Selecione um produto e um lote.");
            return;
        }

        if (!fabricanteLote) {
            alert("Selecione um fabricante.");
            return;
        }

        if (!validarData(validadeLote)) {
            alert("Informe uma data de validade válida no formato DD/MM/AAAA.");
            return;
        }

        if (novoSaldo === "") {
            alert("Informe o saldo do lote.");
            return;
        }

        const quantidade = Number(novoSaldo);

        if (!Number.isFinite(quantidade) || quantidade < 0) {
            alert("Informe um saldo válido.");
            return;
        }

        const saldoAlterado =
            quantidade !== Number(loteEscolhido.quantidadeAtual);

        const fabricanteAlterado =
            Number(fabricanteLote) !== Number(loteEscolhido.fabricanteId);

        const [dia, mes, ano] = validadeLote.split("/");
        const validadeFormatada = `${ano}-${mes}-${dia}`;

        const validadeAlterada =
            validadeFormatada !== loteEscolhido.validade;

        if (!saldoAlterado && !fabricanteAlterado && !validadeAlterada) {
            alert("Nenhuma alteração foi realizada.");
            return;
        }

        if (fabricanteAlterado || validadeAlterada) {
            const sucessoLote = onAjustarLote({
                id: Number(loteSelecionado),
                fabricanteId: Number(fabricanteLote),
                validade: validadeFormatada
            });

            if (!sucessoLote) return;
        }

        if (saldoAlterado) {
            const sucessoSaldo = onCorrigirEstoque({
                loteId: Number(loteSelecionado),
                novoSaldo: quantidade
            });

            if (!sucessoSaldo) return;
        }

        alert("Alterações do lote salvas com sucesso.");

        setProdutoSelecionado("");
        setLoteSelecionado("");
        setFabricanteLote("");
        setValidadeLote("");
        setNovoSaldo("");
    }

    // SELECIONAR CONSUMO PENDENTE

    function selecionarConsumo(id) {
        setConsumoSelecionado(String(id));
        setDataConsumo("");
        setHoraConsumo("");
    }

    // FORMATAR DATA DIGITADA NO PADRÃO DD/MM/AAAA

    function atualizarDataConsumo(valor) {
        const numeros = valor.replace(/\D/g, "").slice(0, 8);
        let data = numeros;

        if (numeros.length > 4) {
            data = `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4)}`;
        } else if (numeros.length > 2) {
            data = `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
        }

        setDataConsumo(data);
    }

    // FORMATAR HORA DIGITADA NO PADRÃO HH:MM

    function atualizarHoraConsumo(valor) {
        const numeros = valor.replace(/\D/g, "").slice(0, 4);
        let hora = numeros;

        if (numeros.length > 2) {
            hora = `${numeros.slice(0, 2)}:${numeros.slice(2)}`;
        }

        setHoraConsumo(hora);
    }

    // CONFIRMAR CONSUMO PENDENTE

    function confirmarConsumo() {
        if (!consumoEscolhido) {
            alert("Selecione um consumo.");
            return;
        }

        if (!validarData(dataConsumo)) {
            alert("Informe uma data válida no formato DD/MM/AAAA.");
            return;
        }

        if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(horaConsumo)) {
            alert("Informe uma hora válida no formato HH:MM.");
            return;
        }

        const [dia, mes, ano] = dataConsumo.split("/");
        const dataFormatada = `${ano}-${mes}-${dia}`;

        const dataHoraInformada = new Date(
            `${dataFormatada}T${horaConsumo}:00`
        );

        if (
            Number.isNaN(dataHoraInformada.getTime()) ||
            dataHoraInformada > new Date()
        ) {
            alert("A data e hora do consumo não podem ser futuras.");
            return;
        }

        const sucesso = onConfirmarConsumoPendente({
            id: consumoEscolhido.id,
            data: dataFormatada,
            hora: horaConsumo
        });

        if (!sucesso) return;

        setConsumoSelecionado("");
        setDataConsumo("");
        setHoraConsumo("");
    }

    // VOLTAR PARA OS QUADRADOS

    function voltarParaAjustes() {
        setFuncaoAtual("");
    }

    return (
        <div className="ajustes-container">
            <Cabecalho
                paginaAtiva="ajustes"
                onNavegar={onNavegar}
            />

            <main className="ajustes-conteudo">
                {!funcaoAtual && (
                    <div className="ajustes-opcoes">
                        <button
                            type="button"
                            className="ajuste-opcao"
                            onClick={() => setFuncaoAtual("produto")}
                        >
                            <h2>Ajustar produto</h2>
                            <p>Atualizar informações dos produtos cadastrados.</p>
                        </button>

                        <button
                            type="button"
                            className="ajuste-opcao"
                            onClick={() => setFuncaoAtual("estoque")}
                        >
                            <h2>Controle de estoque</h2>
                            <p>Corrigir dados dos lotes e atualizar saldos.</p>
                        </button>

                        <button
                            type="button"
                            className="ajuste-opcao"
                            onClick={() => setFuncaoAtual("pendentes")}
                        >
                            <h2>Consumos aguardando</h2>
                            <p>Consultar e confirmar consumos pendentes.</p>
                            <span>{consumosPendentes.length} aguardando</span>
                        </button>
                    </div>
                )}

                {funcaoAtual && (
                    <button
                        type="button"
                        className="botao-voltar-ajustes"
                        onClick={voltarParaAjustes}
                    >
                        ← Voltar aos ajustes
                    </button>
                )}

                {/* AJUSTE DE PRODUTO */}

                {funcaoAtual === "produto" && (
                    <section className="ajuste-card">
                        <div className="ajuste-card-titulo">
                            <h2>Ajustar produto</h2>
                            <p>
                                Selecione um produto para atualizar suas informações.
                            </p>
                        </div>

                        <div className="ajuste-formulario">
                            <div className="campo-ajuste">
                                <label>Produto</label>
                                <select
                                    value={produtoEditarSelecionado}
                                    onChange={(e) =>
                                        selecionarProdutoParaEditar(e.target.value)
                                    }
                                >
                                    <option value="">Selecione um produto</option>

                                    {produtos.map((produto) => (
                                        <option key={produto.id} value={produto.id}>
                                            {produto.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="campo-ajuste">
                                <label>Nome do produto</label>
                                <input
                                    type="text"
                                    value={nomeProduto}
                                    onChange={(e) => setNomeProduto(e.target.value)}
                                    placeholder="Nome do produto"
                                    disabled={!produtoEditarSelecionado}
                                />
                            </div>

                            <div className="campo-ajuste">
                                <label>Unidade de medida</label>
                                <select
                                    value={unidadeProduto}
                                    onChange={(e) => setUnidadeProduto(e.target.value)}
                                    disabled={!produtoEditarSelecionado}
                                >
                                    <option value="">Selecione a unidade</option>

                                    {unidades.map((unidade) => (
                                        <option key={unidade.id} value={unidade.id}>
                                            {unidade.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="campo-ajuste">
                                <label>Estoque mínimo</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={estoqueMinimo}
                                    onChange={(e) => setEstoqueMinimo(e.target.value)}
                                    placeholder="Estoque mínimo"
                                    disabled={!produtoEditarSelecionado}
                                />
                            </div>

                            <div className="campo-ajuste">
                                <label>Estoque máximo</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={estoqueMaximo}
                                    onChange={(e) => setEstoqueMaximo(e.target.value)}
                                    placeholder="Estoque máximo"
                                    disabled={!produtoEditarSelecionado}
                                />
                            </div>

                            <button
                                type="button"
                                className="botao-ajuste"
                                onClick={confirmarAjusteProduto}
                                disabled={!produtoEditarSelecionado}
                            >
                                Salvar alterações
                            </button>
                        </div>
                    </section>
                )}

                {/* CONTROLE DE ESTOQUE */}

                {funcaoAtual === "estoque" && (
                    <section className="ajuste-card">
                        <div className="ajuste-card-titulo">
                            <h2>Controle de estoque</h2>
                            <p>
                                Corrija os dados do lote ou atualize seu saldo.
                            </p>
                        </div>

                        <div className="ajuste-formulario">
                            <div className="campo-ajuste">
                                <label>Produto</label>
                                <select
                                    value={produtoSelecionado}
                                    onChange={(e) => {
                                        setProdutoSelecionado(e.target.value);
                                        setLoteSelecionado("");
                                        setFabricanteLote("");
                                        setValidadeLote("");
                                        setNovoSaldo("");
                                    }}
                                >
                                    <option value="">Selecione um produto</option>

                                    {produtos.map((produto) => (
                                        <option key={produto.id} value={produto.id}>
                                            {produto.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="campo-ajuste">
                                <label>Lote</label>
                                <select
                                    value={loteSelecionado}
                                    onChange={(e) =>
                                        selecionarLoteParaEditar(e.target.value)
                                    }
                                    disabled={!produtoSelecionado}
                                >
                                    <option value="">Selecione um lote</option>

                                    {lotesFiltrados.map((lote) => (
                                        <option key={lote.id} value={lote.id}>
                                            {lote.numeroLote}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="campo-ajuste">
                                <label>Fabricante</label>
                                <select
                                    value={fabricanteLote}
                                    onChange={(e) => setFabricanteLote(e.target.value)}
                                    disabled={!loteEscolhido}
                                >
                                    <option value="">Selecione o fabricante</option>

                                    {fabricantes.map((fabricante) => (
                                        <option key={fabricante.id} value={fabricante.id}>
                                            {fabricante.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="campo-ajuste">
                                <label>Validade</label>
                                <input
                                    type="text"
                                    value={validadeLote}
                                    onChange={(e) => {
                                        const numeros = e.target.value
                                            .replace(/\D/g, "")
                                            .slice(0, 8);

                                        let data = numeros;

                                        if (numeros.length > 4) {
                                            data = `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4)}`;
                                        } else if (numeros.length > 2) {
                                            data = `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
                                        }

                                        setValidadeLote(data);
                                    }}
                                    placeholder="DD/MM/AAAA"
                                    maxLength={10}
                                    inputMode="numeric"
                                    disabled={!loteEscolhido}
                                />
                            </div>

                            <div className="campo-ajuste">
                                <label>Saldo atual / Novo saldo</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={novoSaldo}
                                    onChange={(e) => setNovoSaldo(e.target.value)}
                                    placeholder="Informe o saldo correto"
                                    disabled={!loteEscolhido}
                                />
                            </div>

                            <button
                                type="button"
                                className="botao-ajuste"
                                onClick={salvarAlteracoesEstoque}
                                disabled={!loteEscolhido}
                            >
                                Salvar alterações
                            </button>
                        </div>
                    </section>
                )}

                {/* CONSUMOS AGUARDANDO */}

                {funcaoAtual === "pendentes" && (
                    <section className="ajuste-card">
                        <div className="ajuste-card-titulo">
                            <h2>Consumos aguardando</h2>
                            <p>
                                Selecione um consumo para informar quando ele aconteceu.
                            </p>
                        </div>

                        {consumosPendentes.length === 0 ? (
                            <p>Não existem consumos aguardando confirmação.</p>
                        ) : (
                            <>
                                {/* FILTROS */}


                                <div className="ajuste-formulario filtros-consumos-pendentes">
                                    <div className="campo-ajuste">
                                        <label>Filtrar por produto</label>
                                        <input
                                            type="text"
                                            value={filtroProdutoPendente}
                                            onChange={(e) =>
                                                setFiltroProdutoPendente(e.target.value)
                                            }
                                            placeholder="Digite o nome do produto"
                                        />
                                    </div>

                                    <div className="campo-ajuste">
                                        <label>Filtrar por lote</label>
                                        <input
                                            type="text"
                                            value={filtroLotePendente}
                                            onChange={(e) =>
                                                setFiltroLotePendente(e.target.value)
                                            }
                                            placeholder="Digite o número do lote"
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        className="botao-limpar-filtros"
                                        onClick={() => {
                                            setFiltroProdutoPendente("");
                                            setFiltroLotePendente("");
                                        }}
                                    >
                                        Limpar filtros
                                    </button>
                                </div>


                                {/* TABELA DE CONSUMOS */}

                                <div className="tabela-ajustes-container">
                                    <table className="tabela-ajustes">
                                        <thead>
                                            <tr>
                                                <th>Produto</th>
                                                <th>Lote</th>
                                                <th>Quantidade</th>
                                                <th>Ação</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {consumosPendentesFiltrados.length === 0 ? (
                                                <tr>
                                                    <td colSpan="4">
                                                        Nenhum consumo encontrado com esses filtros.
                                                    </td>
                                                </tr>
                                            ) : (
                                                consumosPendentesFiltrados.map((consumo) => (
                                                    <tr key={consumo.id}>
                                                        <td>{consumo.produto}</td>
                                                        <td>{consumo.lote}</td>
                                                        <td>{consumo.quantidade}</td>
                                                        <td>
                                                            <button
                                                                type="button"
                                                                className="botao-ajuste"
                                                                onClick={() =>
                                                                    selecionarConsumo(consumo.id)
                                                                }
                                                            >
                                                                Consumir
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}

                        {/* CONFIRMAÇÃO DO CONSUMO */}

                        {consumoEscolhido && (
                            <div className="confirmar-consumo-pendente">
                                <h3>Confirmar consumo</h3>

                                <p>
                                    Produto: <strong>{consumoEscolhido.produto}</strong>
                                </p>

                                <p>
                                    Lote: <strong>{consumoEscolhido.lote}</strong>
                                </p>

                                <p>
                                    Quantidade: <strong>{consumoEscolhido.quantidade}</strong>
                                </p>

                                <div className="ajuste-formulario">
                                    <div className="campo-ajuste">
                                        <label>Data do consumo</label>
                                        <input
                                            type="text"
                                            value={dataConsumo}
                                            onChange={(e) =>
                                                atualizarDataConsumo(e.target.value)
                                            }
                                            placeholder="DD/MM/AAAA"
                                            maxLength={10}
                                            inputMode="numeric"
                                        />
                                    </div>

                                    <div className="campo-ajuste">
                                        <label>Hora do consumo</label>
                                        <input
                                            type="text"
                                            value={horaConsumo}
                                            onChange={(e) =>
                                                atualizarHoraConsumo(e.target.value)
                                            }
                                            placeholder="HH:MM"
                                            maxLength={5}
                                            inputMode="numeric"
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        className="botao-ajuste"
                                        onClick={confirmarConsumo}
                                    >
                                        Confirmar consumo
                                    </button>

                                    <button
                                        type="button"
                                        className="botao-voltar-ajustes"
                                        onClick={() => {
                                            setConsumoSelecionado("");
                                            setDataConsumo("");
                                            setHoraConsumo("");
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        )}
                    </section>
                )}
            </main>
        </div>
    );
}

export default Ajustes;
