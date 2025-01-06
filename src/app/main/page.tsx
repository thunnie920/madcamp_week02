import TopBar from "@components/TopBar";
import GraphComponent from "@components/GraphComponent";
import CoinListComponent from "@components/CoinListComponent";
import ChatComponent from "@components/ChatComponent";
import AIChatComponent from "@components/AIChatComponent";

export default function Main() {
  return (
    <div style={{ minWidth: "1000px" }}>
      <div>
        <TopBar />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <GraphComponent />
        <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
          <ChatComponent />
          <CoinListComponent />
          <AIChatComponent />
        </div>
      </div>
    </div>
  );
}
