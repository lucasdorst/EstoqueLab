import { useState } from "react";
import "./GerenciarUnidades.css";

function GerenciarUnidades({
    aberto,
    unidades,
    unidadesEmUso,
    onAdicionar,
    onEditar,
    onExcluir,
    onFechar
}) {
    const [novaUnidade, setNovaUnidade] = useState("");
    const [unidadeEditando, setUnidadeEditando] = useState(null);
    const [nomeEdicao, setNomeEdicao] = useState("");

    if (!aberto) {
        return null;
    }

    function adicionarUnidade() {
        const nome = novaUnidade.trim().toUpperCase();

        if (!nome) {
            alert("Digite o nome da unidade.");
            return;
        }

        const jaExiste = unidades.some(
            (unidade) => unidade.nome.toLowerCase() === nome.toLowerCase()
        );

        if (jaExiste) {
            alert("Essa unidade já está cadastrada.");
            return;
        }

        onAdicionar(nome);
        setNovaUnidade("");
    }

    function iniciarEdicao(unidade) {
        setUnidadeEditando(unidade.id);
        setNomeEdicao(unidade.nome);
    }

    function salvarEdicao() {
        const nome = nomeEdicao.trim().toUpperCase();

        if (!nome) {
            alert("Digite o nome da unidade.");
            return;
        }

        const jaExiste = unidades.some(
            (unidade) =>
                unidade.id !== unidadeEditando &&
                unidade.nome.toLowerCase() === nome.toLowerCase()
        );

        if (jaExiste) {
            alert("Já existe uma unidade com esse nome.");
            return;
        }

        onEditar(unidadeEditando, nome);

        setUnidadeEditando(null);
        setNomeEdicao("");
    }

    function excluirUnidade(unidade) {
        if (unidadesEmUso.includes(unidade.id)) {
            alert(
                "Não é possível excluir esta unidade porque ela está vinculada a um produto."
            );
            return;
        }

        const confirmar = window.confirm(
            `Deseja realmente excluir a unidade ${unidade.nome}?`
        );

        if (confirmar) {
            onExcluir(unidade.id);
        }
    }

    return (
        <div className="modal-fundo">
            <div className="modal-unidades">

                <div className="modal-cabecalho">
                    <h2>Gerenciar unidades de medida</h2>

                    <button
                        type="button"
                        className="botao-fechar"
                        onClick={onFechar}
                    >
                        ×
                    </button>
                </div>

                <div className="adicionar-unidade">
                    <input
                        type="text"
                        placeholder="Digite uma nova unidade"
                        value={novaUnidade}
                        onChange={(evento) =>
                            setNovaUnidade(evento.target.value)
                        }
                    />

                    <button
                        type="button"
                        onClick={adicionarUnidade}
                    >
                        Adicionar
                    </button>
                </div>

                <div className="lista-unidades">
                    {unidades.map((unidade) => (
                        <div className="item-unidade" key={unidade.id}>

                            {unidadeEditando === unidade.id ? (
                                <>
                                    <input
                                        type="text"
                                        value={nomeEdicao}
                                        onChange={(evento) =>
                                            setNomeEdicao(evento.target.value)
                                        }
                                    />

                                    <button
                                        type="button"
                                        onClick={salvarEdicao}
                                    >
                                        Salvar
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setUnidadeEditando(null);
                                            setNomeEdicao("");
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="unidade-info">
                                        <strong>{unidade.nome}</strong>

                                        {unidadesEmUso.includes(unidade.id) && (
                                            <span>Em uso</span>
                                        )}
                                    </div>

                                    <div className="acoes-unidade">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                iniciarEdicao(unidade)
                                            }
                                        >
                                            Editar
                                        </button>

                                        <button
                                            type="button"
                                            disabled={unidadesEmUso.includes(unidade.id)}
                                            onClick={() =>
                                                excluirUnidade(unidade)
                                            }
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </>
                            )}

                        </div>
                    ))}

                    {unidades.length === 0 && (
                        <p>Nenhuma unidade cadastrada.</p>
                    )}
                </div>

            </div>
        </div>
    );
}

export default GerenciarUnidades;
