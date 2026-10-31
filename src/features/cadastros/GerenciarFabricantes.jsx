import { useState } from "react";
import "./GerenciarFabricantes.css";

function GerenciarFabricantes({
    aberto,
    fabricantes,
    fabricantesEmUso,
    onAdicionar,
    onEditar,
    onExcluir,
    onFechar
}) {
    const [novoFabricante, setNovoFabricante] = useState("");
    const [fabricanteEditando, setFabricanteEditando] = useState(null);
    const [nomeEdicao, setNomeEdicao] = useState("");

    if (!aberto) {
        return null;
    }

    function adicionarFabricante() {
        const nome = novoFabricante.trim();

        if (!nome) {
            alert("Digite o nome do fabricante.");
            return;
        }

        const jaExiste = fabricantes.some(
            (fabricante) =>
                fabricante.nome.toLowerCase() === nome.toLowerCase()
        );

        if (jaExiste) {
            alert("Esse fabricante já está cadastrado.");
            return;
        }

        onAdicionar(nome);
        setNovoFabricante("");
    }

    function iniciarEdicao(fabricante) {
        setFabricanteEditando(fabricante.id);
        setNomeEdicao(fabricante.nome);
    }

    function salvarEdicao() {
        const nome = nomeEdicao.trim();

        if (!nome) {
            alert("Digite o nome do fabricante.");
            return;
        }

        const jaExiste = fabricantes.some(
            (fabricante) =>
                fabricante.id !== fabricanteEditando &&
                fabricante.nome.toLowerCase() === nome.toLowerCase()
        );

        if (jaExiste) {
            alert("Já existe um fabricante com esse nome.");
            return;
        }

        onEditar(fabricanteEditando, nome);

        setFabricanteEditando(null);
        setNomeEdicao("");
    }

    function excluirFabricante(fabricante) {
        if (fabricantesEmUso.includes(fabricante.id)) {
            alert(
                "Não é possível excluir este fabricante porque ele está vinculado a um lote."
            );
            return;
        }

        const confirmar = window.confirm(
            `Deseja realmente excluir o fabricante ${fabricante.nome}?`
        );

        if (confirmar) {
            onExcluir(fabricante.id);
        }
    }

    return (
        <div className="modal-fundo">
            <div className="modal-fabricantes">

                <div className="modal-cabecalho">
                    <h2>Gerenciar fabricantes</h2>

                    <button
                        type="button"
                        className="botao-fechar"
                        onClick={onFechar}
                    >
                        ×
                    </button>
                </div>

                <div className="adicionar-fabricante">
                    <input
                        type="text"
                        placeholder="Digite o nome do fabricante"
                        value={novoFabricante}
                        onChange={(evento) =>
                            setNovoFabricante(evento.target.value)
                        }
                    />

                    <button
                        type="button"
                        onClick={adicionarFabricante}
                    >
                        Adicionar
                    </button>
                </div>

                <div className="lista-fabricantes">
                    {fabricantes.map((fabricante) => (
                        <div
                            className="item-fabricante"
                            key={fabricante.id}
                        >
                            {fabricanteEditando === fabricante.id ? (
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
                                            setFabricanteEditando(null);
                                            setNomeEdicao("");
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="fabricante-info">
                                        <strong>{fabricante.nome}</strong>

                                        {fabricantesEmUso.includes(fabricante.id) && (
                                            <span>Em uso</span>
                                        )}
                                    </div>

                                    <div className="acoes-fabricante">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                iniciarEdicao(fabricante)
                                            }
                                        >
                                            Editar
                                        </button>

                                        <button
                                            type="button"
                                            disabled={fabricantesEmUso.includes(fabricante.id)}
                                            onClick={() =>
                                                excluirFabricante(fabricante)
                                            }
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}

                    {fabricantes.length === 0 && (
                        <p>Nenhum fabricante cadastrado.</p>
                    )}
                </div>

            </div>
        </div>
    );
}

export default GerenciarFabricantes;