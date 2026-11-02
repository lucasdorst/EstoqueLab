import { useState } from "react";
import Cabecalho from "../components/Cabecalho";
import AjustarProduto from "../features/ajustes/AjustarProduto";
import ControleEstoque from "../features/ajustes/ControleEstoque";
import ConsumosAguardando from "../features/ajustes/ConsumosAguardando";
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
    const [funcaoAtual, setFuncaoAtual] = useState("");

    return (
        <div className="ajustes-container">

            <Cabecalho
                paginaAtiva="ajustes"
                onNavegar={onNavegar}
            />

            <main className="ajustes-conteudo">

                {/* OPÇÕES INICIAIS */}

                {!funcaoAtual && (
                    <div className="ajustes-opcoes">

                        <button
                            type="button"
                            className="ajuste-opcao"
                            onClick={() => setFuncaoAtual("produto")}
                        >
                            <h2>Ajustar produto</h2>
                            <p>Alterar informações dos produtos cadastrados.</p>
                        </button>

                        <button
                            type="button"
                            className="ajuste-opcao"
                            onClick={() => setFuncaoAtual("estoque")}
                        >
                            <h2>Controle de estoque</h2>
                            <p>Corrigir saldo, fabricante e validade dos lotes.</p>
                        </button>

                        <button
                            type="button"
                            className="ajuste-opcao"
                            onClick={() => setFuncaoAtual("pendentes")}
                        >
                            <h2>Consumos aguardando</h2>
                            <p>
                                {consumosPendentes.length} aguardando
                            </p>
                        </button>

                    </div>
                )}

                {/* BOTÃO VOLTAR */}

                {funcaoAtual && (
                    <button
                        type="button"
                        className="botao-voltar-ajustes"
                        onClick={() => setFuncaoAtual("")}
                    >
                        ← Voltar
                    </button>
                )}

                {/* COMPONENTE: AJUSTAR PRODUTO */}

                {funcaoAtual === "produto" && (
                    <AjustarProduto
                        produtos={produtos}
                        unidades={unidades}
                        onAjustarProduto={onAjustarProduto}
                    />
                )}

                {/* COMPONENTE: CONTROLE DE ESTOQUE */}

                {funcaoAtual === "estoque" && (
                    <ControleEstoque
                        produtos={produtos}
                        lotes={lotes}
                        fabricantes={fabricantes}
                        onCorrigirEstoque={onCorrigirEstoque}
                        onAjustarLote={onAjustarLote}
                    />
                )}

                {/* COMPONENTE: CONSUMOS AGUARDANDO */}

                {funcaoAtual === "pendentes" && (
                    <ConsumosAguardando
                        consumosPendentes={consumosPendentes}
                        onConfirmarConsumoPendente={onConfirmarConsumoPendente}
                    />
                )}

            </main>
        </div>
    );
}

export default Ajustes;
