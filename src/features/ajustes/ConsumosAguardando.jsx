
import { useState } from "react";
import "./ConsumosAguardando.css";

function ConsumosAguardando({
    consumosPendentes,
    onConfirmarConsumoPendente
}) {
    const [consumoSelecionado, setConsumoSelecionado] = useState("");
    const [dataConsumo, setDataConsumo] = useState("");
    const [horaConsumo, setHoraConsumo] = useState("");
    const [filtroProdutoPendente, setFiltroProdutoPendente] = useState("");
    const [filtroLotePendente, setFiltroLotePendente] = useState("");

    // LOCALIZAR CONSUMO SELECIONADO

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

    // CANCELAR CONFIRMAÇÃO

    function cancelarConfirmacao() {
        setConsumoSelecionado("");
        setDataConsumo("");
        setHoraConsumo("");
    }

    // LIMPAR FILTROS

    function limparFiltros() {
        setFiltroProdutoPendente("");
        setFiltroLotePendente("");
    }

    return (
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
                            onClick={limparFiltros}
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
                            onClick={cancelarConfirmacao}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}

export default ConsumosAguardando;
