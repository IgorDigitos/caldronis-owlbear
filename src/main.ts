import OBR from "@owlbear-rodeo/sdk";
import "./style.css";

// Etapa 0: confirmar que a extensão abre no celular, que dados salvos na sala
// sobrevivem a recarregar e quanto espaço a sala aceita no plano gratuito.

const NS = "com.igordigitos.caldronis";
const COUNTER_KEY = `${NS}/contador`;
const SIZE_TEST_KEY = `${NS}/teste-espaco`;
const LAST_ID_KEY = `${NS}/ultimo-id`;

const app = document.querySelector<HTMLElement>("#app")!;
const status = document.querySelector<HTMLElement>("#status")!;

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Partial<HTMLElementTagNameMap[K]> = {},
  ...children: (Node | string)[]
): HTMLElementTagNameMap[K] {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...children);
  return node;
}

function readLocal(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeLocal(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Sem armazenamento local (aba anônima, por exemplo): o teste segue sem ele.
  }
}

async function render() {
  const [name, role, playerId, theme] = await Promise.all([
    OBR.player.getName(),
    OBR.player.getRole(),
    OBR.player.getId(),
    OBR.theme.getTheme(),
  ]);
  document.documentElement.dataset.theme = theme.mode;

  const previousId = readLocal(LAST_ID_KEY);
  writeLocal(LAST_ID_KEY, playerId);
  const idNote =
    previousId === null
      ? "primeira vez neste aparelho"
      : previousId === playerId
        ? "igual ao da última vez"
        : "diferente da última vez";

  const counterValue = el("span", { className: "counter", textContent: "…" });
  const minus = el("button", { textContent: "−", ariaLabel: "Diminuir" });
  const plus = el("button", { textContent: "+", ariaLabel: "Aumentar", className: "primary" });

  const sizes = [4, 8, 12, 15, 20, 32];
  const keepButtons = sizes.map((kb) => el("button", { textContent: `${kb} KB` }));
  const clearButton = el("button", { textContent: "Apagar teste" });
  const usage = el("p", { className: "ok" });
  const lastRequest = el("p", { className: "muted" });
  const LAST_REQUEST_KEY = `${NS}/ultimo-pedido`;
  const showLastRequest = () => {
    const saved = readLocal(LAST_REQUEST_KEY);
    lastRequest.textContent = saved ? `Último pedido neste aparelho: ${saved}.` : "";
  };
  showLastRequest();

  status.remove();
  app.append(
    el("h2", { textContent: "O espaço persiste?" }),
    el("p", {
      className: "muted",
      textContent:
        "Toque num tamanho, recarregue a página e veja se o uso continua nesse tamanho. Comece pelo menor e vá subindo.",
    }),
    el("div", { className: "row" }, ...keepButtons, clearButton),
    usage,
    lastRequest,
    el("h2", { textContent: "Quem é você" }),
    el(
      "dl",
      {},
      el("dt", { textContent: "Nome" }),
      el("dd", { textContent: name }),
      el("dt", { textContent: "Papel" }),
      el("dd", { textContent: role === "GM" ? "Mestre" : "Jogador" }),
      el("dt", { textContent: "ID" }),
      el("dd", {}, el("code", { textContent: playerId }), el("br"), el("span", { className: "muted", textContent: idNote })),
      el("dt", { textContent: "Sala" }),
      el("dd", {}, el("code", { textContent: OBR.room.id })),
    ),
    el("h2", { textContent: "Contador salvo na sala" }),
    el("div", { className: "row" }, minus, counterValue, plus),
    el("p", {
      className: "muted",
      textContent: "Mude o número, recarregue a página e veja se ele continua. Todos na sala veem o mesmo valor.",
    }),
  );

  const showRoom = (metadata: Record<string, unknown>) => {
    const value = metadata[COUNTER_KEY];
    counterValue.textContent = String(typeof value === "number" ? value : 0);
    const kept = metadata[SIZE_TEST_KEY];
    usage.textContent =
      `Em uso na sala: ${(JSON.stringify(metadata).length / 1024).toFixed(1)} KB` +
      (typeof kept === "string" ? ` (teste mantido: ${(kept.length / 1024).toFixed(0)} KB).` : ".");
  };
  showRoom(await OBR.room.getMetadata());
  OBR.room.onMetadataChange(showRoom);

  const allButtons = [...keepButtons, clearButton];
  const keep = async (kb: number | undefined) => {
    allButtons.forEach((button) => (button.disabled = true));
    usage.className = "ok";
    writeLocal(
      LAST_REQUEST_KEY,
      `${kb === undefined ? "apagar" : `${kb} KB`} às ${new Date().toLocaleTimeString("pt-BR")}`,
    );
    showLastRequest();
    try {
      await OBR.room.setMetadata({ [SIZE_TEST_KEY]: kb === undefined ? undefined : "x".repeat(kb * 1024) });
    } catch (error) {
      usage.className = "bad";
      usage.textContent = `Falhou: ${error instanceof Error ? error.message : JSON.stringify(error)}`;
    } finally {
      allButtons.forEach((button) => (button.disabled = false));
    }
  };
  keepButtons.forEach((button, index) => button.addEventListener("click", () => void keep(sizes[index])));
  clearButton.addEventListener("click", () => void keep(undefined));

  const change = async (delta: number) => {
    const metadata = await OBR.room.getMetadata();
    const current = typeof metadata[COUNTER_KEY] === "number" ? (metadata[COUNTER_KEY] as number) : 0;
    await OBR.room.setMetadata({ [COUNTER_KEY]: current + delta });
  };
  minus.addEventListener("click", () => void change(-1));
  plus.addEventListener("click", () => void change(1));

}

if (OBR.isAvailable) {
  OBR.onReady(() => {
    render().catch((error) => {
      status.className = "bad";
      status.textContent = `Erro: ${error instanceof Error ? error.message : String(error)}`;
    });
  });
} else {
  status.className = "muted";
  status.textContent = "Esta página funciona dentro do Owlbear Rodeo. Adicione a extensão numa sala pelo manifest.json.";
}
